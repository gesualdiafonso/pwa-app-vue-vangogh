import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  BiFacebook,
  BiWhatsapp,
  CoMinutemailer,
  CoTelegramPlane,
  BiTwitter,
} from 'oh-vue-icons/icons'

addIcons(BiFacebook, BiWhatsapp, CoMinutemailer, CoTelegramPlane, BiTwitter)

const app = createApp(App)

app.component('v-icon', OhVueIcon)

app.use(router)

app.mount('#app')

// Registro do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => console.log('✅ SW registrado con suceso:', reg))
      .catch((err) => console.error('❌ Falla al registrar SW:', err))
  })
}
