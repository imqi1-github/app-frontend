import "vue-toastification/dist/index.css";
import '@/assets/main.css'

import {createApp} from 'vue'
import Toast, {type PluginOptions, POSITION} from "vue-toastification";
import router from "@/routes";
import App from './App.vue'

const app = createApp(App);

const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
};

app.use(Toast, options);
app.use(router);

app.mount('#app')