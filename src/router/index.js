import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Test from '../views/Test.vue';

const routes = [
  {
    path: '/',
    component: Login, // 登录页
  },
  {
    path: '/test',
    component: Test,  // 受保护的页面
    meta: { requiresAuth: true } // 添加路由元信息，标记需要认证
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录（示例从 localStorage 读取，实际项目中可替换为 Vuex/Pinia 或 Cookie）
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      // 未登录则跳转到登录页
      next('/');
    } else {
      // 已登录则放行
      next();
    }
  } else {
    // 不需要认证的路径直接放行
    next();
  }
});

export default router;
