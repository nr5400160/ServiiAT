import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

//configuracion
export default defineConfig({
  plugins: [react()],
  server: {
    host:'localhost',
    port:5173,
    https: {
      key: fs.readFileSync('./boyaca/localhost.key'),
      cert: fs.readFileSync('./boyaca/localhost.crt')
    }
  }
})