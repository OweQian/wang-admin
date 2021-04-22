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
  ElCheckbox,
  ElCascader,
  ElRadio,
  ElRadioGroup,
  ElUpload,
  ElCard } from 'element-plus'
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
    .use(ElCard)
    .use(ElCascader)
    .use(ElUpload)
    .use(ElRadio)
    .use(ElRadioGroup)

app.mount('#app')
