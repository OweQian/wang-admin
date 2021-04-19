import { createApp } from 'vue'
import App from './App.vue'
import { ElButton, ElMessage } from 'element-plus'
import router from '@/router'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.use(router)
app.use(ElButton)
    .use(ElMessage)
app.mount('#app')
