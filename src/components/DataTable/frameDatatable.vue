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
        <el-button icon="columns" size="small" style="background-color: #e3ecf6" @click="chooseColumns"><svg-icon icon-class="columns"></svg-icon></el-button>
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

    <el-dialog title="选择列" :visible.sync="dialogChooseColumns.visible">
      <div>
        <el-checkbox :indeterminate="dialogChooseColumns.isIndeterminate" v-model="dialogChooseColumns.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="dialogChooseColumns.checked" @change="handleCheckedChange">
          <el-checkbox v-for="col in config.columns" :label="col.prop" :key="col.prop"
                       :disabled="col.show != null && (col.show === 'always' || col.show === 'never')">{{ col.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChooseColumns.visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="handleChooseColumnsSubmit">保  存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/*
*config: {
        showOptionsColumns: true, // 是否显示show选项为"options"的列,默认为false
        columns: [
          {
            label: '用户名',
            prop: 'username',
            width: 150,
            show: 'always' // 默认是option.
                            always:总是显示
                            never: 从不显示
                            options: 可选，可以在右上角中的选择对话框选择该列是否可显示
          }
        ],
        data: '/api/ucenter/sys/user/datatable.json'   // 数据或者获取数据的地址
* */
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
      highlightCurrentRow: true,
      dialogChooseColumns: {
        visible: false,
        isIndeterminate: true,
        checked: [],
        checkAll: false
      }
    }
  },
  mounted() {
    if (this.config != null && typeof this.config === 'object') {
      // cloums配置
      if (this.config.columns && this.config.columns instanceof Array) {
        this.columns = this.config.columns.filter(this.columnsFilter)
      } else {
        return Promise.reject('columns 配置错误')
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
    columnsFilter(value) {
      const showOptionsColumns = this.config.showOptionsColumns == null ? false : this.config.showOptionsColumns
      if (value.show == null || value.show === '') {
        return showOptionsColumns
      }
      if (typeof value.show === 'string') {
        if (value.show === 'always') {
          return true
        } else if (value.show === 'never') {
          return false
        } else if (value.show === 'option') {
          return showOptionsColumns
        }
      }
      return showOptionsColumns
    },
    loadTableData() { // 加载表格数据
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
    },
    chooseColumns() {
      this.dialogChooseColumns.checked = this.columns.map(value => {
        return value.prop
      })
      this.dialogChooseColumns.checkAll = this.dialogChooseColumns.checked.length === this.config.columns.length
      this.dialogChooseColumns.isIndeterminate = false
      this.dialogChooseColumns.visible = true
    },
    handleCheckAllChange(val) {
      this.dialogChooseColumns.checked = val ? this.dialogChooseColumns.checked = this.columns.map(value => {
        return value.prop
      }) : []
      this.dialogChooseColumns.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.dialogChooseColumns.checkAll = checkedCount === this.config.columns.length
      this.dialogChooseColumns.isIndeterminate = checkedCount > 0 && checkedCount < this.config.columns.length
    },
    handleChooseColumnsSubmit() {
      this.columns = this.config.columns.filter(value => {
        return this.columnsFilter(value) && this.dialogChooseColumns.checked.some(v => { return value.prop === v })
      })
      this.dialogChooseColumns.visible = false
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
