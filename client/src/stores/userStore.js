import { defineStore } from 'pinia'

// 用户信息store
export const userStore = defineStore('admin', {
  state: () => {
    return {
      id: '',
      account: '',
      token: '',
      password: ''
    }
  },
  actions: {},
  getters: {}
})