const base = require("../../jest.config.base");
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");
const packageJson = require("./package");

module.exports = {
  ...base,
  name: packageJson.name,
  displayName: packageJson.name,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/"
  }),
  setupFiles: ["<rootDir>/src/polyfills.ts"]
};
