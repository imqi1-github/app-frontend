import {type RouteRecordRaw} from "vue-router";

export const postRoute: RouteRecordRaw[] = [
  {
    "path": "",
    "name": "post-home",
    "component": () => import("@views/post/PostHomeView.vue"),
    "meta": {
      searchTo: "/post/search",
      showCategory: true,
    }
  },
  {
    "path": "category/:id",
    "name": "post-category",
    "component": () => import("@views/post/PostHomeView.vue"),
    "meta": {
      searchTo: "/post/search",
      showCategory: true,
    }
  },
  {
    "path": "content/:id",
    "name": "post-content",
    "component": () => import("@views/post/PostView.vue"),
    "meta": {
      searchTo: "/post/search",
      showCategory: false,
    },
  },
  {
    "path": "new",
    "name": "post-write",
    "component": () => import("@views/post/WriteView.vue"),
    "meta": {
      requiresAuth: true,
      showCategory: false,
    }
  },
  {
    "path": "me/:id",
    "name": "post-me",
    "component": () => import("@views/post/MeView.vue"),
    "meta": {
      showCategory: false,
    }
  },
]