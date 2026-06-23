import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Corrige o erro "Uncaught ReferenceError: global is not defined" do sockjs-client
    global: 'window',
  },
})