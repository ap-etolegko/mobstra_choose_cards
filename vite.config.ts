import preact from '@preact/preset-vite';
import path from 'node:path';
import { defineConfig } from 'vite';
// @ts-ignore
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import zipPack from 'vite-plugin-zip-pack';

export default defineConfig({
    base: './',
    plugins: [preact(), cssInjectedByJsPlugin(), zipPack()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                // Fixed names: dist/index.html is hand-edited after build, a hash would break it
                entryFileNames: 'assets/app.js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name][extname]',
                format: 'es'
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
});
