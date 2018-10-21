<template>
  <div class="main-contain-holder">
    <datatable :columns="columns" :url="baseUrl" ref="datatable" :show-index="false"
               title="App版本管理">

      <div slot="button">
        <el-button size="mini" type="primary" @click="dialogAddAppInfo.visible = true">添加</el-button>
      </div>

      <el-table-column label="操作" width="350px" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" round size="mini" @click="updateVersionRow(scope.row)">版本更新</el-button>
          <el-button type="info" round size="mini">历史版本</el-button>
          <el-button type="primary" round size="mini" @click="handleEditRow(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" round @click="handleDeleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </datatable>

    <!--添加-->
    <el-dialog
      title="生成激活码" width="600px" :visible.sync="dialogAddAppInfo.visible">
      <div>
        <el-form :model="dialogAddAppInfo.data" ref="form" label-width="100px" size="small" :rules="dialogAddAppInfo.rules">
          <el-form-item label="APP名称" prop="name">
            <el-input v-model="dialogAddAppInfo.data.name" type="text"></el-input>
          </el-form-item>
          <el-form-item label="APP唯一标识" prop="flag">
            <el-input v-model="dialogAddAppInfo.data.flag" type="text" placeholder="用于区分app，不能重复，只能用英文字母"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="dialogAddAppInfo.data.description" type="text"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddAppInfo.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddAppInfoSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--版本管理-->
    <el-dialog @closed="dialogUpdateVersionClosed"
               title="生成激活码" width="600px" :visible.sync="dialogUpdateVersion.visible">
      <div>
        <el-form :model="dialogUpdateVersion.data" ref="updateVersionForm" label-width="100px" size="small" :rules="dialogUpdateVersion.rules">
          <el-form-item label="版本号" prop="versionNum">
            <el-input v-model="dialogUpdateVersion.data.versionNum" type="text"></el-input>
          </el-form-item>
          <el-form-item label="版本描述" prop="description">
            <el-input v-model="dialogUpdateVersion.data.description" type="text"></el-input>
          </el-form-item>
          <el-form-item label="更新文件">
            <el-upload class="upload-demo" action="/api/devices-management/devices/db-app-version/upload" ref="uploadFile"
                       :headers="{Authorization: token}" :file-list="fileList"
                       :limit="1" :multiple="false" :on-success="handleUploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVersion.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateVersionSubmit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
import { getToken } from '@/utils/auth' // 验权
export default {
  name: 'index',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/devices-management/devices/db-app-info',
      token: 'Bearer ' + getToken(),
      columns: [
        {
          label: '名称',
          prop: 'name',
          width: 150
        },
        {
          label: 'app描述',
          prop: 'description'
        },
        {
          label: '标识',
          prop: 'flag'
        },
        {
          label: '当前版本',
          prop: 'currentVersion'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          filter: 'dateFormat',
          width: 150
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          filter: 'dateFormat',
          width: 150
        }
      ],
      dialogAddAppInfo: {
        visible: false,
        data: {
          name: '',
          description: '',
          flag: ''
        }
      },
      dialogUpdateVersion: {
        visible: false,
        fileList: [],
        data: {
          appId: -1,
          versionNum: '',
          description: '',
          filePath: '',
          group: '',
          path: ''
        }
      }
    }
  },
  methods: {
    handleAddAppInfoSubmit() {
      const self = this
      self.$request.post(self.baseUrl, self.dialogAddAppInfo.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddAppInfo.visible = false
        self.$refs.datatable.refreshData()
      })
    },
    handleEditRow(row) {},
    handleDeleteRow(row) {
      const self = this
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '/' + row.id).then(response => {
          self.$message.success(response.message)
          self.$refs.datatable.refreshData() // 刷新数据
        })
      })
    },
    updateVersionRow(row) {
      this.$nextTick(function() {
        this.$refs.updateVersionForm.resetFields()
        this.dialogUpdateVersion.fileList = []
        this.$refs.uploadFile.clearFiles()
      })
      this.dialogUpdateVersion.data.filePath = ''
      this.dialogUpdateVersion.data.appId = row.id
      this.dialogUpdateVersion.visible = true
    },
    // 上传成功回调方法
    handleUploadSuccess(response, file, fileList) {
      console.log('upload success..')
      this.dialogUpdateVersion.data.filePath = response.data.fullPath
      this.dialogUpdateVersion.data.group = response.data.group
      this.dialogUpdateVersion.data.path = response.data.path
    },
    // 对话框关闭时的回调，用于删除已经上传的文件
    dialogUpdateVersionClosed() {
      if (this.dialogUpdateVersion.data.filePath === null || this.dialogUpdateVersion.data.filePath === '') {
        return
      }
      const data = {
        group: this.dialogUpdateVersion.data.group,
        path: this.dialogUpdateVersion.data.path,
        fullPath: this.dialogUpdateVersion.data.filePath
      }
      const self = this
      self.$request.post('/api/devices-management/devices/db-app-version/delete-upload-file.do', data).then(response => {
        self.$message.success(response.message)
      })
    },
    // 提交
    handleUpdateVersionSubmit() {
      const self = this
      self.$request.post('/api/devices-management/devices/db-app-version', self.dialogUpdateVersion.data).then(response => {
        self.$message.success(response.message)
        self.dialogUpdateVersion.visible = false
        self.$refs.datatable.refreshData()
        self.$refs.updateVersionForm.resetFields()
      })
    }
  }
}
</script>

<style scoped>

</style>
