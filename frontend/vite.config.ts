import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^@mantine\/core$/,
        replacement: fileURLToPath(new URL('./src/shims/mantine-core.ts', import.meta.url)),
      },
    ],
  },
})
