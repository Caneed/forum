<script setup>
import { inject } from '@vue/runtime-core';
import { NTable, NButton, NSpace, NModal, NInput } from 'naive-ui';
import { userStore } from '../stores/userStore';
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, onMounted } from 'vue'

const axios = inject('axios')
const message = inject('message')
const notification = inject('notification')
const adminStore = userStore()
// 是否显示模态框
const showAddModal = ref(false)
// 添加类别的数据源
const addCategory = reactive({
  name: '',
  id: ''
})

// 类别的列表
let categoryList = ref([])
// 请求数据的方法
const loadData = async () => {
  let res = await axios.get('category/list')
  // 请求到的数据赋值
  categoryList.value = res.data.rows
}
onMounted(() => {
  loadData()
})

// 添加类别点击确定按钮的回调
const addConfirm = async () => {
  // 请求添加接口
  let res = await axios.post('category/_token/add', { name: addCategory.name })
  if (res.data.code == 403) {
    // 没有登录
    message.error(res.data.msg)
  } else if (res.data.code == 200) {
    message.success(res.data.msg)
  }
  //将模态框隐藏
  showAddModal.value = false
  //重新载入数据
  loadData()
}

// 删除方法
const deleteCategory = async (category) => {
  let res = await axios.delete(`category/_token/delete?id=${category.id} `,)
  if (res.data.code == 200) {
    // 删除成功
    message.success(res.data.msg)
    loadData()
  } else {
    message.error(res.data.msg)
  }
}

</script>


<template>
  <div>
    <n-button type="info" @click="showAddModal=true">添加类别</n-button>
    <n-table :bordered="true" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category,index) in categoryList" :key="index">
          <td>{{ category.id }}</td>
          <td>{{category.name}}</td>
          <td>
            <n-space>
              <n-button strong secondary type="info">修改</n-button>
              <n-button strong secondary type="error" @click="deleteCategory(category)">删除</n-button>
            </n-space>
          </td>
        </tr>
        <tr>
        </tr>
      </tbody>
    </n-table>
    <n-modal v-model:show="showAddModal" preset="dialog" title="添加">
      <template #header>
        添加类别
      </template>
      <n-input type="text" v-model:value="addCategory.name" placeholder="输入名称"></n-input>
      <template #action>
        <n-button type="success" @click='addConfirm'>提交</n-button>
      </template>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
</style>