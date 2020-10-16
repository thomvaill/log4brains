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
  ignorePatterns: ["**/*.js", "**/*.d.ts"],
  plugins: ["jest", "sonarjs", "promise", "@typescript-eslint"],
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
    "prettier/@typescript-eslint"
  ],
  rules: {
    // [Project-specific] no default exports (@adr-0005)
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "@typescript-eslint/restrict-template-expressions": "off"
  },
  overrides: [
    // Specific rules for Jest tests only
    {
      files: "**.test.ts",
      rules: {
        "max-classes-per-file": "off",
        "import/no-extraneous-dependencies": "off",
        "no-new": "off",
        "sonarjs/no-duplicate-string": "off",
        "no-empty": "off"
      }
    }
  ]
};
