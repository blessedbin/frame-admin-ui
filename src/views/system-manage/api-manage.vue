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
  name: 'api-manage',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/api',
      columns: [
        {
          label: 'API',
          prop: 'name'
        },
        {
          label: 'URL',
          prop: 'url'
        },
        {
          label: 'METHOD',
          prop: 'method',
          width: 100
        },
        {
          label: 'CODE',
          prop: 'code'
        },
        {
          label: 'TAG',
          prop: 'tags'
        },
        {
          label: 'SERVICE ID',
          prop: 'serviceId'
        }
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
