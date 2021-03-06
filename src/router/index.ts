import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Swap from "../views/Swap.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Swap",
    component: Swap,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
