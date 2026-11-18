import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

//configuracion
export default defineConfig({
  plugins: [react()],
  envDir: resolve(dirname(fileURLToPath(import.meta.url)), '../backend'),
  server: {
    host: 'localhost',
    port: 5173,
    // https: {
    //   key: fs.readFileSync('./certs/localhost.key'),
    //   cert: fs.readFileSync('./certs/localhost.crt'),
    // }
  }
})