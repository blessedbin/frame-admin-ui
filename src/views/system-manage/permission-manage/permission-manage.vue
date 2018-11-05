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
          <div style="display: inline" v-if="props.row.isLeaf && getOperations(props.row)">
            <el-button-group v-for="tag in tags[props.row.id]" :key="tag.name" style="padding-left:5px;">
              <el-button type="primary" plain size="mini">{{ tag.name }}</el-button>
              <el-button type="primary" plain icon="el-icon-delete" size="mini"></el-button>
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
        <el-form :model="dialogAddOperation.data" ref="form" label-width="80px" size="small" :rules="dialogAddOperation.rules">
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
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
export default {
  name: 'permission-manage',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      args: [null, null, 'timeLine'],
      expandAll: false,
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
        visible: false,
        data: {
          menuId: -1,
          name: ''
        }
      }
    }
  },
  computed: {
    // tagLoading[props.row.id] != null && tagLoading[props.row.id] === true
    cTagLoading(id) {
      console.log(this.tagLoading[id])
      if (this.tagLoading[id] == null) {
        return false
      } else {
        return this.tagLoading[id]
      }
    }
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
        self.treeData.loading = false
      })
    },
    treeNodeClick(data) {},
    showInput() {
      this.treeData.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(menuId) {
      const inputValue = this.treeData.inputValue
      const self = this
      if (inputValue) {
        console.log(inputValue)
        const data = { menuId: menuId, name: inputValue }
        self.$request.post('/api/ucenter/sys/operation', data).then(response => {
          self.$message.success(response.message)
          // TODO 重新加载标签列表
        })
      }
      this.treeData.inputVisible = false
      this.treeData.inputValue = ''
    },
    getOperations(row) {
      const self = this
      const id = row.id
      const operationsId = row.operations
      if (operationsId != null) {
        const operationsStr = operationsId.join(',')
        self.$request.get('/api/ucenter/sys/operation?id=' + operationsStr + '&array=true').then(response => {
          self.tags[id] = response.data
        })
      }
      return true
    },
    addOperationRow(row) {
      this.dialogAddOperation.data.menuId = row.id
      this.dialogAddOperation.data.name = ''
      this.dialogAddOperation.visible = true
      this.dialogAddOperation.row = row
    },
    // 添加功能点提交按钮
    handleAddOperationSubmit() {
      const self = this
      self.$request.post('/api/ucenter/sys/operation', self.dialogAddOperation.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddOperation.visible = false
        self.getOperations(self.dialogAddOperation.row)
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
