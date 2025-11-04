import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import csp from "vite-plugin-csp-guard";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        csp({
            policy: {
                "script-src": ["'self'", "cdn.nav.no"],
                "script-src-elem": ["'self'", "cdn.nav.no"],
                "font-src": ["'self'", "cdn.nav.no"],
                "connect-src": ["'self'", "umami.nav.no"],
                "style-src": ["'self'", "'unsafe-inline'", "cdn.nav.no"],
                "style-src-elem": ["'self'", "'unsafe-inline'", "cdn.nav.no"],
            },
        }),
    ],
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
