import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';
import {VitePWA} from 'vite-plugin-pwa'
import {readFileSync} from "fs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate', // 自动更新 SW
      manifest: {
        name: '秦皇岛本地宝',
        short_name: '小岛本地宝',
        icons: [
          {
            src: '/logo.webp',
            sizes: '434x434',
            type: 'image/webp ',
            purpose: "any"
          },
        ],
        start_url: '/',
        display: 'fullscreen',
        background_color: '#ffffff',
        theme_color: '#000000'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url))
    },
  },
  build: {
    cssCodeSplit: true,  // 开启 CSS 分离
    minify: 'esbuild',  // 使用 esbuild 进行压缩
  },
  server: {
    https: {
      key: readFileSync('./https/localhost-key.pem'),
      cert: readFileSync('./https/localhost.pem'),
    },
    host: 'localhost', // 可选，指定主机
    port: 5173, // 可选，指定端口
  },
})