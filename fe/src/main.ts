/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import VueAxios from "vue-axios";
import axios from "axios";

const app = createApp(App);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

registerPlugins(app);

app.mount("#app");
