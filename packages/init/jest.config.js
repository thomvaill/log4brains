const { pathsToModuleNameMapper } = require("ts-jest/utils");
const base = require("../../jest.config.base");
const { compilerOptions } = require("./tsconfig");
const packageJson = require("./package");

module.exports = {
  ...base,
  name: packageJson.name,
  displayName: packageJson.name,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/"
  })
};
