import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import { ParserOptions } from "@typescript-eslint/parser";

const projectServiceParserOptions: ParserOptions = {
  projectService: true,
};

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { '@typescript-eslint': tseslint.plugin, },
    extends: [
      //js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          globals: globals.browser,
          parserOptions: projectServiceParserOptions,
        },
      }
    ],
    rules: {
      "semi": "warn",
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "comma-dangle": ["warn", "always-multiline"],
      "@typescript-eslint/no-floating-promises": [
        "warn", { ignoreVoid: true }
      ]
    },
  },
  globalIgnores([
    // default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'next-env.d.ts',
  ]),
]);
