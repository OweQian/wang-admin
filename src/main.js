import { createApp } from 'vue'
import App from './App.vue'
import {
  ElButton,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
  ElMenu,
  ElSubmenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElForm,
  ElFormItem,
  ElInput,
  ElPopover,
  ElTag,
  ElCard,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElPopconfirm,
  ElUpload,
  ElLoading,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCascader,
  ElCheckbox,
  ElInputNumber } from 'element-plus'
import router from '@/router'
import { orderStatus } from '@/config'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.use(router)
app.use(ElButton)
  .use(ElContainer)
  .use(ElAside)
  .use(ElHeader)
  .use(ElMain)
  .use(ElFooter)
  .use(ElMenu)
  .use(ElSubmenu)
  .use(ElMenuItemGroup)
  .use(ElMenuItem)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElInput)
  .use(ElPopover)
  .use(ElTag)
  .use(ElCard)
  .use(ElTable)
  .use(ElTableColumn)
  .use(ElPagination)
  .use(ElDialog)
  .use(ElPopconfirm)
  .use(ElUpload)
  .use(ElLoading)
  .use(ElSelect)
  .use(ElOption)
  .use(ElRadioGroup)
  .use(ElRadio)
  .use(ElCascader)
  .use(ElCheckbox)
  .use(ElInputNumber)

// 全局方法
app.config.globalProperties.$filters = {
  prefix (url) {
    if (url && url.startsWith('http')) {
      return url
    } else {
      url = `http://backend-api-02.newbee.ltd${url}`
      return url
    }
  },
  orderMap (status) {
    return orderStatus[status] || '未知'
  }
}

app.config.globalProperties.goTop = function () {
  const main = document.querySelector(".main")
  main.scrollTop = 0
}


app.mount('#app')
