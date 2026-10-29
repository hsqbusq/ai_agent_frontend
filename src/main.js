import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
})

createApp(App)
  .use(vuetify)
  .use(ElementPlus)
  .use(router)
  .mount('#app')