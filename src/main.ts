import { createApp } from 'vue'
import App from './App.vue'
import "./font/iconfont";
import "./font/iconfont.css";

import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';

const app = createApp(App);
app.use(VueLoaders);
app.mount('#app')
