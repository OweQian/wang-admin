import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index'
import AddGood from '@/views/AddGood'
import Login from '@/views/Login'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    name: 'index',
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