import { createDefaultPreset } from "ts-jest";
import { TextEncoder, TextDecoder } from "util";
import type { Config } from "jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "core-js"],
    testEnvironment: "jest-environment-jsdom",
    moduleDirectories: ["node_modules", "<rootDir>/"],
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
        "@navikt/ds-css": "jest-transform-stub",
        "\\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2)$":
            "<rootDir>/__mocks__/fileMock.js",
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
