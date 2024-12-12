const path = require("path");

module.exports = {
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    project: path.join(__dirname, "tsconfig.dev.json")
  },
  extends: ["../../../.eslintrc"],
  overrides: [
    {
      files: ["src/pages/**/*.tsx", "src/pages/api/**/*.ts"], // Next.js pages and api routes
      rules: {
        "import/no-default-export": "off"
      }
    }
  ]
};
