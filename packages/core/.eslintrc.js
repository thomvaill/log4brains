const path = require("path");

module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json")
  },
  extends: ["../../.eslintrc"]
};
