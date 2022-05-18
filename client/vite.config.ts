import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), Inspect()],
    server: {
        host: true,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
            "/innloggetAnsatt": "http://localhost:8080",
        },
    },
    build: {
        sourcemap: true,
    },
});
