const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');
const { spawn, sync } = require('cross-spawn');

const d = new Date();

const buildDate = d.toISOString().split('T')[0];
const buildTime = d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });

const tzLongName = new Intl.DateTimeFormat('en-US', { timeZoneName: 'long' })
  .formatToParts(new Date())
  .find(part => part.type === 'timeZoneName').value;
const tzName = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
  .formatToParts(new Date())
  .find(part => part.type === 'timeZoneName').value;

const t = d.getTime();

// use cross-spawn to execute the command in a way that works across platforms
var shell = os.platform() === 'win32' ? 'C:\\windows\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe' : '/bin/bash';
var output = spawn.sync('yarn info next --name-only', { shell: shell, encoding: 'utf8' }).output;

const versionRegex = new RegExp(":(?<version>[\\d+|\\.]+)");
const result = versionRegex.exec(output);
const nextJsVersion = result ? result.groups.version : "Unknown";

const envContent = `
NEXT_PUBLIC_BUILD_DATETIME="${buildDate} ${buildTime}"
NEXT_PUBLIC_BUILD_DATE="${buildDate}"
NEXT_PUBLIC_BUILD_DATE_LOCAL="${d.toLocaleDateString('en-US')}"
NEXT_PUBLIC_BUILD_TIME="${buildTime}"
NEXT_PUBLIC_BUILD_TIME_LOCAL="${d.toLocaleTimeString('en-US', { hour12: true })}"
NEXT_PUBLIC_TZ_LONG="${tzLongName}"
NEXT_PUBLIC_TZ_SHORT="${tzName}"
NEXT_PUBLIC_NODE_VERSION="${process.version}"
NEXT_PUBLIC_NEXTJS_VERSION="${nextJsVersion}"
`;

console.log('.env file contents:');
console.log(envContent);

fs.writeFileSync('.env', envContent.trim());

console.log('Created .env file successfully');
