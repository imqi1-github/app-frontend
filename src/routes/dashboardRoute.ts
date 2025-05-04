import type {RouteRecordRaw} from "vue-router";
import {RiAncientGateLine, RiBarChartLine, RiChat1Line, RiFileLine, RiSettingsLine, RiUserLine} from "@remixicon/vue";

export const dashboardRoute: RouteRecordRaw[] = [
  {
    path: "",
    name: "dashboard-home",
    component: () => import("@views/dashboard/Home.vue"),
    meta: {
      title: "总览 - 仪表盘",
      icon: RiBarChartLine,
    }
  },
  {
    path: "manage-spot",
    name: "dashboard-spot",
    component: () => import("@views/dashboard/ManageSpot.vue"),
    children: [
      {
        path: ":page",
        name: "dashboard-spot-page",
        component: () => import("@views/dashboard/ManageSpot.vue"),
        meta: {
          title: "管理景点 - 仪表盘",
          icon: RiAncientGateLine
        }
      },
    ],
    meta: {
      title: "管理景点 - 仪表盘",
      icon: RiAncientGateLine
    }
  },
  {
    path: "setting",
    name: "dashboard-setting",
    component: () => import("@views/dashboard/Setting.vue"),
    meta: {
      title: "设置 - 仪表盘",
      icon: RiSettingsLine
    }
  },
  {
    path: "add-spot",
    name: "dashboard-add-spot",
    component: () => import("@views/dashboard/SpotEdit.vue"),
    meta: {
      title: "添加景点 - 仪表盘",
      icon: RiAncientGateLine
    }
  },
  {
    path: 'edit-spot/:id',
    name: 'dashboard-edit-spot',
    component: () => import("@views/dashboard/SpotEdit.vue"),
    meta: {
      title: '编辑景点 - 仪表盘',
      icon: RiAncientGateLine
    }
  },
  {
    path: 'manage-user',
    name: 'dashboard-manage-user',
    component: () => import("@views/dashboard/ManageUser.vue"),
    children: [
      {
        path: ":page",
        name: "dashboard-manage-user-page",
        component: () => import("@views/dashboard/ManageUser.vue"),
        meta: {
          title: "管理用户 - 仪表盘",
          icon: RiUserLine
        }
      },
    ],
    meta: {
      title: "管理用户 - 仪表盘",
      icon: RiUserLine
    }
  },
  {
    path: "user-edit/:id",
    name: "dashboard-user-edit",
    component: () => import("@views/dashboard/UserEdit.vue"),
    meta: {
      title: "编辑用户 - 仪表盘",
      icon: RiUserLine
    }
  },
  {
    path: "user-add",
    name: "dashboard-user-add",
    component: () => import("@views/dashboard/UserEdit.vue"),
    meta: {
      title: "新增用户 - 仪表盘",
      icon: RiUserLine
    }
  },
  {
    path: "manage-post",
    name: "dashboard-manage-post",
    component: () => import("@views/dashboard/ManagePost.vue"),
    children: [
      {
        path: ":page",
        name: "dashboard-manage-post-page",
        component: () => import("@views/dashboard/ManagePost.vue"),
        meta: {
          title: "管理帖子 - 仪表盘",
          icon: RiFileLine
        }
      },
    ],
    meta: {
      title: "管理帖子 - 仪表盘",
      icon: RiFileLine
    }
  },
  {
    path: "comment",
    name: "dashboard-manage-comment",
    component: () => import("@views/dashboard/ManageComment.vue"),
    children: [
      {
        path: ":page",
        name: "dashboard-manage-comment-page",
        component: () => import("@views/dashboard/ManageComment.vue"),
        meta: {
          title: "管理评论 - 仪表盘",
          icon: RiChat1Line
        }
      },
    ],
    meta: {
      title: "管理评论 - 仪表盘",
      icon: RiChat1Line
    }
  }
]