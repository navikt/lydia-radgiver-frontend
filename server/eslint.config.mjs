import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    {
        ignores: ["build/**", "coverage/**", "node_modules/**"],
    },
    ...compat.config({
        env: {
            es2021: true,
            node: true,
            jest: true,
        },
        extends: [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
        ],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: ["@typescript-eslint", "import"],
        settings: {
            "import/resolver": {
                typescript: { project: "./tsconfig.json" },
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "import/no-cycle": ["error", { maxDepth: 10 }],
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    "newlines-between": "never",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
        },
    }),
];
