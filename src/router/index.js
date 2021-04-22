import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Introduce from '@/views/Introduce.vue'
import AddGood from '@/views/AddGood.vue'
import Login from '@/views/Login.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    redirect: '/introduce'
  }, {
    path: '/introduce',
    name: 'introduce',
    component: Introduce
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: Index
  }, {
    path: '/add',
    name: 'add',
    component: AddGood
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }]
})

export default router