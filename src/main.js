// main.js
import { createApp, ref } from 'vue';
import App from './App.vue';
import router from './router';

// 引入 Vuetify
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// 引入 Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

// 定义 udid 变量
const udid = ref('');

// 定义 fetchUdid 函数
const fetchUdid = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/dev-api/adb/devices', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log(response);
          if (response.code === '200' && response.result.length > 0) {
            udid.value = response.result[0];
            console.log('udid:', udid.value);
            resolve();
          } else {
            console.error('No udid found in the response.');
            reject(new Error('No udid found in the response.'));
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      }
    };
    xhr.send();
  });
};

fetchUdid()
  .then(() => {
    const app = createApp(App);

    app.config.globalProperties.$udid = udid;

    app.use(vuetify);

    app.use(ElementPlus);

    app.use(router);

    app.mount('#app');
  })
  .catch((error) => {
    console.error('Failed to fetch udid:', error);
    const app = createApp(App);

    app.config.globalProperties.$udid = udid;

    app.use(vuetify);

    app.use(ElementPlus);

    app.use(router);

    // 挂载应用
    app.mount('#app');
  });
