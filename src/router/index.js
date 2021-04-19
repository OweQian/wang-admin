import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index'
import AddGood from '@/views/AddGood'
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
  }]
})

export default router