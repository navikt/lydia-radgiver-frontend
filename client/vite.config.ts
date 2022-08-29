import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
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
        }
    }
})