import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4010,
    open: true
  },
  // 文件夹别名设置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
