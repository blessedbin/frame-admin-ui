<template>
  <div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
    </el-table>
    <div class="block" style="padding:15px; float:right;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes"
                     :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/**
* 文档:
 * config: {
 *     columns: [
 *         {
 *             label: require
 *             prop: require
 *         }
 *     ]
 * }
*/
export default {
  name: 'datatable',
  props: {
    config: {
      type: Object,
      require: true,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSizes: [20, 30, 50, 100],
        pageSize: 20,
        total: 0
      },
      listLoading: false,
      tableKey: 'id',
      list: [],
      // 列定义
      columns: []
    }
  },
  created() {},
  methods: {
    loadTableData() {},
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.loadTableData()
    },
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.loadTableData()
    }
  }
}
</script>

<style scoped>

</style>
