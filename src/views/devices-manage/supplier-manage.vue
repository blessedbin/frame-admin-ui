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
      title="添加" width="600px" :visible.sync="dialogAddSupplier.visible">
      <div>
        <el-form :model="dialogAddSupplier.data" ref="form" label-width="100px" size="small" :rules="dialogAddSupplier.rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogAddSupplier.data.name"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="contactsName">
            <el-input v-model="dialogAddSupplier.data.contactsName"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="phone">
            <el-input v-model="dialogAddSupplier.data.phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="cantactsPhone">
            <el-input v-model="dialogAddSupplier.data.cantactsPhone"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogAddSupplier.data.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddSupplier.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSupplierSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改-->
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'supplier-manage',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/devices-management/devices/organization/supplier',
      columns: [
        {
          label: '名称',
          prop: 'name',
          width: 150
        },
        {
          label: '联系人',
          prop: 'contactsName'
        },
        {
          label: '联系人电话',
          prop: 'cantactsPhone'
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
      dialogAddSupplier: {
        visible: false,
        data: {
          name: '',
          address: '',
          contactsName: '',
          cantactsPhone: '',
          remark: ''
        }
      }
    }
  },
  created() {},
  methods: {
    handleAddButton() {
      this.dialogAddSupplier.visible = true
    },
    handleSupplierSubmit() {
      const self = this
      self.$request.post(this.baseUrl, self.dialogAddSupplier.data).then(response => {
        self.$message.success(response.message)
        self.dialogAddSupplier.visible = false
        self.$refs.datatable.refreshData()
      })
    },
    handleEditRow(row) {
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
