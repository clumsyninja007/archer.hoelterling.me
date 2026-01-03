import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import {VueQueryPlugin} from "@tanstack/vue-query";
import AnimateOnScroll from 'primevue/animateonscroll';

import './main.css';
import 'primeicons/primeicons.css'

const CustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{cyan.50}',
      100: '{cyan.100}',
      200: '{cyan.200}',
      300: '{cyan.300}',
      400: '{cyan.400}',
      500: '{cyan.500}',
      600: '{cyan.600}',
      700: '{cyan.700}',
      800: '{cyan.800}',
      900: '{cyan.900}',
      950: '{cyan.950}'
    }
  }
});

createApp(App)
  .use(router)
  .use(i18n)
  .use(PrimeVue, {
    theme: {
      preset: CustomPreset,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
  .use(ToastService)
  .use(VueQueryPlugin)
  .directive('animateonscroll', AnimateOnScroll)
  .mount('#app')
