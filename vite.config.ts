import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            }
        },
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    }
});
