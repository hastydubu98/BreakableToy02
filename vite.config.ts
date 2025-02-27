import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
          proxy: {
              "/me": {
                  target: "http://localhost:8080", // Backend URL
                  changeOrigin: true,
                  secure: false,
              },
          },
          port: 9090
      },
})
