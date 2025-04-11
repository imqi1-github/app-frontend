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
      title: "发布 - 帖子",
    }
  },
  {
    "path": "me/:id",
    "name": "post-me",
    "component": () => import("@views/post/MeView.vue"),
    "meta": {
      showCategory: false,
      title: "个人资料"
    }
  },
  {
    "path": "edit/:id",
    "name": "post-edit",
    "component": () => import("@views/post/WriteView.vue"),
    "meta": {
      requiresAuth: true,
      showCategory: false,
      title: "编辑 - 帖子",
    }
  },
  {
    "path": "search/:keywords",
    "name": "post-search",
    "component": () => import("@views/post/PostHomeView.vue"),
    "meta": {
      searchTo: "/post/search",
      showCategory: true,
      title: "搜索结果"
    }
  }
]