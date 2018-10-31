<template>
  <div class="">

    <datatable :columns="columns" :url="baseUrl" title="API列表" ref="datatable">

      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" round @click="handleDeleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </datatable>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'permission-list',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/permission',
      columns: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: 'code',
          prop: 'code'
        },
        {
          label: 'type',
          prop: 'type'
        },
        {
          label: 'enabled',
          prop: 'enabled'
        }
      ]
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    handleDeleteRow(row) {
      const id = row.id
      const self = this
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '/' + id).then(response => {
          self.$message.success(response.message)
          self.$refs.datatable.refreshData()
        })
      })
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
