import version from './package.json' with { type: 'json' };
import { fileURLToPath } from "url";
import path from 'path';
import WebpackShellPluginNext from "webpack-shell-plugin-next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dependencies = Object.keys(version.dependencies).join('\n');

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
  webpack: (config, { dev, isServer }) => {
    if (isServer && !dev) {
      config.plugins.push(
        new WebpackShellPluginNext({
          onBuildStart: {
            scripts: [
              () => {
                console.log("Starting pre-build tasks...");
              },
              "node ./scripts/prebuild.mjs",
              () => {
                console.log("Completed pre-build tasks");
              },
            ],
            blocking: true,
            parallel: false,
          },
          onBuildEnd: {
            scripts: [
              () => {
                console.log("Build completed. Starting post-build tasks...");
              },
            ],
          },
        }),
      );
    }

    return config;
  },
};

export default nextConfig;
