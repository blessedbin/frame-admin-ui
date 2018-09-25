<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl" title="API列表">

      <div slot="button">
        <el-button size="mini" type="primary" @click="handleScanButton">扫描API</el-button>
      </div>
    </datatable>

  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'ApiManage',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/api',
      columns: [
        {
          label: '权限名称',
          prop: 'name'
        },
        {
          label: 'API地址',
          prop: 'url'
        },
        {
          label: '请求方式',
          prop: 'method',
          width: 100
        },
        {
          label: '唯一编码',
          prop: 'code'
        },
        {
          label: '标签',
          prop: 'tags'
        }
        /* {
              label: '创建时间',
              prop: 'createTime',
              filter: 'dateFormat'
            },
            {
              label: '更新时间',
              prop: 'updateTime',
              filter: 'dateFormat'
            } */
      ]
    }
  },
  mounted() {
  },
  methods: {
    onSearch() {},
    handleSizeChange(size) {
    },
    handleCurrentChange(current) {
    },
    loadTableData() {
    },
    refreshPermission() {},
    handleScanButton() {
      const self = this
      self.$request.get(self.baseUrl + '/scan').then(response => {
        self.$message.success(response.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
