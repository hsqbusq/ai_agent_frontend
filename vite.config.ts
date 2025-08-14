import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import Markdown from './plugins/md-loader.js';
import Binary from './plugins/binary-loader.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    Markdown() as Plugin,
    Binary() as Plugin,
  ],
  base: '/web-scrcpy/', // 设置为您的 GitHub 仓库名

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://117.72.163.123:19000', 
        changeOrigin: true,              
        rewrite: (path) => path
      },
      '/adb': {
        target: 'http://117.72.163.123:19000', 
        changeOrigin: true,              
        rewrite: (path) => path
      },
      '/chat': {
        target: 'http://117.72.163.123:19000',
        changeOrigin: true,              
        rewrite: (path) => path
      },
      '/result': {
        target: 'http://117.72.163.123:19000', 
        changeOrigin: true,              
        rewrite: (path) => path
      },
      '/v1': {
        target: 'http://117.72.163.123:19000',
        changeOrigin: true,             
        rewrite: (path) => path
      },
      '/test_list': {
        target: 'http://117.72.163.123:19000',
        changeOrigin: true,             
        rewrite: (path) => path
      },
      '/test_logs': {
        target: 'http://117.72.163.123:19000',
        changeOrigin: true,             
        rewrite: (path) => path
      },
    }
  }
});

