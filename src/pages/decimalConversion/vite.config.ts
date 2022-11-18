import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // root: resolve('./src'), //  入口index.html，注意入口js应该与index.html 同一目录下（只能写到目录，不能写到具体文件）
  base: './', // 打包后的路径是基于这个path为准访问的
  build: {
    rollupOptions: {
      input:'./index.html', // 配置入口文件
      // project:resolve(__dirname,"project.html") // 配置入口文件
      // input: {
        // main: resolve(__dirname, './index.html'),
      // },
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      }
    }
    
  },
  publicDir: resolve('static'),//静态资源文件夹
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
