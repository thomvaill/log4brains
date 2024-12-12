const base = require("../../../jest.config.base");
const packageJson = require("./package");

module.exports = {
  ...base,
  name: packageJson.name,
  displayName: packageJson.name,
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  }
};
