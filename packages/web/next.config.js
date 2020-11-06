const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

// next-transpile-modules is not needed for @log4brains/core,
// but it brings a better DX because it automatically triggers a Webpack re-build
// when a change is made in this dependency
const withTM = require("next-transpile-modules")(["@log4brains/core"]);

module.exports = withBundleAnalyzer(
  withTM({
    reactStrictMode: true,
    // basePath: "", // TODO: make this customizable
    target: "serverless",
    poweredByHeader: false,
    serverRuntimeConfig: {
      PROJECT_ROOT: __dirname // https://github.com/vercel/next.js/issues/8251
    },
    webpack: function (config) {
      // Only used to load default-index.md
      config.module.rules.push({
        test: /\.md$/,
        use: "raw-loader"
      });
      return config;
    },
    future: {
      excludeDefaultMomentLocales: true
    }
  })
);
