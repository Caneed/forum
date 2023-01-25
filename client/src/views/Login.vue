<template>
  <div class="login-panel">
    <n-card title="登录界面">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="账号">
          <n-input v-model:value="admin.account" placeholder="请输入账号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input type="password" v-model:value="admin.password" placeholder="请输入密码" />
        </n-form-item>
        <n-checkbox v-model:checked="admin.remember" label="记住我" />
      </n-form>
      <template #footer>
        <n-button type="primary" @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { NCard, NForm, NFormItem, NInput, NCheckbox, NButton } from 'naive-ui';
import { ref, reactive, inject } from 'vue'
import { userStore } from '../stores/userStore.js'

// 得到全局提供的axios
const axios = inject('axios')
// 依赖注入消息组件
const message = inject('message')
// 创建store
const adminStore = userStore()
// 表单数据模型
const admin = reactive({
  //首先查看localStorage中是否存有用户信息，否则为空
  account: localStorage.getItem('account') || '',
  password: localStorage.getItem('account') || '',
  remember: localStorage.getItem('remember') == 1
})

// 表单规则
let rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度在3-12个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '账号长度在6-18个字符之间', trigger: 'blur' }
  ]
}

// 登录方法
const login = async () => {
  // 向接口发请求并用res接收
  let res = await axios.post('admin/login', {
    // 将输入框的账号密码传入
    username: admin.account,
    password: admin.password
  })
  if (res.data.code == 200) {
    // 请求成功,将信息直接给adminStore
    // 拿到成功结果的token值，将token保存
    adminStore.token = res.data.data.token
    adminStore.account = res.data.data.username
    adminStore.password = admin.password
    adminStore.id = res.data.data.id
    // 如果勾选了记住我
    if (admin.remember) {
      // 将信息存入localStorage
      localStorage.setItem('account', adminStore.account)
      localStorage.setItem('password', adminStore.password)
      localStorage.setItem('remember', admin.remember ? 1 : 0)
    }
    message.success('登录成功!')
  } else {
    // 请求失败
    message.error('登录失败')
  }

}
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0px auto;
  margin-top: 130px;
}
</style>