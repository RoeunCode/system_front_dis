import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "../src/assets/font.css";
import piniaPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);
// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Components
const vuetify = createVuetify({
  components,
  directives,
});

//Theme
const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#03dac6",
    error: "#f44336",
    info: "#2196F3",
    success: "#4caf50",
    warning: "#fb8c00",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "customDarkTheme",
    themes: {
      customDarkTheme,
    },
  },
});

app.use(vuetify);

app.use(pinia);

app.use(router);

app.mount("#app");
