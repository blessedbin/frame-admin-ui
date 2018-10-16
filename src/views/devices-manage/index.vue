<template>
  <div class="main-contain-holder">
    <datatable :columns="columns" :url="baseUrl" ref="datatable"
               title="设备列表">

               <!--<div slot="button">
        <el-button size="mini" type="primary" @click="handleAddButton">添加</el-button>
      </div>-->

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
      baseUrl: '/api/devices-management/devices/db-devices',
      columns: [
        {
          label: '名称',
          prop: 'name',
          width: 150
        },
        {
          label: '联系人',
          prop: 'contactsName',
          width: 100
        },
        {
          label: '联系人电话',
          prop: 'cantactsPhone',
          width: 120
        },
        {
          label: '地址',
          prop: 'address',
          width: 200
        },
        {
          label: '创建时间',
          prop: 'createTime',
          filter: 'dateFormat',
          width: 150
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          filter: 'dateFormat',
          width: 150
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
