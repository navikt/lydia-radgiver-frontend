import { TextEncoder, TextDecoder } from "util";
import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    moduleDirectories: ["node_modules", "<rootDir>/"],
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.{ts,tsx,js,jsx}"],
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "@navikt/ds-css": "jest-transform-stub",
        "\\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2)$":
            "<rootDir>/__mocks__/fileMock.js",
        "^@mocks/(.*)$": "<rootDir>/__mocks__/$1",
        "^@features/(.*)$": "<rootDir>/src/features/$1",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        ...tsJestTransformCfg,
    },
    globals: {
        TextEncoder,
        TextDecoder,
    },
};

export default config;
