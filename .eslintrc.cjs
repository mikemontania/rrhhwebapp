module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    "no-console": "warn",
    "react/prop-types": "off",
    "react/self-closing-comp": "warn",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/explicit-function-return-type": "off",
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "parserOptions": {
    "project": ["tsconfig.json"],
    "createDefaultProgram": true
  },
  "extends": [
    "plugin:react/recommended",
    "standard-with-typescript",
    "plugin:react/jsx-runtime",
  ],
}
