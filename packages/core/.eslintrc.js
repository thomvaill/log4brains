const path = require("path");

module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json")
  },
  extends: ["../../.eslintrc"],
  rules: {
    "react/static-property-placement": "off" // we don't use React here
  }
};
