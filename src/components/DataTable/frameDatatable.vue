<template>
  <div>
    <div class="button-container">
      <slot name="button"/>
    </div>
    <div class="default-button">
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button style="background-color: #e3ecf6;border-radius: 4px" @click="loadTableData" size="small" icon="el-icon-refresh"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="选择列" placement="top">
        <el-button icon="columns" size="small" style="background-color: #e3ecf6"><svg-icon icon-class="columns"></svg-icon></el-button>
      </el-tooltip>
    </div>
    <el-table :data="data" stripe border highlight-current-row ref="table" v-loading="loading">
      <el-table-column type="selection" width="55" v-if="showCheckBox"></el-table-column>
      <el-table-column label="#" align="center" type="index" width="100" v-if="showIndex"></el-table-column>
      <el-table-column :label="column.label" :prop="column.prop" :width="column.width != null ? column.width : {}"
                       v-for="column in columns" :key="column.prop">
        <template slot-scope="scope">
          <span v-if="column.filter">
            {{ Vue.filter(column['filter'])(scope.row[column.prop]) }}
          </span>
          <span v-else-if="column.slotName">
            <slot :name="column.slotName" :row="scope.row" :$index="scope.$index" />
          </span>
          <span v-else>
            {{ column.render ? column.render(scope.row) : scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column>
      <slot/>
    </el-table>
    <div class="block pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes"
                     :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'frame-datatable',
  props: {
    config: {
      type: Object,
      require: true,
      default: function() {
        return null
      }
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    showCheckBox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue,
      columns: [],
      data: [],
      pagination: {
        currentPage: 1,
        pageSizes: [20, 30, 50, 100],
        pageSize: 20,
        total: 0
      },
      loading: false,
      highlightCurrentRow: true
    }
  },
  mounted() {
    if (this.config != null && typeof this.config === 'object') {
      // cloums配置
      if (this.config.columns) {
        this.columns = this.config.columns
      }
      // data
      if (this.config.data) {
        if (typeof this.config.data === 'string') {
          // 从地址加载data
          this.url = this.config.data
          this.loadTableData()
        } else if (this.config.data instanceof Array) {
          this.data = this.config.data
        } else {
          console.warn('config data 非法')
        }
      }
    } else {
      return Promise.reject('无配置')
    }
  },
  methods: {
    loadTableData() {
      const self = this
      self.loading = true
      const url = self.url + '?page_num=' + self.pagination.currentPage +
        '&page_size=' + self.pagination.pageSize + '&search_value=' + self.searchValue
      self.$request.get(url).then(response => {
        self.pagination.currentPage = response.data.currentPage
        self.pagination.pageSize = response.data.pageSize
        self.pagination.total = response.data.total
        self.pagination.pageSizes = response.data.pageSizes
        self.data = response.data.data
        self.loading = false
      })
    },
    handleSizeChange(size) {
    },
    handleCurrentChange(current) {
    }
  }
}
</script>

<style scoped>
.pagination {
  padding:15px;
  float:right;
}
.button-container {
  padding: 10px;
  display: inline-flex;
}
.default-button {
  float: right;
  padding: 10px;
}
</style>
