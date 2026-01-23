import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            "/api": {
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
