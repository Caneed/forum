// pinia,axios,sass,vue-router,naive-ui,wangEditor
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './routers/router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
import { userStore } from './stores/userStore'
// axios配置全局路径
//默认服务端地址为http://localhost:3000,访问接口时不需要直接全拼接口地址
axios.defaults.baseURL = 'http://localhost:3000'
//注册message,notification,dialog
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])

createApp(App)
  // 全局提供axios
  .provide('axios', axios)
  // 全局提供消息组件
  .provide('message', message)
  .provide('notification', notification)
  .provide('dialog', dialog)
  .use(router)
  .use(createPinia())
  .mount('#app')

//实例化piniaStore(全局实例化pinia时需要在use(createPinia())之后)
const adminStore = userStore()
// 设置拦截器(每一次请求都会先执行此拦截器),自动向请求头中添加token
axios.interceptors.request.use((config) => {
  // 直接配置请求头里的token
  config.headers.token = adminStore.token
  // 拦截器需要返回config
  return config
})