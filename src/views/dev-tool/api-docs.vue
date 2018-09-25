<template>
  <div class="main-contain-holder ifa" id="main-contain-holder" style="height: 100%">
    <iframe id="show-iframe" frameborder="0" name="showHere" scrolling="auto" :src="url" height="100%"/>
  </div>

</template>

<script>
// import { getToken } from '@/utils/auth'
export default {
  name: 'ApiDocs',
  data() {
    return {
      url: 'http://localhost:8080/swagger-ui.html'
    }
  },
  mounted() {
    const oIframe = document.getElementById('show-iframe')
    const deviceWidth = document.getElementById('main-contain-holder').parentNode.clientWidth - 40
    const deviceHeight = document.documentElement.clientHeight
    oIframe.style.width = deviceWidth + 'px'
    oIframe.style.height = deviceHeight + 'px'
  }
}
</script>

<style scoped>
.ifa {
  width: 100%;
  height: 100%;
}
</style>
