import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
  {
    files: ["src/modules/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/pages/*", "@/pages/**"],
              message:
                "Do not import from legacy pages. Use '@/modules/<domain>/...'.",
            },
            {
              group: ["@/features/*", "@/features/**"],
              message:
                "Do not import from features inside modules. Use module-local files, shared, ui, hooks, or services.",
            },
            {
              group: ["@/modules/*/pages/*", "@/modules/*/pages/**"],
              message:
                "Avoid cross-module page imports. Share logic via services/shared/hooks, not page-to-page coupling.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/**/components/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/services/*", "@/services/**"],
              message:
                "Module components must not call APIs directly. Move API access to pages/hooks/services.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/ui/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/services/*", "@/services/**", "@/modules/*", "@/modules/**"],
              message:
                "Atomic UI components must stay framework-agnostic and free of module/API coupling.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/router.jsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/pages/*", "@/pages/**", "@/features/*", "@/features/**"],
              message:
                "Router must import route screens from '@/modules/<domain>/pages/*'.",
            },
          ],
        },
      ],
    },
  },
]);
