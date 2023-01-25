<template>
  <div>
    后台管理主界面
    {{ adminStore }}
  </div>
</template>

<script setup>
import { userStore } from '../stores/userStore';
const adminStore=userStore()
</script>

<style lang="scss" scoped>
</style>