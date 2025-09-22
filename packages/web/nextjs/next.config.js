const path = require("path");
const fs = require("fs");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

const packageJson = require(`${
  fs.existsSync(path.join(__dirname, "package.json")) ? "./" : "../"
}package.json`);

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  target: "serverless",
  poweredByHeader: false,
  trailingSlash: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname, // https://github.com/vercel/next.js/issues/8251
    VERSION: packageJson.version
  },
  webpack(config, { webpack, buildId }) {
    // For cache invalidation purpose (thanks https://github.com/vercel/next.js/discussions/14743)
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NEXT_BUILD_ID": JSON.stringify(buildId)
      })
    );

    // #NEXTJS-HACK
    // Fix when the app is running inside `node_modules` (https://github.com/vercel/next.js/issues/19739)
    // TODO: remove this fix when this PR is merged: https://github.com/vercel/next.js/pull/19749
    if (config.module.rules[0] && config.module.rules[0].exclude) {
      const originalExclude = config.module.rules[0].exclude;

      // #NEXTJS-HACK - omar apparently this changed in webpack 5
      // Check if exclude is already a function
      if (typeof originalExclude === "function") {
        config.module.rules[0].exclude = (excludePath) => {
          if (!originalExclude(excludePath)) {
            return false;
          }
          return /node_modules/.test(excludePath.replace(config.context, ""));
        };
      } else {
        // If it's not a function, create a new exclude function
        config.module.rules[0].exclude = (excludePath) => {
          return /node_modules/.test(excludePath.replace(config.context, ""));
        };
      }
    }

    // To avoid issues with fsevents during the build, especially on macOS
    config.externals.push("chokidar");

    return config;
  },
  future: {
    excludeDefaultMomentLocales: true
  },
  typescript: {
    // We check typescript errors only during the first build, not during "log4brains build",
    // for performance purpose and to avoid importing @types/* packages as dependencies
    // #NEXTJS-HACK Exception: typescript, @types/react and @types/node are required because of the Next.js verifyTypeScriptSetup() pre-checks
    // TODO: in the future, try to compile the Next.js app to JS during the build phase to avoid depending on typescript dependencies at the runtime
    ignoreBuildErrors: process.env.LOG4BRAINS_PHASE !== "initial-build"
  }
});
