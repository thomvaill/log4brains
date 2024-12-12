module.exports = {
  root: true,
  env: {
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  ignorePatterns: [
    "**/*.js",
    "**/*.d.ts",
    "**/*.stories.tsx", // temporary disabled
    "dist",
    "node_modules"
  ],
  plugins: ["jest", "sonarjs", "promise", "@typescript-eslint", "react"],
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:sonarjs/recommended",
    "plugin:promise/recommended",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb/hooks",
    "prettier/react"
  ],
  rules: {
    "import/prefer-default-export": "off", // @adr 20200927-avoid-default-exports
    "import/no-default-export": "error", // @adr 20200927-avoid-default-exports
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
    "sonarjs/no-duplicate-string": "off",
    "react/prefer-stateless-function": [2, { ignorePureComponents: false }],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function"
      }
    ],
    "react/require-default-props": [2, { ignoreFunctionalComponents: true }], // DefaultProps are deprecated for functional components (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md)
    "react/jsx-props-no-spreading": "off", // For HOC
    "no-void": [2, { allowAsStatement: true }], // For React.useEffect() with async functions
    "react/display-name": "off"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"] // Forces Jest to include these files
    },
    {
      files: "*.tsx",
      rules: {
        "sonarjs/cognitive-complexity": [2, 18], // React functions are usually more complex
        "@typescript-eslint/explicit-module-boundary-types": "off" // @adr web/20200927-avoid-react-fc-type
      }
    },
    // Temporary disabled
    // {
    //   files: ["src/**/*.stories.tsx"], // Storybook
    //   rules: {
    //     "import/no-extraneous-dependencies": "off",
    //     "import/no-default-export": "off",
    //     "react/function-component-definition": "off"
    //   }
    // },
    {
      files: "*", // All non-React files
      excludedFiles: "*.tsx",
      rules: {
        "react/static-property-placement": "off"
      }
    },
    {
      files: "**.test.ts", // Jest
      rules: {
        "max-classes-per-file": "off",
        "import/no-extraneous-dependencies": "off",
        "no-new": "off",
        "no-empty": "off"
      }
    }
  ]
};
