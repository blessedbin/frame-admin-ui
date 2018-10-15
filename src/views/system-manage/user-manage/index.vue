<template>

  <div class="main-contain-holder">

    <div class="filter-container">
      <el-input @keyup.enter.native="onSearch" style="width: 200px;float:right;margin-left: 10px" class="filter-item" placeholder="搜索"
                v-model="table.searchValue">
      </el-input>
      <el-button type="primary" @click="loadTableData" style="float:left"><svg-icon icon-class="refresh" ></svg-icon>刷新</el-button>
      <el-button type="primary" @click="handleAddUserButton" style="float:left">添加</el-button>
    </div>

    <el-table :data="table.data" stripe border :loading="table.loading" style="margin-top: 15px">
      <el-table-column label="ID" align="center" type="index" width="100"> </el-table-column>
      <el-table-column label="用户名" prop="username">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCheckUser(scope.row)">{{ scope.row.username }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="email" prop="email" ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" round size="small" @click="handleEditRow(scope.row)">编辑</el-button>
          <el-button size="small" round @click="handleEditUserRoleRow(scope.row)">编辑角色</el-button>
          <el-button type="danger" round size="small" @click="handleDeleteRow(scope.row)">删除</el-button>
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

    <div slot="other">
      <el-dialog
        :title="dialogAddUser.title" width="600px"
        :visible.sync="dialogAddUser.visible">
        <div>
          <el-form :model="dialogAddUser.data" ref="form" label-width="80px" :rules="dialogAddUser.rules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="dialogAddUser.data.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="dialogAddUser.data.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="rePassword">
              <el-input v-model="dialogAddUser.data.rePassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
              <el-input v-model="dialogAddUser.data.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAddUser.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddRoleSubmit">确 定</el-button>
        </span>
      </el-dialog>

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

  </div>

</template>

<script>
import request from '@/utils/request'
export default {
  name: 'manage-user-index',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dialogAddUser.data.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
      request.get('/ucenter/manage/user/check-username.json?username=' + value).then(response => {
        if (response.data) {
          callback(new Error('用户名已经存在'))
        } else {
          callback()
        }
      })
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      }
      request.get('/ucenter/manage/user/check-email.json?email=' + value).then(response => {
        if (response.data) {
          callback(new Error('邮箱已经存在'))
        } else {
          callback()
        }
      })
    }
    return {
      table: {
        data: [],
        searchValue: '',
        loading: false
      },
      pagination: {
        currentPage: 1,
        pageSizes: [20, 30, 50, 100],
        pageSize: 20,
        total: 0
      },
      dialogAddUser: {
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          rePassword: [
            { validator: validatePass, trigger: 'blur' },
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入Email', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ]
        },
        data: {
          username: '',
          password: '',
          rePassword: '',
          email: ''
        },
        visible: false,
        title: '添加角色',
        type: 'add'
      },
      dialogEditUserRole: {
        visible: false,
        selectedRole: [],
        roleList: [],
        uuid: ''
      }
    }
  },
  mounted() {
    this.loadTableData()
  },
  methods: {
    handleSizeChange(size) {
    },
    handleCurrentChange(current) {},
    loadTableData() {
      const self = this
      self.table.loading = true
      var url = '/ucenter/manage/user/datatable.json?page_num=' + self.pagination.currentPage +
          '&page_size=' + self.pagination.pageSize + '&search_value=' + self.table.searchValue
      self.$request.get(url).then(response => {
        self.pagination = response.pagination
        self.table.data = response.data
        self.table.loading = false
      })
    },
    onSearch() {},
    handleAddRoleSubmit() {
      const self = this
      console.log('handleAddRoleSubmit')
      if (self.dialogAddUser.type === 'add') {
        console.log('handleAddRoleSubmit1')
        self.$refs['form'].validate(valid => {
          console.log('handleAddRoleSubmit2')
          if (valid) {
            console.log('handleAddRoleSubmit3')
            self.$request.post('/ucenter/manage/user/add', self.dialogAddUser.data).then(response => {
              self.$message.success(response.message)
              self.dialogAddUser.visible = false
              self.loadTableData()
            })
          } else {
            self.$message.warning('验证失败，请检查表单')
            return false
          }
        }) // end validate
      } else if (self.dialogAddUser.type === 'edit') {
        self.$request.put('/api/system/role', self.dialogAddUser.data).then(response => {
          self.$message.success(response.message)
          self.dialogAddUser.visible = false
          self.loadTableData()
        })
      }
    },
    handleAddUserButton() {
      this.resetForm()
      this.dialogAddUser.visible = true
      this.dialogAddUser.title = '添加用户'
      this.dialogAddUser.type = 'add'
    },
    handleEditRow(row) {
      const self = this
      const uuid = row.uuid
      self.$router.push('/system/manage/edit-user/' + uuid)
    },
    handleCheckUser(row) {
      this.$router.push('/system/manage/check-user/' + row.uuid)
    },
    handleDeleteRow(row) {
      const uuid = row.uuid
      const self = this
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.get('/ucenter/manage/user/delete?uuid=' + uuid).then(response => {
          self.$message.success(response.message)
          self.loadTreeDate()
        })
      })
    },
    resetForm() { // TODO
    },
    // 编辑用户角色相关 ////////////////////////////////////////////////////////////////////////////////////
    handleEditUserRoleRow(row) {
      const self = this
      const uuid = row.uuid
      self.dialogEditUserRole.uuid = uuid
      self.$request.get('/api/ucenter/sys/role/transfer-list.json?uuid=' + uuid).then(response => {
        self.dialogEditUserRole.roleList = response.data.roleList
        self.dialogEditUserRole.selectedRole = response.data.selectedRole
        self.dialogEditUserRole.visible = true
      })
    },
    handleEditUserRoleSubmit() {
      const self = this
      const data = { uuid: self.dialogEditUserRole.uuid, selectedRole: self.dialogEditUserRole.selectedRole }
      self.$request.put('/api/ucenter/sys/role/user-role.json', data).then(response => {
        self.$message.success(response.message)
        self.dialogEditUserRole.visible = false
      })
    }
  }
}
</script>

<style scoped>
.filter-container{
  margin-bottom: 15px;
}
</style>
