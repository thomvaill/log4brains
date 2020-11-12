const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  // basePath: "", // TODO: make this customizable
  target: "serverless",
  poweredByHeader: false,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname // https://github.com/vercel/next.js/issues/8251
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

    return config;
  },
  future: {
    excludeDefaultMomentLocales: true
  }
});
