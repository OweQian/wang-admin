import axios from 'axios'
import router from '@/router/index'
import config from '~/config'
import { localGet } from './index'
import { ElMessage } from 'element-plus'

axios.defaults.baseURL = config[import.meta.env.MODE].baseURL
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
// 默认post请求，使用application/json形式
axios.defaults.headers.post['Content-Type'] = 'application/json'
// 响应拦截器
axios.interceptors.response.use(res => {
  const { data: {
    data: result,
    resultCode: code,
    message
  }, data} = res
  if (typeof data !== 'object') {
    ElMessage.error('服务端异常')
    return Promise.reject(res)
  }
  if (code !== 200) {
    if (message) alert(message)
    if (code === 419) {
      router.push({
        path: '/login'
      })
    }
    return Promise.reject(res.data)
  }
  return result
})

export default axios
