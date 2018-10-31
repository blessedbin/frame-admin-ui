<template>
  <div class="main-contain-holder">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="权限管理" name="first">
        <permission-manage></permission-manage>
      </el-tab-pane>
      <el-tab-pane label="权限列表" name="second">
        <permission-list></permission-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import permissionList from './permission-list'
import permissionManage from './permission-manage'
export default {
  name: 'index',
  components: {
    permissionList,
    permissionManage
  },
  data() {
    return {
      activeName: 'first'
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
