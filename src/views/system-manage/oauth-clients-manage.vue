<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl" ref="datatable"
               @edit-row="handleEditRow"
               title="客户端列表">

      <div slot="button">
        <el-button size="mini" type="primary" @click="handleAddButton">添加</el-button>
      </div>

      <el-table-column label="操作" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini" @click="handleEditRow(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" round @click="handleDeleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </datatable>

    <!--添加对话框-->
    <el-dialog
      title="添加" width="70%"
      :visible.sync="dialogAdd.visible">
      <div>
        <el-form :model="dialogAdd.data" ref="addForm" size="small"
                 label-width="100px">

          <el-row>
            <el-col :span="12">
              <el-form-item label="客户端ID" prop="clientId">
                <el-input v-model="dialogAdd.data.clientId" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="秘钥" prop="clientSecret">
                <el-input v-model="dialogAdd.data.clientSecret" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="授权类型" prop="authorizedGrantTypes">
                <el-input v-model="dialogAdd.data.authorizedGrantTypes" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="域" prop="scope">
                <el-input v-model="dialogAdd.data.scope" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="资源ID" prop="resourceIds">
                <el-input v-model="dialogAdd.data.resourceIds" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回调地址" prop="webServerRedirectUri">
                <el-input v-model="dialogAdd.data.webServerRedirectUri" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="refreshToken过期时间" prop="refreshTokenValidity" label-width="160px">
                <el-input v-model="dialogAdd.data.refreshTokenValidity" size="small" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Token过期时间" prop="accessTokenValidity" label-width="120px">
                <el-input v-model="dialogAdd.data.accessTokenValidity" size="small" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限值" prop="authorities">
                <el-input v-model="dialogAdd.data.authorities" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附加信息" prop="additionalInformation">
                <el-input v-model="dialogAdd.data.additionalInformation" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="自动授权" prop="autoapprove">
                <el-switch v-model="dialogAdd.data.autoapprove" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd.visible = false" size="small" round>取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit" size="small" round>确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog
      title="编辑" width="70%"
      :visible.sync="dialogEdit.visible">
      <div>
        <el-form :model="dialogEdit.data" ref="addForm" size="small"
                 label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户端ID" prop="clientId">
                <el-input v-model="dialogEdit.data.clientId" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="秘钥" prop="clientSecret">
                <el-input v-model="dialogEdit.data.clientSecret" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="授权类型" prop="authorizedGrantTypes">
                <el-input v-model="dialogEdit.data.authorizedGrantTypes" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="域" prop="scope">
                <el-input v-model="dialogEdit.data.scope" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="资源ID" prop="resourceIds">
                <el-input v-model="dialogEdit.data.resourceIds" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回调地址" prop="webServerRedirectUri">
                <el-input v-model="dialogEdit.data.webServerRedirectUri" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="refreshToken过期时间" prop="refreshTokenValidity" label-width="160px">
                <el-input v-model="dialogEdit.data.refreshTokenValidity" size="small" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Token过期时间" prop="accessTokenValidity" label-width="120px">
                <el-input v-model="dialogEdit.data.accessTokenValidity" size="small" type="number"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限值" prop="authorities">
                <el-input v-model="dialogEdit.data.authorities" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附加信息" prop="additionalInformation">
                <el-input v-model="dialogEdit.data.additionalInformation" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="自动授权" prop="autoapprove">
                <el-switch v-model="dialogEdit.data.autoapprove" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit.visible = false" size="small" round>取 消</el-button>
        <el-button type="primary" @click="handleEditOrganizationSubmit" size="small" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'oauth-clients-manage',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/ucenter/sys/oauth_details',
      columns: [
        {
          label: '客户端ID',
          prop: 'clientId',
          width: 150
        },
        {
          label: '授权类型',
          prop: 'authorizedGrantTypes'
        },
        {
          label: '域',
          prop: 'scope'
        },
        {
          label: '资源ID',
          prop: 'resourceIds'
        }
      ],
      dialogAdd: {
        visible: false,
        data: {
          clientId: '',
          resourceIds: '',
          clientSecret: '',
          scope: '',
          authorizedGrantTypes: '',
          webServerRedirectUri: '',
          authorities: '',
          accessTokenValidity: '',
          refreshTokenValidity: '',
          additionalInformation: '',
          autoapprove: false
        }
      },
      dialogEdit: {
        visible: false,
        data: {
          clientId: '',
          resourceIds: '',
          clientSecret: '',
          scope: '',
          authorizedGrantTypes: '',
          webServerRedirectUri: '',
          authorities: '',
          accessTokenValidity: '',
          refreshTokenValidity: '',
          additionalInformation: '',
          autoapprove: false
        }
      }
    }
  },
  methods: {
    handleAddButton() {
      this.dialogAdd.visible = true
    },
    handleAddSubmit() {
      const self = this
      self.$request.post(self.baseUrl, self.dialogAdd.data).then(response => {
        self.$message.success(response.message)
        self.$refs.datatable.refreshData() // 刷新数据
        self.dialogAdd.visible = false
        self.$refs.addForm.resetFields() // 重置表单
      })
    },
    handleEditRow(row) {
      const id = row.clientId
      const self = this
      self.dialogEdit.data.id = id
      self.$request.get(self.baseUrl + '/' + id).then(response => {
        self.dialogEdit.data = response.data
        self.dialogEdit.visible = true
      })
    },
    handleDeleteRow(row) {
      const self = this
      const clientId = row.clientId
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '/' + clientId).then(response => {
          self.$message.success(response.message)
          self.$refs.datatable.refreshData() // 刷新数据
        })
      })
    },
    handleEditOrganizationSubmit() {
      const self = this
      self.$request.put(self.baseUrl, self.dialogEdit.data).then(response => {
        self.$message.success(response.message)
        self.dialogEdit.visible = false
        self.$refs.datatable.refreshData()
      })
    }
  }
}
</script>

<style scoped>

</style>
