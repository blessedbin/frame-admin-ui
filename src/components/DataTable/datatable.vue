<template>
  <div>
    <!--
    delete-row: 删除事件 参数:row
    edit-row: 编辑事件 参数:row
    -->
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-if="showCardHeader">
        <div style="float: left;margin-top: 10px;display: flex;">
          <span style="margin-right: 5px;">{{ title }}</span>
        </div>
        <div style="float: right;display: flex;">
          <div style="margin-right: 10px;margin-top: 3px;">
            <slot name="button"/>
          </div>
          <el-input placeholder="搜索" v-model="searchValue" @keyup.enter.native="onSearch"
                    clearable @clear="onSearch"
                    size="small" style="width: 250px">
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
          </el-input>
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button size="small" style="background-color: #e3ecf6;border-radius: 4px" @click="loadTableData" icon="el-icon-refresh">
            </el-button>
          </el-tooltip>

        </div>

      </div>
      <div>
        <el-table :data="data" stripe border @row-dblclick="rowDbClick" :max-height="maxHeight"
                  :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange"
                  :row-class-name="tableRowClassName" @row-click="checkImage" ref="table"
                  v-loading="loading">
          <el-table-column type="selection" width="55" v-if="checkBox">
          </el-table-column>
          <el-table-column label="ID" align="center" type="index" width="100" v-if="showIndex"></el-table-column>
          <el-table-column :label="column.label"
                           :prop="column.prop"
                           :width="column.width != null ? column.width : {}"
                           v-for="(column) in columns"
                           :key="column.label">
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

        <div class="block" style="padding:15px; float:right;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes"
                         :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
/**
     * @param showIndex Boolean类型，是否显示序列
     * @method getSelection() 返回CheckBox勾选的值,数组
     */
import Vue from 'vue'
export default {
  name: 'Datatable',
  props: {
    // 请求地址
    url: {
      type: String,
      require: true,
      default: ''
    },
    title: {
      type: String,
      require: false,
      default: ''
    },
    columns: {
      type: Array,
      require: true,
      default: () => []
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    checkBox: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Number,
      default: 1
    },
    // 是否显示card标题，默认显示
    showCardHeader: {
      type: Boolean,
      default: true
    },
    operations: {
      type: Object,
      default: function() {
      }
    },
    // //////////////////////
    highlightCurrentRow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Vue,
      loading: false,
      data: [],
      pagination: {
        currentPage: 1,
        pageSizes: [20, 30, 50, 100],
        pageSize: 20,
        total: 0
      },
      searchValue: '',
      selectionVal: []
    }
  },
  computed: {
  },
  mounted() {
    this.loadTableData()
  },
  methods: {
    loadTableData() {
      const self = this
      self.loading = true
      const url = self.url + '/datatable.json?page_num=' + self.pagination.currentPage +
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
    refreshData() {
      this.loadTableData()
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.loadTableData()
    },
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.loadTableData()
    },
    // 双击事件
    rowDbClick(row, event) {
      this.$emit('row-dblclick', row, event)
    },
    // 高亮
    checkImage(row, event, column) {
      this.currentSelectedLine = row
    },
    tableRowClassName(row) {
      if (this.highlightCurrentRow) {
        return 'first-row'
      } else {
        return ''
      }
    },
    // 获得当前高亮行
    getCurrentSelectedLine() {
      if (this.currentSelectedLine) {
        return this.currentSelectedLine
      } else {
        return null
      }
    },
    // 搜索
    onSearch() {
      this.loadTableData()
    },
    selectionChange(val) {
      this.selectionVal = val
    },
    getSelection() {
      return this.selectionVal
    },
    /**
         * 设置CheckBox的勾选状态
         * @param selection 被选中的行的Key数组
         * @param rowKey 数据列表中Key关键字
         */
    setCheckedBox(selection, rowKey) {
      var selectedRow = this.data.filter(function(item, index, array) {
        const permissionId = item[rowKey]
        return selection.some(function(item, index, array) {
          return item === permissionId
        })
      })
      console.log(selectedRow)
      this.$refs.table.toggleRowSelection(selectedRow, true)
    }
  }
}
</script>

<style scoped>

</style>

<style>
  .current-row > td {
    background: rgba(33, 138, 243, 0.81) !important;
  }
</style>
