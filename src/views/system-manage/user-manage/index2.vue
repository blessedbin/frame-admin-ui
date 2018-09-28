<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl" ref="datatable" :showIndex="true" :show-edit-row-button="false" :show-delete-row-button="false"
               title="用户列表">
      <div slot="button">
        <el-button size="mini" type="primary" @click="dialogAddUser.visible = true">添加</el-button>
      </div>
      <div>
        <el-table-column label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="handleEditRow(scope.row)">编辑</el-button>
            <el-button type="info" round size="mini" @click="handleEditRoleRow(scope.row)">编辑角色</el-button>
            <el-button type="danger" size="mini" round @click="handleDeleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </div>
    </datatable>

    <!--添加用户-->
    <el-dialog
      :title="dialogAddUser.title" width="600px"
      :visible.sync="dialogAddUser.visible">
      <div>
        <el-form :model="dialogAddUser.data" ref="form" label-width="80px" size="small" :rules="dialogAddUser.rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="组织">
                <el-input type="text"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="dialogAddUser.data.username"></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="dialogAddUser.data.email"></el-input>
          </el-form-item>
          <el-form-item label="phone" prop="phone">
            <el-input v-model="dialogAddUser.data.phone"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUser.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUserSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑用户角色-->
    <el-dialog title="编辑角色" :visible.sync="dialogEditUserRole.visible">
      <div >
        <el-transfer v-model="dialogEditUserRole.selectedRole" filterable
                     :titles="['待选角色','已选角色']"
                     :data="dialogEditUserRole.roleList">
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUserRole.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUserRoleSubmit">保  存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'Index2',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/user',
      columns: [
        {
          label: '用户名',
          prop: 'username',
          width: 150
        },
        {
          label: '创建时间',
          prop: 'createTime',
          filter: 'dateFormat'
        },
        {
          label: 'email',
          prop: 'email'
        },
        {
          label: 'phone',
          prop: 'phone'
        },
        {
          label: '组织名称',
          prop: 'organizationId'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      dialogAddUser: {
        visible: false,
        data: {
          username: '',
          email: '',
          phone: '',
          departmentIds: [],
          organizationId: ''
        }
      },
      dialogEditUserRole: {
        visible: false,
        selectedRole: [],
        roleList: [],
        uuid: ''
      }
    }
  },
  watch: {
    'dialogAddUser.data.organizationId': function(value) {
      console.log(value)
    }
  },
  methods: {
    restForm() {
      this.dialogAddUser.data = {
        username: '',
        email: '',
        phone: '',
        organizationId: '',
        departmentIds: []
      }
    },
    handleAddUserSubmit() {
      const self = this
      self.$request.post(self.baseUrl, self.dialogAddUser.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddUser.visible = false
        self.restForm()
        self.$refs.datatable.refreshData()
      })
    },
    handleOrganizationOptionChanged(data) {
      const self = this
      self.$request.get('/api/ucenter/department/cascader.json?organizationId=' + data).then(response => {
        self.dialogAddUser.cascaderOptions = response.data
        self.dialogAddUser.cascaderDisabled = false
      })
    },
    handleDeleteRow(row) {
      console.log(row)
      const self = this
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除数据事件
        self.$request.delete(self.baseUrl + '?uuid=' + row.uuid).then(response => {
          self.$message.success(response.message)
          self.$refs.datatable.refreshData()
        })
      })
    },
    handleEditRow(row) {
      console.log(row)
    },
    handleEditRoleRow(row) {
      console.log(row)
      const uuid = row.uuid
      const self = this
      self.dialogEditUserRole.uuid = uuid
      self.$request.get('/api/ucenter/sys/role/transfer-list.json?uuid=' + uuid).then(response => {
        self.dialogEditUserRole.roleList = response.data.roleList
        self.dialogEditUserRole.selectedRole = response.data.selectedRole
        self.dialogEditUserRole.visible = true
      })
    },
    // 编辑角色相关
    handleEditUserRoleSubmit() {
      const self = this
      const data = { uuid: self.dialogEditUserRole.uuid, selectedRole: self.dialogEditUserRole.selectedRole }
      self.$request.put('/api/ucenter/sys/role/user_role.json', data).then(response => {
        self.$message.success(response.message)
        self.dialogEditUserRole.visible = false
      })
    }
  }
}
</script>

<style scoped>

</style>
