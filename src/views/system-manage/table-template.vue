<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl + '/datatable.json'">

      <div slot="button">
        <el-button size="mini" type="primary" @click="handleAddRoleButton">添加</el-button>
      </div>
    </datatable>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'index',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/product_specification',
      columns: [
        {
          label: '名称',
          prop: 'name',
          width: 150
        },
        {
          label: '创建时间',
          prop: 'createTime',
          filter: 'dateFormat'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
