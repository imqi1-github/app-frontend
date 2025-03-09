import "@assets/css/vue-toastification.css";
import '@/assets/main.css'

import {createApp} from 'vue'
import {createPinia} from "pinia";
import Toast, {type PluginOptions, POSITION} from "vue-toastification";
import router from "@/routes";
import App from '@/App.vue'

const app = createApp(App);
const pinia = createPinia();

const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
  maxToasts: 5,
  transition: "Vue-Toastification__fade"
};

app.use(Toast, options);
app.use(router);
app.use(pinia);

app.mount('#app')