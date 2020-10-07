// next-transpile-modules is not needed for @log4brains/core,
// but it brings a better DX because it automatically triggers a Webpack re-build
// when a change is made in this dependency
const withTM = require("next-transpile-modules")(["@log4brains/core"]);

module.exports = withTM({
  reactStrictMode: true,
  // basePath: "", // TODO: make this customizable
  target: "serverless",
  poweredByHeader: false
});
