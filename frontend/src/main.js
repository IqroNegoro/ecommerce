import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "@/assets/css/styles.css";

const app = createApp(App);

import { createPinia } from "pinia";
import mitt from "mitt";
import axios from 'axios';

const pinia = createPinia();

const PORT = "http://localhost:3000/";

const axiosInstance = axios.create({
    baseURL: PORT
});

app.provide("port", PORT);
app.provide("axios", axiosInstance);
app.provide("emitter", mitt());

app.use(pinia)

app.use(router).mount('#app')