// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import DownloadPage from "../pages/DownloadPage.vue";
import LoginPage from "../pages/LoginPage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/download", name: "Download", component: DownloadPage },
  { path: "/login", name: "Login", component: LoginPage },
  // { path: '/foo', name: 'Foo', component: FooPage }, etc.
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
