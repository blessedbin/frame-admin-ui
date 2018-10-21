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
          label: '设备ID',
          prop: 'id',
          width: 150
        },
        {
          label: '设备名称',
          prop: 'deviceName',
          width: 100
        },
        {
          label: '设备型号',
          prop: 'deviceType',
          width: 120
        },
        {
          label: 'cpu编号',
          prop: 'cpuId',
          width: 200
        },
        {
          label: 'cpu厂商',
          prop: 'cpuProducer'
        },
        {
          label: '注册时间',
          prop: 'registerTime',
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
          label: '状态',
          prop: 'status',
          render: function(row) {
            if (row.status === 1) {
              return '正常'
            } else if (row.status === 2) {
              return '离线'
            } else {
              return '未知'
            }
          }
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
