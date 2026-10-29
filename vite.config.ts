import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import Markdown from './plugins/md-loader.js'
import Binary from './plugins/binary-loader.js'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    Markdown() as Plugin,
    Binary() as Plugin
  ],
  base: '/ai_agent_frontend/',

  server: {
    port: 3000,
    proxy: {
      '/dev-api': {
        target: 'http://127.0.0.1:8004',   // 原来 117.72.163.123:25173
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
      '/apiB': {
        target: 'http://127.0.0.1:8004',   // 原来 117.72.163.123:25173
        changeOrigin: true,
        rewrite: path => path.replace(/^\/apiB/, '')
      }
    }
  }
})