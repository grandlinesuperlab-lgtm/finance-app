import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Tokens and mixins are available in every component's <style lang="scss">
        // without an @use line. Only definitions live here — no rules are emitted.
        additionalData: `@use "@/assets/styles/variables" as *;\n@use "@/assets/styles/mixins" as mx;\n`,
      },
    },
  },
})
