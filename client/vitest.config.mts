/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // @ts-expect-error – plugin type-mismatch mellom Vite 7 (vitest 3) og Vite 8 (app)
    plugins: [react()],
    envDir: path.resolve(__dirname, "src"),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@features": path.resolve(__dirname, "src/features"),
            "@mocks": path.resolve(__dirname, "__mocks__"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.test.{ts,tsx,js,jsx}"],
        css: {
            modules: {
                classNameStrategy: "non-scoped",
            },
        },
        server: {
            deps: {
                inline: ["@navikt/ds-react"],
            },
        },
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/**/*.test.{ts,tsx}",
                "src/**/*.d.ts",
                "src/**/__mocks__/**",
            ],
        },
    },
});
