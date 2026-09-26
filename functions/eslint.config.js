import js from "@eslint/js";
import tseslint from "typescript-eslint";
import google from "eslint-config-google";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  {
    ignores: ["lib/**", "node_modules/**", "eslint.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,ts}"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...google.rules,
      quotes: ["error", "double"],
      "import/no-unresolved": "off",
      indent: ["error", 2],
      "object-curly-spacing": ["error", "always"],
      "linebreak-style": "off",
      "require-jsdoc": "off",
      "valid-jsdoc": "off",
    },
  },
);
