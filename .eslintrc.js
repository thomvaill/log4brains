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
    "import/no-default-export": "error"
  }
};
