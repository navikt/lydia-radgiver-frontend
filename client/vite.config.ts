import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const sri = await import("@small-tech/vite-plugin-sri");
    return {
        plugins: [react(), Inspect(), sri.default()],
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
    };
});
