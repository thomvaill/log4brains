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
  plugins: ["react"],
  extends: [
    "../../.eslintrc",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb/hooks",
    "prettier/react"
  ],
  rules: {
    // [Next.js] we don't have to import React explicitly
    "react/react-in-jsx-scope": "off",
    // [Project-specific] prefer React function components (@adr-todo)
    "react/prefer-stateless-function": [2, { ignorePureComponents: false }],
    // [Project-specific] harmonize React function component types (@adr-todo)
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function"
      }
    ],
    // defaultProps are deprecated for functional components (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md)
    "react/require-default-props": [2, { ignoreFunctionalComponents: true }],
    // [Project-specific] we allow props spreading because we have too many HOC
    "react/jsx-props-no-spreading": "off",
    // [Project-specific] allow void for floating Promises (for React.useEffect() with async functions)
    "no-void": [2, { allowAsStatement: true }],
    // React functions are usually more complex than regular functions
    "sonarjs/cognitive-complexity": [2, 18]
  },
  overrides: [
    // Specific rules for TSX only
    {
      files: ["*.tsx"],
      rules: {
        // [Project-specific] avoid React.FC (@adr-0006)
        "@typescript-eslint/explicit-module-boundary-types": "off",
        // [Project-specific]
        "react/display-name": "off"
      }
    },
    // Specific rules for Next.js pages and api routes only
    {
      files: ["src/pages/**/*.tsx", "src/pages/api/**/*.ts"],
      rules: {
        // [Project-specific] avoid React.FC (@adr-0006)
        "import/no-default-export": "off"
      }
    },
    // Specific rules for Storybook stories only
    {
      files: ["src/**/*.stories.tsx"],
      rules: {
        // because storybook is a devDependency
        "import/no-extraneous-dependencies": "off",
        "import/no-default-export": "off",
        "react/function-component-definition": "off"
      }
    }
  ],
  globals: {
    // [Next.js] we don't have to import React explicitly
    React: "writable"
  }
};
