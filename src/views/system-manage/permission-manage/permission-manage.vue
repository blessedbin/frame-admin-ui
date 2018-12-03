<template>
  <div>
    <div style="padding-bottom: 5px">
      <el-button type="primary" size="small" @click="loadMenuTreeData">刷新</el-button>
    </div>
    <tree-table :data="treeData.data" :expand-all="expandAll" border
                v-loading="treeData.loading">
      <el-table-column label="标题" prop="title" width="150"></el-table-column>
      <el-table-column label="权限点">
        <template slot-scope="props">
          <div style="display: inline" v-if="props.row.isLeaf">
            <el-button-group v-for="tag in tags[props.row.id]" :key="tag.id" style="padding-left:5px; padding-bottom: 5px;">
              <el-button type="primary" plain size="mini" @click="handleEditOperationApiClick(props.row)">{{ tag.name }}</el-button>
              <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button class="button-new-tag" size="mini" type="primary" @click="addOperationRow(scope.row)" v-if="scope.row.isLeaf">+</el-button>
        </template>
      </el-table-column>
    </tree-table>

    <!--添加功能点-->
    <el-dialog
      title="添加" width="600px" :visible.sync="dialogAddOperation.visible">
      <div>
        <el-form :model="dialogAddOperation.data" ref="dialogAddOperationForm" label-width="80px" size="small"
                 :rules="dialogAddOperation.rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogAddOperation.data.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddOperation.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddOperationSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑功能点的API-->
    <el-dialog
      title="修改" width="1000px" :visible.sync="dialogEditOperationApi.visible">
      <div>
        <div style="padding-bottom: 5px;">
          <span>服务ID：</span>
          <el-select size="small" v-model="dialogEditOperationApi.serviceIdSelection" multiple :value="dialogEditOperationApi.serviceIdSelection">
            <el-option v-for="item in dialogEditOperationApi.serviceIdOptions" :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <span>标签：</span>
          <el-select size="small" v-model="dialogEditOperationApi.tagSelection" multiple :value="dialogEditOperationApi.tagSelection">
            <el-option v-for="item in dialogEditOperationApi.tagOptions" :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-button size="small" @click="dialogEditOperationApiSearch">搜索</el-button>
        </div>
        <el-table size="small" ref="multipleTable" :data="dialogEditOperationApi.tableData" tooltip-effect="dark" style="width: 100%"
                  @selection-change="handleSelectionChange" @select="handleSelect" @select-all="selectAll">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="url" prop="url"></el-table-column>
          <el-table-column label="method" prop="method"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="tags" label="标签" show-overflow-tooltip></el-table-column>
          <el-table-column prop="serviceId" label="服务ID" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="block" style="padding:15px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float: right;"
                         :current-page="dialogEditOperationApi.pagination.currentPage" :page-sizes="dialogEditOperationApi.pagination.pageSizes"
                         :page-size="dialogEditOperationApi.pagination.pageSize" layout="total, prev, pager, next, jumper"
                         :total="dialogEditOperationApi.pagination.total">
          </el-pagination>
        </div>
        <div>
          <span>已选：</span>
          <el-tag v-for="(val, key) in dialogEditOperationApi.alreadySelected" :key="key">{{ val.url + '[' + val.method + ']' }}</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditOperationApi.visible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAddOperationSubmit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import Vue from 'vue'
export default {
  name: 'permission-manage',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      args: [null, null, 'timeLine'],
      expandAll: true,
      treeData: {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        loading: false,
        inputVisible: false,
        inputValue: ''
      },
      tags: {
        aa: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ]
      },
      dialogAddOperation: {
        rules: {
          name: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        },
        visible: false,
        data: {
          menuId: -1,
          name: ''
        }
      },
      dialogEditOperationApi: {
        visible: false,
        data: {
          operationId: -1,
          name: ''
        },
        currentRow: null,
        tableData: [],
        pagination: {
          currentPage: 1,
          pageSizes: [20, 30, 50, 100],
          pageSize: 10,
          total: 0
        },
        tagOptions: [],
        tagSelection: [],
        serviceIdOptions: [],
        serviceIdSelection: [],
        alreadySelected: {} // 已选项
      }
    }
  },
  computed: {
  },
  mounted() {
    this.loadMenuTreeData()
  },
  methods: {
    loadMenuTreeData() {
      const self = this
      self.treeData.loading = true
      self.$request.get('/api/ucenter/sys/menu/menu_tree.json').then(response => {
        self.treeData.data = response.data.treeList
        self.treeData.data.forEach(value => {
          value.tags = []
          self.getOperations(value)
        })
        self.treeData.loading = false
      })
    },
    getOperations(row) {
      const self = this
      const id = row.id
      const operationsId = row.operations
      if (row.isLeaf && operationsId != null) {
        const operationsStr = operationsId.join(',')
        self.$request.get('/api/ucenter/sys/operation?id=' + operationsStr + '&array=true').then(response => {
          Vue.set(self.tags, id, response.data)
        })
      }
      if (row.children) {
        row.children.forEach(value => {
          this.getOperations(value)
        })
      }
    },
    treeNodeClick(data) {},
    addOperationRow(row) {
      this.dialogAddOperation.data.menuId = row.id
      this.dialogAddOperation.data.name = ''
      this.dialogAddOperation.visible = true
      this.dialogAddOperation.row = row
    },
    // 添加功能点提交按钮
    handleAddOperationSubmit() {
      const self = this
      this.$refs['dialogAddOperationForm'].validate(valid => {
        if (valid) {
          self.$request.post('/api/ucenter/sys/operation', self.dialogAddOperation.data).then(response => {
            self.$message.success(response.message)
            self.dialogAddOperation.visible = false
            self.loadMenuTreeData()
          })
        } else {
          self.$message.error('参数错误')
        }
      })
    },
    // /////////////////////////////////////////////
    handleEditOperationApiClick(row) {
      console.log(row)
      const self = this
      self.dialogEditOperationApi.currentRow = row
      const url = '/api/ucenter/sys/api/datatable.json?page_num=' + self.dialogEditOperationApi.pagination.currentPage +
        '&page_size=' + self.dialogEditOperationApi.pagination.pageSize
      self.$request.get(url).then(response => {
        self.dialogEditOperationApi.pagination.currentPage = response.data.currentPage
        self.dialogEditOperationApi.pagination.pageSize = response.data.pageSize
        self.dialogEditOperationApi.pagination.total = response.data.total
        self.dialogEditOperationApi.pagination.pageSizes = response.data.pageSizes
        self.dialogEditOperationApi.tableData = response.data.data
        self.dialogEditOperationApi.visible = true
      })
      self.$request.get('/api/ucenter/sys/api/tag_options.json').then(response => {
        self.dialogEditOperationApi.tagOptions = response.data
      })
      self.$request.get('/api/ucenter/sys/api/serviceID_options.json').then(response => {
        self.dialogEditOperationApi.serviceIdOptions = response.data
      })
    },
    handleSizeChange(size) {
      this.dialogEditOperationApi.pagination.pageSize = size
      if (this.dialogEditOperationApi.currentRow) {
        this.handleEditOperationApiClick(this.dialogEditOperationApi.currentRow)
      }
      this.loadTableData()
    },
    handleCurrentChange(current) {
      this.dialogEditOperationApi.pagination.currentPage = current
      if (this.dialogEditOperationApi.currentRow) {
        this.handleEditOperationApiClick(this.dialogEditOperationApi.currentRow)
      }
    },
    handleSelectionChange(selection) {
      console.log(selection)
    },
    handleSelect(selection, row) {
      if (selection.indexOf(row) >= 0) {
        // 勾选
        Vue.set(this.dialogEditOperationApi.alreadySelected, row.id, row)
      } else {
        // 取消勾选
        Vue.delete(this.dialogEditOperationApi.alreadySelected, row.id)
      }
      console.log('-----alreadySelected-------')
      console.log(this.dialogEditOperationApi.alreadySelected)
    },
    selectAll(selection) {
      if (selection.length === 0) {
        // 清空
        this.dialogEditOperationApi.tableData.forEach(value => {
          Vue.delete(this.dialogEditOperationApi.alreadySelected, value.id)
        })
      } else {
        selection.forEach(value => {
          Vue.set(this.dialogEditOperationApi.alreadySelected, value.id, value)
        })
      }
    },
    dialogEditOperationApiSearch() {
      console.log(this.dialogEditOperationApi.tagSelection.join(','))
      console.log(this.dialogEditOperationApi.serviceIdSelection.join(','))
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
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
