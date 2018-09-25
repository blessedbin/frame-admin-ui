<template>
  <div class="main-contain-holder">

    <pan-thumb :image="image"></pan-thumb>

    <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;"
               @click="show=true">Change avatar
    </el-button>

    <vue-core-image-upload
      class="btn btn-primary"
      :crop="false"
      text="上传"
      @imageuploaded="imageuploaded"
      :data="data"
      :max-file-size="5242880"
      url="http://101.198.151.190/api/upload.php" >
    </vue-core-image-upload>

  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import VueCoreImageUpload from 'vue-core-image-upload'
export default {
  name: 'EditAvatar',
  components: {
    PanThumb,
    'vue-core-image-upload': VueCoreImageUpload
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      show: false,
      image: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
      src: 'http://img1.vued.vanthink.cn/vued0a233185b6027244f9d43e653227439a.png',
      data: {}
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    },
    imageuploaded(res) {
      if (res.errcode === 0) {
        this.src = 'http://img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png'
      }
    }
  }
}
</script>

<style scoped>

</style>
