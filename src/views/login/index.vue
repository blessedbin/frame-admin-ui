<template>
  <div class="login-container" :style="background">
    <el-form class="login-form" auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">后台管理系统登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" ></svg-icon>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" auto-complete="on" placeholder="用户名" ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="on"
                  placeholder="密码"></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" ></svg-icon></span>
      </el-form-item>
      <el-form-item prop="vadatecode">
        <el-row>
          <el-col :span="1">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
          </el-col>
          <el-col :span="11">
            <el-input name="validateCode" v-model="loginForm.validateCode" placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="12">
            <img :src="validateImageSrc" @click="loadValidateImageSrc"
                 style="margin-top: 12px;margin-bottom: -2px">
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登  录
        </el-button>
      </el-form-item>
      <!--<div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div>-->
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      validateImageSrc: '',
      loginForm: {
        username: '',
        password: '',
        validateCode: '',
        imgToken: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '不能为空' }]
      },
      loading: false,
      pwdType: 'password',
      background: {
        backgroundImage: 'url(' + require('@/assets/images/background.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
    }
  },
  mounted() {
    this.loadValidateImageSrc()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      const self = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch((error) => {
            this.loading = false
            console.log(error)
            // 重新加载验证码
            self.loadValidateImageSrc()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    loadValidateImageSrc() {
      const self = this
      self.$request.get('/api/frame-auth/code/captacha').then(response => {
        self.validateImageSrc = response.data.img
        self.loginForm.imgToken = response.data.imgToken
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: rgba(164, 207, 253, 0.01);
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
