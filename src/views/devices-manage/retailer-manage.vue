<template>
  <div class="main-contain-holder">

    <datatable :columns="columns" :url="baseUrl" ref="datatable">
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
      title="添加" width="600px" :visible.sync="dialogAddretailer.visible">
      <div>
        <el-form :model="dialogAddretailer.data" ref="form" label-width="100px" size="small" :rules="dialogAddretailer.rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogAddretailer.data.name"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="dialogAddretailer.data.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contactsName">
            <el-input v-model="dialogAddretailer.data.contactsName"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="cantactsPhone">
            <el-input v-model="dialogAddretailer.data.cantactsPhone"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogAddretailer.data.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddretailer.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleretailerSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改-->
    <el-dialog
      title="修改" width="600px" :visible.sync="dialogEditretailer.visible">
      <div>
        <el-form :model="dialogEditretailer.data" ref="form" label-width="100px" size="small" :rules="dialogEditretailer.rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogEditretailer.data.name"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input v-model="dialogEditretailer.data.address"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="contactsName">
            <el-input v-model="dialogEditretailer.data.contactsName"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="cantactsPhone">
            <el-input v-model="dialogEditretailer.data.cantactsPhone"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogEditretailer.data.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditretailer.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditretailerSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'retailer-manage',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/devices-management/devices/organization/retailer',
      columns: [
        {
          label: '名称',
          prop: 'name',
          width: 150
        },
        {
          label: '联系人',
          prop: 'contactsName',
          width: 100
        },
        {
          label: '联系人电话',
          prop: 'cantactsPhone',
          width: 120
        },
        {
          label: '地址',
          prop: 'address',
          width: 200
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
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      dialogAddretailer: {
        visible: false,
        data: {
          name: '',
          address: '',
          contactsName: '',
          cantactsPhone: '',
          remark: ''
        }
      },
      dialogEditretailer: {
        visible: false,
        data: {
          name: '',
          address: '',
          contactsName: '',
          cantactsPhone: '',
          remark: '',
          organizationId: ''
        }
      }
    }
  },
  created() {},
  methods: {
    handleAddButton() {
      this.dialogAddretailer.visible = true
    },
    handleretailerSubmit() {
      const self = this
      self.$request.post(this.baseUrl, self.dialogAddretailer.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddretailer.visible = false
        self.$refs.datatable.refreshData()
      })
    },
    handleEditretailerSubmit() {
      const self = this
      self.$request.put(self.baseUrl + '/' + self.dialogEditretailer.data.organizationId, self.dialogEditretailer.data).then(response => {
        self.$message.success(response.message)
        self.dialogEditretailer.visible = false
        self.$refs.datatable.refreshData()
      })
    },
    handleEditRow(row) {
      const self = this
      self.dialogEditretailer.data = row
      self.dialogEditretailer.visible = true
    },
    handleDeleteRow(row) {
      const self = this
      const organizationId = row.organizationId
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '/' + organizationId).then(response => {
          self.$message.success(response.message)
          self.$refs.datatable.refreshData() // 刷新数据
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
