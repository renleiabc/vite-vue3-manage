import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import i18n from './locale';
import '@/assets/style/global.less';
import router from './router';
import store from './store';
import '@/api/http';
import './mock';

const app = createApp(App);
app.use(router);
app.use(ArcoVue, {});
app.use(store);
app.use(ArcoVueIcon);
app.use(i18n);
app.mount('#app');
