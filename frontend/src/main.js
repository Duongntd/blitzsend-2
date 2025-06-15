import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
import globals from "globals";

export default [
  // ...
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // ...
];
