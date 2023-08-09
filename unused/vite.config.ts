import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import * as path from 'node:path'
import url from "node:url";
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
        "@": path.resolve(__dirname)
    }
  }
})
