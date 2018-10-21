<template>
  <div class="main-contain-holder">
    <datatable :columns="columns" :url="baseUrl" ref="datatable">
      <div slot="button">
        <el-button size="mini" type="primary" @click="generateCode">生成注册码</el-button>
      </div>

    </datatable>

    <!--生成-->
    <el-dialog
      title="生成激活码" width="600px" :visible.sync="dialogGenerateCode.visible">
      <div>
        <el-form :model="dialogGenerateCode.data" ref="form" label-width="100px" size="small" :rules="dialogGenerateCode.rules">
          <el-form-item label="注册数量" prop="number">
            <el-input v-model="dialogGenerateCode.data.number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-autocomplete v-model="dialogGenerateCode.data.deviceTypeName" :fetch-suggestions="deviceTypeQuerySearchAsync"
                             placeholder="请输入" value-key="name"
                             @select="handleDeviceTypeSelect">
              <template slot-scope="{ item }">
                <div class="text-overflow: ellipsis;overflow: hidden;">{{ item.name }}-{{ item.type }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="销售商">
            <el-autocomplete v-model="dialogGenerateCode.data.retailerName" :fetch-suggestions="retailerQuerySearchAsync" placeholder="请输入" value-key="name"
                             @select="handleRetailerSelect"></el-autocomplete>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGenerateCode.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleGenerateCodeSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--导出Excel-->
    <el-dialog
      title="生成成功" width="600px" :visible.sync="dialogExportExcel.visible">
      <div>
        <el-input v-model="dialogExportExcel.code"></el-input>
      </div>
      <span slot="footer">
        <el-button @click="() => {
          dialogExportExcel.visible = false
          dialogGenerateCode.visible = false
        }">关 闭</el-button>
      </span>
      <!--<el-button type="primary" @click="exportExcel">导出Excel文件</el-button>-->
    </el-dialog>
  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
import { parseTime } from '@/utils'
export default {
  name: 'registration-code-manage',
  components: {
    datatable
  },
  data() {
    return {
      baseUrl: '/api/devices-management/devices/db-registration-code',
      columns: [
        {
          label: '激活码',
          prop: 'registrationCode',
          width: 150
        },
        {
          label: '销售商',
          prop: 'retailerName',
          width: 150
        },
        {
          label: '剩余数量',
          prop: 'times',
          width: 150
        },
        {
          label: '创建时间',
          prop: 'createTime',
          filter: 'dateFormat'
        },
        {
          label: '激活时间',
          prop: 'registerTime',
          filter: 'dateFormat'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      dialogGenerateCode: {
        visible: false,
        data: {
          retailerId: '',
          retailerName: '',
          customerId: '',
          customerName: '',
          remark: '',
          number: 1,
          deviceTypeId: '',
          deviceTypeName: ''
        }
      },
      dialogExportExcel: {
        visible: false,
        code: ''
      }
    }
  },
  methods: {
    generateCode() {
      this.dialogGenerateCode.visible = true
    },
    handleGenerateCodeSubmit() {
      const self = this
      self.$request.post('/api/devices-management/devices/db-registration-code/generate_code.do', self.dialogGenerateCode.data).then(response => {
        self.$message.success(response.message)
        self.$refs.datatable.refreshData()
        // self.dialogGenerateCode.visible = false
        self.generatedCode = response.data
        self.dialogExportExcel.visible = true
        self.dialogExportExcel.code = self.generatedCode.registrationCode
      })
    },
    retailerQuerySearchAsync(qs, callback) {
      const self = this
      self.$request.get('/api/devices-management/devices/organization/retailer?queryString=' + qs).then(response => {
        callback(response.data)
      })
    },
    deviceTypeQuerySearchAsync(qs, callback) {
      const self = this
      self.$request.get('/api/devices-management/devices/db-device-type/query?queryString=' + qs).then(response => {
        console.log(response.data)
        callback(response.data)
      })
    },
    handleRetailerSelect(item) {
      this.dialogGenerateCode.data.retailerId = item.organizationId
      this.dialogGenerateCode.data.retailerName = item.name
    },
    handleDeviceTypeSelect(item) {
      this.dialogGenerateCode.data.deviceTypeName = item.name + '-' + item.type
      this.dialogGenerateCode.data.deviceTypeId = item.id
    },
    exportExcel() {
      const self = this
      const list = self.generatedCode
      if (this.generatedCode) {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['激活码', '生成时间']
          const filterVal = ['registrationCode', 'createTime']
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '激活码',
            autoWidth: true
          })
        })
      }
      this.generatedCode = null
      this.dialogGenerateCode.visible = false
      this.dialogExportExcel.visible = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>

</style>
