<template>
  <div class="main-contain-holder">
    <el-row>
      <el-col :span="10">
        <el-form :model="data" status-icon :rules="rules2" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldPass">
            <el-input type="password" v-model="data.oldPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="data.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="data.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitChangePassword('form')">提交</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    const validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原始密码'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.data.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      data: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules2: {
        oldPass: [
          { validator: validateOldPass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitChangePassword(formName) {
      const self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.$request.post('/api/user/change_password', self.data).then(response => {
            self.$message.success(response.message)
            self.resetForm(formName)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
