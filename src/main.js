import { createApp } from 'vue'
import App from './App.vue'
import { ElButton } from 'element-plus'
import router from '@/router'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.use(router)
app.use(ElButton)
app.mount('#app')
