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
        extends: [
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:jsx-a11y/recommended",
        ],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: ["react", "@typescript-eslint", "jsx-a11y", "import"],
        settings: {
            react: {
                version: "19",
            },
            "import/resolver": {
                typescript: { project: "./tsconfig.json" },
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
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
            // A11y – løft trygge regler til error.
            // Disse fanger reelle tilgjengelighetsbugs uten falske positiver.
            "jsx-a11y/alt-text": "error",
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/anchor-is-valid": "error",
            "jsx-a11y/aria-props": "error",
            "jsx-a11y/aria-role": "error",
            "jsx-a11y/aria-unsupported-elements": "error",
            "jsx-a11y/heading-has-content": "error",
            "jsx-a11y/iframe-has-title": "error",
            "jsx-a11y/img-redundant-alt": "error",
            "jsx-a11y/no-redundant-roles": "error",
            "jsx-a11y/role-has-required-aria-props": "error",
            "jsx-a11y/role-supports-aria-props": "error",
            "jsx-a11y/scope": "error",
        },
    }),
];
