module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: [
    "eslint:recommended",
    "google"
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "max-len": ["error", {"code": 120, "ignoreUrls": true}], // Added this line
    "indent": ["error", 2], // Added this line
    "comma-dangle": ["error", "never"], // Added for consistency
    "require-jsdoc": "off" // Disable JSDoc requirement
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true
      },
      rules: {}
    }
  ],
  globals: {}
};
