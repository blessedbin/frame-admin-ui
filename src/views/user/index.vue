<template>
  <div class="main-contain-holder">
    <template>
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息设置" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="头像设置" name="second">
          <edit-avatar></edit-avatar>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="third">
          <change-password></change-password>
        </el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import editAvatar from './edit-avatar'
import changePassword from './change-password'
export default {
  name: 'index',
  components: {
    editAvatar,
    changePassword
  },
  data() {
    return {
      activeName2: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>

</style>
