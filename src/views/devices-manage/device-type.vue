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
      title="添加" width="600px" :visible.sync="dialogAddType.visible">
      <div>
        <el-form :model="dialogAddType.data" ref="form" label-width="100px" size="small" :rules="dialogAddType.rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogAddType.data.name"></el-input>
          </el-form-item>
          <el-form-item label="型号" prop="type">
            <el-input v-model="dialogAddType.data.type"></el-input>
          </el-form-item>
          <el-form-item label="设备描述" prop="description">
            <el-input v-model="dialogAddType.data.description"></el-input>
          </el-form-item>
          <el-form-item label="供货商">
            <el-autocomplete v-model="dialogAddType.data.supplierName" :fetch-suggestions="supplierQuerySearchAsync" placeholder="请输入" value-key="name"
                             @select="handleSupplierSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogAddType.data.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddType.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑-->
    <!--添加对话框-->
    <el-dialog
      title="添加" width="600px" :visible.sync="dialogEditType.visible">
      <div>
        <el-form :model="dialogEditType.data" ref="form" label-width="100px" size="small" :rules="dialogEditType.rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogEditType.data.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="型号" prop="type">
            <el-input v-model="dialogEditType.data.type" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备描述" prop="description">
            <el-input v-model="dialogEditType.data.description"></el-input>
          </el-form-item>
          <el-form-item label="供货商">
            <el-autocomplete v-model="dialogEditType.data.supplierName" :fetch-suggestions="supplierQuerySearchAsync" placeholder="请输入" value-key="name"
                             @select="handleSupplierSelect" disabled></el-autocomplete>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogEditType.data.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditType.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditTypeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'device-type',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/devices-management/devices/db-device-type',
      columns: [
        {
          label: '设备名称',
          prop: 'name',
          width: 150
        },
        {
          label: '设备型号',
          prop: 'type',
          width: 150
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '供应商名称',
          prop: 'supplierId',
          width: 120
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
      dialogAddType: {
        visible: false,
        data: {
          name: '',
          type: '',
          description: '',
          supplierId: '',
          supplierName: '',
          remark: ''
        }
      },
      dialogEditType: {
        visible: false,
        data: {
          id: -1,
          name: '',
          type: '',
          description: '',
          supplierId: '',
          supplierName: '',
          remark: ''
        }
      }
    }
  },
  methods: {
    handleAddButton() {
      this.dialogAddType.visible = true
    },
    handleEditRow(row) {
      this.dialogEditType.data = row
      this.dialogEditType.visible = true
    },
    handleDeleteRow(row) {
      const self = this
      const id = row.id
      this.$confirm('删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '/' + id).then(response => {
          self.$message.success(response.message)
          self.$refs.datatable.refreshData() // 刷新数据
        })
      })
    },
    handleSupplierSelect(item) {
      this.dialogAddType.data.supplierId = item.organizationId
      this.dialogAddType.data.retailerName = item.name
    },
    supplierQuerySearchAsync(qs, callback) {
      const self = this
      self.$request.get('/api/devices-management/devices/organization/supplier?queryString=' + qs).then(response => {
        callback(response.data)
      })
    },
    handleAddTypeSubmit() {
      const self = this
      self.$request.post(self.baseUrl, self.dialogAddType.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddType.visible = false
        self.$refs.datatable.refreshData()
      })
    },
    handleEditTypeSubmit() {
      const self = this
      self.$request.put(self.baseUrl, self.dialogEditType.data).then(response => {
        self.$message.success(response.message)
        self.dialogEditType.visible = false
        self.$refs.datatable.refreshData()
      })
    }
  }
}
</script>

<style scoped>

</style>
