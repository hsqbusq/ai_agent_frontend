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
  base: '/',

  server: {
    port: 3000,
    proxy: {
      '/dev-api': {
        target: 'http://117.72.163.123:25173',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },

      '/feishu': {
        target: 'https://open.feishu.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/feishu/, '/'),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['access-control-allow-methods'] = 'POST,GET,OPTIONS'
            proxyRes.headers['access-control-allow-headers'] = 'Content-Type,Authorization'
            proxyRes.headers['access-control-allow-origin'] = '*'
          })
        }
      }
    }
  }
})