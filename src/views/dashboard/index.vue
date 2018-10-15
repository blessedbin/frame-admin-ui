<template>
  <div class="dashboard-container">
    <admin-dashboard></admin-dashboard>
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">info:<pre>{{ info }}</pre></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin/index'
export default {
  name: 'dashboard',
  components: {
    adminDashboard
  },
  computed: {
    ...mapGetters([
      'name',
      'info'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 26px;
  }
}
</style>
