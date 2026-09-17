import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    ...compat.config({
        env: {
            browser: true,
            es2021: true,
        },
        settings: {
            react: {
                version: "19",
            },
        },
        extends: [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
        ],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: ["@typescript-eslint"],
        rules: {
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { ignoreRestSiblings: true },
            ],
        },
    }),
];
