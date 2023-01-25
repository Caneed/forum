// pinia,axios,sass,vue-router,naive-ui,wangEditor
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './common/router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
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
