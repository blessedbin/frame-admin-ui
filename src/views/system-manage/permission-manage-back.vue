<template>
  <div class="main-contain-holder">

    <div class="filter-container" style="margin-bottom:15px;">
      <el-input @keyup.enter.native="onSearch" style="width: 200px;float:right;margin-left: 10px" class="filter-item" placeholder="搜索"
                v-model="table.searchValue">
      </el-input>
      <el-button type="primary" @click="loadTableData" style="float:left"><svg-icon icon-class="refresh" ></svg-icon>刷新</el-button>
    </div>

    <el-table :data="table.data" stripe border>
      <el-table-column label="ID" align="center" type="index" width="100"> </el-table-column>
      <el-table-column label="权限名称" prop="name" width="150px" ></el-table-column>
      <el-table-column label="权限类型" prop="type" width="100px"></el-table-column>
      <el-table-column label="权限值" prop="permissionValue"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="150px">
        <template slot-scope="scope">
          {{ scope.row.createTime | dateFormat }}
        </template>
      </el-table-column>
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
export default {
  name: 'permission-manage',
  data() {
    return {
      table: {
        data: [],
        searchValue: ''
      },
      pagination: {
        currentPage: 1,
        pageSizes: [20, 30, 50, 100],
        pageSize: 20,
        total: 0
      }
    }
  },
  mounted() {
    this.loadTableData()
  },
  methods: {
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.loadTableData()
    },
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.loadTableData()
    },
    loadTableData() {
      const self = this
      const url = '/ucenter/manage/permission/datatable.json?page_num=' + self.pagination.currentPage +
            '&page_size=' + self.pagination.pageSize + '&search_value=' + self.table.searchValue
      self.$request.get(url).then(response => {
        self.pagination = response.pagination
        self.table.data = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
