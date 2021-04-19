import { createApp } from 'vue'
import App from './App.vue'
import {
  ElButton,
  ElMessage,
  ElContainer,
  ElAside,
  ElMenu,
  ElSubmenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox } from 'element-plus'
import router from '@/router'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.use(router)
app.use(ElButton)
    .use(ElMessage)
    .use(ElContainer)
    .use(ElAside)
    .use(ElMenu)
    .use(ElSubmenu)
    .use(ElMenuItemGroup)
    .use(ElMenuItem)
    .use(ElForm)
    .use(ElFormItem)
    .use(ElInput)
    .use(ElCheckbox)

app.mount('#app')
