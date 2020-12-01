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
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname, // https://github.com/vercel/next.js/issues/8251
    VERSION: packageJson.version
  },
  webpack: function (config, { webpack, buildId, isServer }) {
    // Only used to load default-index.md
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader"
    });

    // For cache invalidation purpose (thanks https://github.com/vercel/next.js/discussions/14743)
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NEXT_BUILD_ID": JSON.stringify(buildId)
      })
    );

    // Webpack issue: treeshaking does not seem to work correctly when using Log4brains from NPM
    // Unfortunately we can't reproduce this bug locally
    // TODO: to investigate. We should not have to write this hotfix:
    if (!isServer) {
      config.node = {
        fs: "empty",
        child_process: "empty"
      };
    }

    return config;
  },
  future: {
    excludeDefaultMomentLocales: true
  }
});
