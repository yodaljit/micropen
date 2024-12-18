import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      rollupTypes: true,
      clearPureImport: true,
      insertTypesEntry: true,
      bundledPackages: ['micropen'],
      compilerOptions: {
        composite: false,
        incremental: false
      }
    })
  ],
  build: {
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/editor.ts'),
        'react/index': resolve(__dirname, 'src/react/index.ts'),
        'vue/index': resolve(__dirname, 'src/vue/index.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'mjs' : 'cjs';
        return `${entryName}.${extension}`;
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'vue'],
      output: {
        preserveModules: false,
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          vue: 'Vue'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'index.css';
          }
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssCodeSplit: false,
    cssMinify: true
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
