<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl" ref="datatable"
               title="角色列表">

      <div slot="button">
        <el-button size="mini" type="primary" @click="handleAddRoleButton">添加</el-button>
      </div>

      <el-table-column label="操作" width="250px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini" @click="handleEditRow(scope.row)">编辑</el-button>
          <el-button type="info" round size="mini" @click="handleEditRolePermissionButtonRow(scope.row)">编辑权限</el-button>
          <el-button type="danger" size="mini" round @click="handleDeleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </datatable>

    <!--添加角色-->
    <div>
      <el-dialog
        title="添加角色" width="600px"
        :visible.sync="dialogAddRole.visible">
        <div>
          <el-form :model="dialogAddRole.data" ref="addForm" size="small" label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="dialogAddRole.data.roleName"></el-input>
            </el-form-item>
            <el-form-item label="KEY">
              <el-input v-model="dialogAddRole.data.roleKey"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="dialogAddRole.data.remark"></el-input>
            </el-form-item>
            <el-form-item label="启用">
              <el-switch v-model="dialogAddRole.data.enabled"
                         active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAddRole.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddRoleSubmit">确 定</el-button>
        </span>
      </el-dialog>

    </div>

    <!--编辑权限-->
    <el-dialog title="编辑权限" :visible.sync="dialogEditRolePermission.visible" width="60%">
      <div >
        <el-row :gutter="5">
          <el-col :span="10">
            <el-tree :data="dialogEditRolePermission.treeData" show-checkbox ref="permissionTree"
                     :default-expanded-keys="dialogEditRolePermission.checkedList" @node-click="dialogERP_TreeNodeClick"
                     node-key="id">
            </el-tree>
          </el-col>
          <el-col :span="14">
            <div>
              <el-checkbox-group v-model="dialogEditRolePermission.checkboxCheckList">
                <el-checkbox v-for="operation in dialogEditRolePermission.operationDetails"
                             :label="String(operation.id)" :key="operation.id">{{ operation.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditRolePermission.visible = false" size="mini" round>取 消</el-button>
        <el-button type="primary" @click="handleEditRolePermissionSubmit" size="mini" round>保  存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'ManageRole',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/role',
      columns: [
        {
          label: '角色名称',
          prop: 'roleName',
          width: 150
        },
        {
          label: '角色编码',
          prop: 'roleKey'
        },
        {
          label: '组织名称',
          prop: 'organizationId'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          filter: 'dateFormat'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      dialogAddRole: {
        data: {
          roleName: '',
          roleKey: 'ROLE_',
          enabled: true,
          organizationId: '',
          remark: ''
        },
        visible: false
      },
      dialogEditRolePermission: {
        visible: false,
        treeData: [],
        checkedList: [],
        id: '',
        checkboxCheckList: [],
        operationDetails: []
      }
    }
  },
  computed: {
    dialogAddRoleEditAble: function() {
      return this.dialogAddRole.type === 'edit'
    }
  },
  watch: {
    'dialogEditRolePermission.checkedList': function(value) {
      const self = this
      this.$nextTick(function() {
        // 筛选叶子节点
        if (value) {
          const selectedKeys = value.filter(function(currentValue, index, array) {
            const node = self.$refs.permissionTree.getNode(currentValue)
            if (node === null) {
              return false
            }
            return node.isLeaf
          })
          this.$refs.permissionTree.setCheckedKeys(selectedKeys)
        }
      })
    }
  },
  mounted() {
  },
  methods: {
    handleAddRoleSubmit() {
      const self = this
      self.$request.post(self.baseUrl, self.dialogAddRole.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddRole.visible = false
        self.$refs.datatable.refreshData()
      })
    },
    handleAddRoleButton() {
      this.resetForm()
      this.dialogAddRole.visible = true
    },
    handleEditRow(row) {
    },
    handleDeleteRow(row) {
      const id = row.id
      const self = this
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '?id=' + id).then(response => {
          self.$message.success(response.message)
          self.loadTableData()
        })
      })
    },
    resetForm() {
      this.dialogAddRole.data = {
        name: '',
        key: '',
        enabled: true
      }
    },
    //  ////////////////////////////////////////////////
    handleEditRolePermissionSubmit() {
      const self = this
      const checkedKeys = self.$refs.permissionTree.getCheckedKeys()
      const halfCheckedNodes = self.$refs.permissionTree.getHalfCheckedKeys()
      const roleId = self.dialogEditRolePermission.id
      console.log(self.dialogEditRolePermission.checkboxCheckList)
      const data = {
        id: roleId,
        checkedList: checkedKeys.concat(halfCheckedNodes, self.dialogEditRolePermission.checkboxCheckList)
      }
      self.$request.put(self.baseUrl + '/role_permission.do', data).then(response => {
        self.$message.success(response.message)
        self.dialogEditRolePermission.visible = false
      })
    },
    handleEditRolePermissionButtonRow(row) {
      const self = this
      const id = row.id
      self.dialogEditRolePermission.id = id
      self.dialogEditRolePermission.checkboxCheckList = []
      self.$request.get('/api/ucenter/sys/menu/menu_tree.json?roleId=' + id).then(response => {
        self.dialogEditRolePermission.treeData = response.data.treeList
        self.dialogEditRolePermission.checkedList = response.data.selectedList
        self.dialogEditRolePermission.visible = true
      })
    },
    // /////////////////////////////////////////////////////
    dialogERP_TreeNodeClick(data) {
      console.log(data)
      const id = data.id
      const self = this
      self.$request.get('/api/ucenter/sys/menu/menu_details.json?id=' + id).then(response => {
        self.dialogEditRolePermission.operationDetails = response.data.operationDetails
      })
    }
  }
}
</script>

<style scoped>

</style>
