// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  // { path: '/foo', name: 'Foo', component: FooPage }, etc.
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
