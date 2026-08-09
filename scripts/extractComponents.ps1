$ErrorActionPreference = 'Stop'

$ignoredComponents = @(
    "Menu*",
    "Modal*",
    "*Icon"
)

function Get-ComponentName
{
    param(
        [Parameter(Mandatory, Position = 0, ValueFromPipeline = $true)]
        [string]$FullName
    )

    $results = [System.Collections.ArrayList]::new()

    $patterns = @(
        "export default function (\w+)\s*\(",
        "export const (\w+)\s*=",
        "export function (\w+)\s*"
    )

    $content = Get-Content $FullName -Raw

    foreach ($pattern in $patterns) {
        [System.Text.RegularExpressions.MatchCollection]$patternResults = [regex]::Matches($content, $pattern, 'IgnoreCase')
        if ($patternResults.Count -gt 0) {
            foreach ($result in $patternResults) {
                $isDefault = $result.Groups[0].Value -match "default"

                $name = $result.Groups[1].Value
                # skip anything starting with get/set
                if ($name -match "^(get|set)") { continue }
                # component names are always TitleCase, so ignore everything else
                if ($name -cmatch '^[a-z]') { continue }

                $export = [PSCustomObject]@{
                    name = $result.Groups[1].Value
                    isDefault = $isDefault
                }

                [void]$results.Add($export)
            }
        }
    }

    return $results
}

Set-Location $PSScriptRoot

$scriptsPath = $PSScriptRoot
$rootPath = Split-Path $scriptsPath
$srcPath = Join-Path $rootPath 'src'
$componentsPath = Join-Path $srcPath 'components'
$componentMapPath = Join-Path $componentsPath 'componentMap'
$componentMapFilePath = Join-Path $componentMapPath 'component-map.tsx'

if (!(Test-Path $componentMapPath)) {
    New-Item $componentMapPath -ItemType Directory -Force | Out-Null
}

$components = Get-ChildItem "..\src\components\" -Recurse *.tsx
    | Where-Object { $_.FullName -notmatch "(shaders)" }
    | Select-Object @{ n = 'id'; e = { $_.BaseName } },
        @{ n = 'path'; e = { [System.IO.Path]::GetRelativePath((Resolve-Path '..\src\\components\'), $_.FullName) } },
        @{ n = 'fullname'; e = { $_.FullName }},
        @{ n = 'exports'; e = { Get-ComponentName $_.FullName } }

$sb = [System.Text.StringBuilder]::new()
$importsSb = [System.Text.StringBuilder]::new()

foreach ($component in $components)
{
    $componentId = $component.id
    $exports = @($component.exports)
    $relPath = ($component.path -split "\.")[0]
    $defaultExports = $exports | Where-Object isDefault | Select-Object -ExpandProperty name
    $namedExports = $exports | Where-Object { $_.isDefault -eq $false } | Select-Object -ExpandProperty name

    foreach ($ignored in $ignoredComponents)
    {
        $defaultExports = $defaultExports | Where-Object { $_ -notlike $ignored }
        $namedExports = $namedExports | Where-Object { $_ -notlike $ignored }
    }

    if ($defaultExports) {
        $name = $defaultExports
        $importLine = "import $defaultExports from `"@components\$relPath`";".Replace('\', '/')
        [void]$importsSb.AppendLine($importLine)
        $line = "  ['$componentId', <$name />],"
        [void]$sb.AppendLine($line)
    }
    elseif ($namedExports)
    {
        $componentNames = [string]::Join(', ', $namedExports)

        $importLine = "import { $componentNames } from `"@components\$relPath`";".Replace('\', '/')
        [void]$importsSb.AppendLine($importLine)

        foreach ($componentName in $namedExports)
        {
            $name = ($componentName -creplace '[A-Z]','-$0').TrimStart('-').ToLower()
            $line = "  ['$name', <$componentName />],"
            [void]$sb.AppendLine($line)
        }
    }
}

$outputSb = [System.Text.StringBuilder]::new()

[void]$outputSb.AppendLine("import React from `"react`";")
[void]$outputSb.AppendLine($importsSb)
[void]$outputSb.AppendLine('const componentMap = new Map<string, React.ReactNode>([')
[void]$outputSb.AppendLine($sb.ToString().TrimEnd())
[void]$outputSb.AppendLine(']);')
[void]$outputSb.AppendLine()
[void]$outputSb.AppendLine('export default componentMap;')

$outputSB.ToString()

$outputSB.ToString().ReplaceLineEndings("`n") | Out-File $componentMapFilePath -Encoding utf8NoBOM -NoNewline
