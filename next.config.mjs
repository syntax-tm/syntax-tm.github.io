import version from './package.json' with { type: 'json' };
import { fileURLToPath } from "url";
import path from 'path';
import WebpackShellPluginNext from "webpack-shell-plugin-next";
//import prebuildTask from './scripts/preBuild.mjs';

//prebuildTask();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dependencies = Object.keys(version.dependencies).join('\n');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Set base path. This is the slug of your GitHub repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  compiler: {
    styledComponents: true,
  },
  logging: {
    browserToTerminal: true,
  },

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
  experimental: {
    // TODO: add missing Suspense and remove this suppression
    // missingSuspenseWithCSRBailout: false,
    viewTransition: true,
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
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer && !dev) {
      config.plugins.push(
        new WebpackShellPluginNext({
          onBuildStart: {
            scripts: [
              () => {
                console.log("Starting pre-build tasks...");
              },
              "node ./scripts/prebuild.cjs",
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
