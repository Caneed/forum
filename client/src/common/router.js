import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path:'/login',
    component:()=>import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { router, routes }