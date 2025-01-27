import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPresistedState from 'pinia-plugin-persistedstate';

import App from '@/App.vue';
import router from '@/router';

import formPlugin from './form';
import i18n from './locales';

import 'tailwindcss/tailwind.css';
import './assets/styles/index.css';

const pinia = createPinia();
pinia.use(piniaPresistedState);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(formPlugin);
app.use(i18n);
app.mount('#app');
