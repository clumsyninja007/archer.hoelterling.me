import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import {VueQueryPlugin} from "@tanstack/vue-query";

import './main.css';
import 'primeicons/primeicons.css'

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
  .use(VueQueryPlugin)
  .mount('#app')
