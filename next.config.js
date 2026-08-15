import version from './package.json' with { type: 'json' };
import { fileURLToPath } from "url";
import path from 'path';
import { existsSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import WebpackShellPluginNext from "webpack-shell-plugin-next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dependencies = Object.keys(version.dependencies).join('\n');

let executedBuildScripts = null;

/** @type {import('next').NextConfig}*/
const nextConfig = {
  output: "export",
  basePath: "",
  compiler: {
    styledComponents: true,
  },
  logging: {
    browserToTerminal: true,
  },
  sassOptions: {
    implementation: 'sass-embedded',
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // TODO: add missing Suspense and remove this suppression
    // missingSuspenseWithCSRBailout: false,
    // staticGenerationRetryCount: 3,
  },
  env: {
    name: version.name,
    description: version.description,
    version: version.version,
    packageManger: version.packageManager,
    dependencies: dependencies,
  },
  transpilePackages: ['three'],
  turbopack: {
    root: path.join(__dirname),
    rules: {
      '*.glsl': {
        type: 'raw',
      },
      '*.hlsl': {
        type: 'raw',
      },
      '*.vert': {
        type: 'raw',
      },
    },
  },
  /** @param {import('webpack').Configuration} config */
  webpack: (config, { dev, isServer, totalPages, dir, nextRuntime, buildId }) => {

    // allows importing svgs as data URLs
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader']
    });

    if (isServer && !dev) {
      return config;
    }
    if (executedBuildScripts && executedBuildScripts === buildId) {
      return config;
    }
    config.plugins.push(
      new WebpackShellPluginNext({
        onBeforeBuild: {
          scripts: [
            () => {
              console.log("Starting pre-build tasks...");
            },
            () => {
              if (executedBuildScripts && executedBuildScripts === buildId) {
                console.log(`Skipping already completed pre-build tasks for build '${buildId}'...`);
                return;
              }

              const result = spawnSync('node', ['./scripts/prebuild.mjs'], { shell: false, encoding: 'utf8', });

              if (result.stderr) {
                console.error(result.stderr);
              }
              else if (result.stdout) {
                console.log(result.stdout);
              }

              executedBuildScripts = buildId;
            },
            () => {
              console.log("Completed pre-build tasks");
            },
          ],
          blocking: true,
          parallel: false,
          dev: false,
          safe: true,
        },
      }),
    );

    return config;
  },
};

export default nextConfig;
