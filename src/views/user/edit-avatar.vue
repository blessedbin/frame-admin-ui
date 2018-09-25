<template>
  <div class="main-contain-holder">

    <pan-thumb :image="image"></pan-thumb>

    <el-button class="btn" @click="toggleShow" type="primary">设置头像</el-button>
    <my-upload field="img" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess"
               @crop-upload-fail="cropUploadFail"
               v-model="show" :width="300" :height="300"
               url="/api/user/avatar.do" :params="params" :headers="headers"
               img-format="png"></my-upload>
    <img :src="imgDataUrl">
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import 'babel-polyfill' // es6 shim
import myUpload from 'vue-image-crop-upload'
import { getToken } from '@/utils/auth'
export default {
  name: 'EditAvatar',
  components: {
    PanThumb,
    myUpload
  },
  data() {
    return {
      image: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
      show: false,
      params: {
        token: '123456798',
        name: 'avatar'
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      imgDataUrl: '' // the datebase64 url of created image
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

<style scoped>

</style>
