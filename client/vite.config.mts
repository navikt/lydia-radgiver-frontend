import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@features": path.resolve(__dirname, "src/features"),
            "@mocks": path.resolve(__dirname, "__mocks__"),
        },
    },
    server: {
        host: true,
        proxy: {
            "/api": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            },
            "/proxy": {
                target: "http://127.0.0.1:3000",
                changeOrigin: true,
            },
            "/innloggetAnsatt": "http://127.0.0.1:3000",
            "/csrf-token": "http://127.0.0.1:3000",
        },
    },
    build: {
        sourcemap: true,
    },
});
