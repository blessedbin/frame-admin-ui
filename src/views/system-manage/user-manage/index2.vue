<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl" ref="datatable" :show-edit-row-button="false" :show-delete-row-button="false"
               title="用户列表">
      <div slot="button">
        <el-button size="mini" type="primary" @click="dialogAddUser.visible = true">添加</el-button>
      </div>
      <div>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button type="info" round size="mini" @click="handleEditRoleRow(scope.row)">编辑角色</el-button>
            <el-dropdown @command="(command) => {dialogEditUser_handleCommand(command, scope.row)}">
              <el-button type="primary" size="mini" round>
                其他<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="reset_password">重置密码</el-dropdown-item>
                <el-dropdown-item command="delete">删除用户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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

    <!--编辑用户-->
    <el-dialog title="编辑用户" :visible.sync="dialogEditUser.visible">
      <div>编辑用户</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditUser.visible = false">取 消</el-button>
        <el-button type="primary">保  存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'index2',
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
      },
      dialogEditUser: {
        visible: false
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
    },
    // //////////////////////////////////////////////////////
    dialogEditUser_handleCommand(command, row) {
      console.log('-----------------------------')
      console.log(command)
      console.log(row)
      const self = this
      // 重置密码
      if (command === 'reset_password') {
        this.$confirm('重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 执行
          self.$request.get('/api/ucenter/sys/user/reset_password.do?uuid=' + row.uuid).then(response => {
            self.$message.success(response.message)
          })
        })
        // 删除用户
      } else if (command === 'delete') {
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
      }
    }
  }
}
</script>

<style scoped>

</style>
