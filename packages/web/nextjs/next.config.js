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
    VERSION: process.env.HIDE_LOG4BRAINS_VERSION ? "" : packageJson.version
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
    const originalExcludeMethod = config.module.rules[0].exclude;
    config.module.rules[0].exclude = (excludePath) => {
      if (!originalExcludeMethod(excludePath)) {
        return false;
      }
      return /node_modules/.test(excludePath.replace(config.context, ""));
    };

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
    ignoreBuildErrors: process.env.LOG4BRAINS_PHASE !== "initial-build"
  }
});
