<template>
  <div class="main-contain-holder">

    <div style="align-content: center">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>部门列表</span>
          <el-button style="float: right; padding: 3px 0;margin-left: 3px" type="primary" @click="handleAddDepartmentButton">添 加 </el-button>
          <el-button style="float: right; padding: 3px 0;margin-right: 3px" type="primary" @click="loadTreeData">刷 新 </el-button>
        </div>
        <div>

          <el-row :gutter="20">
            <el-col :span="6">
              <el-card type="box-card" shadow="hover">
                <el-tree :data="tree.data" default-expand-all></el-tree>
              </el-card>
            </el-col>
            <el-col :span="18">
              <el-card type="box-card" shadow="hover"></el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <el-dialog title="添加组织" width="700px"
               :visible.sync="dialogAddDepartment.visible">
      <div>
        <el-form :model="dialogAddDepartment.data" ref="addDepartmentForm" size="small"
                 label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="上级组织">
                <el-input type="text" v-model="dialogAddDepartment.data.pName">
                  <el-button slot="append" icon="el-icon-search"
                             @click="handleSearchDepartment"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="组织名称">
            <el-input v-model="dialogAddDepartment.data.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="dialogAddDepartment.data.remark"></el-input>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input v-model="dialogAddDepartment.data.sort" type="number"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddDepartment.visible = false" size="small" round>取 消</el-button>
        <el-button type="primary" @click="handleAddDepartmentSubmit" size="small" round>确 定</el-button>
      </span>
    </el-dialog>

    <!--修改部门-->
    <el-dialog title="修改部门" width="600px"
               :visible.sync="dialogEditDepartment.visible">
      <div>
        <el-form :model="dialogEditDepartment.data" ref="form" size="small"
                 label-width="120px">
          <el-form-item label="上级部门名称">
            <el-input v-model="dialogEditDepartment.data.parentName" disabled placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="部门名称">
            <el-input v-model="dialogEditDepartment.data.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="dialogEditDepartment.data.address" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="dialogEditDepartment.data.phone" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="dialogEditDepartment.data.remark"></el-input>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input v-model="dialogEditDepartment.data.sort" type="number"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditDepartment.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDepartmentSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <department-tree ref="dialogDepratmentTree" @selected="dialogDepartmentTreeSelectedEvent"></department-tree>
  </div>
</template>

<script>
import departmentTree from './department-tree'
export default {
  name: 'DepartmentManage',
  components: {
    departmentTree
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/department',
      tree: {
        data: []
      },
      dialogAddDepartment: {
        data: {
          name: '',
          remark: '',
          pid: -1,
          pName: '',
          sort: 1
        },
        visible: false
      },
      dialogEditDepartment: {
        data: {
          id: -1,
          name: '',
          remark: '',
          parentName: '',
          sort: 1
        },
        visible: false
      }
    }
  },
  mounted() {
    this.loadTreeData()
  },
  methods: {
    loadTreeData() {
      const self = this
      self.$request.get(self.baseUrl + '/tree.json').then(response => {
        self.tree.data = response.data
      })
    },
    handleEditRow(row) {
      const self = this
      const id = row.id
      self.dialogEditDepartment.data.id = id
      // TODO
      self.$request.get('/api/ucenter/department/?id=' + id).then(response => {
        self.dialogEditDepartment.data.parentName = response.data.parentName
        self.dialogEditDepartment.data.remark = response.data.remark
        self.dialogEditDepartment.data.name = response.data.name
        self.dialogEditDepartment.sort = response.data.sort
        self.dialogEditDepartment.visible = true
      })
    },
    handleDeleteRow(row) {
      const self = this
      const id = row.id
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete('/api/ucenter/department?id=' + id).then(response => {
          self.$message.success(response.message)
        })
      })
    },
    handleAddDepartmentSubmit() {
      const self = this
      const data = self.dialogAddDepartment.data
      self.$request.post(self.baseUrl, data).then(response => {
        self.$message.success(response.message)
        self.dialogAddDepartment.visible = false
        self.loadTreeData()
        self.$refs['addDepartmentForm'].resetFields()
      })
    },
    handleAddDepartmentButton() {
      const self = this
      self.dialogAddDepartment.cascaderOptions = []
      self.dialogAddDepartment.cascaderDisabled = true
      self.dialogAddDepartment.visible = true
    },
    handleEditDepartmentSubmit() {
      const self = this
      self.$request.put(self.baseUrl, self.dialogEditDepartment.data).then(response => {
        self.$message.success(response.message)
        self.dialogEditDepartment.visible = false
        self.loadTreeData()
      })
    },
    handleOrganizationOptionChanged(changed) {
      console.log(changed)
      const self = this
      self.$request.get('/api/ucenter/department/cascader.json?organizationId=' + changed).then(response => {
        self.dialogAddDepartment.cascaderOptions = response.data
        self.dialogAddDepartment.cascaderDisabled = false
      })
    },
    // ///////////////////////////////////////////////////////////////////////////
    handleSearchDepartment() {
      this.$refs.dialogDepratmentTree.show()
    },
    dialogDepartmentTreeSelectedEvent(node) {
      this.dialogAddDepartment.data.pName = node.label
      this.dialogAddDepartment.data.pid = node.id
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
