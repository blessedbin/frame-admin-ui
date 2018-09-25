<template>
  <div id="main-test-camera">
    <div/>
    <div>
      <el-button id="snap" @click="capture()">Snap Photo</el-button>
      <el-button @click="dynamicCapture">启动</el-button>
      <el-button @click="stop">停止</el-button>
    </div>
    <video ref="video" id="video" width="640" height="480" autoplay style="display: none;"/>
    <canvas ref="canvas" id="canvas" width="640" height="480" style="border:1px solid #c3c3c3;">
      您的浏览器不支持 HTML5 canvas 标签。
    </canvas>
    <ul>
      <li v-for="c in captures" :key="c">
        <img :src="c" height="480" width="640" >
      </li>
    </ul>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'CameraTest',
  components: {
  },
  data() {
    return {
      video: {},
      canvas: {},
      captures: [],
      started: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.connect()
  },
  beforeDestroy() {
    console.log('destoryed')
    this.disconnect()
    if (this.interval) {
      window.clearInterval(this.interval) // 关闭动态抓取
    }
    if (this.streamTrack) {
      this.streamTrack.stop() // 关闭摄像头
    }
  },
  methods: {
    dynamicCapture: function() {
      if (this.started) {
        return
      }
      const self = this
      this.canvas = this.$refs.canvas
      const context = this.canvas.getContext('2d')
      this.video = this.$refs.video
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.streamTrack = stream.getTracks()[0]
          this.video.src = window.URL.createObjectURL(stream)
          this.video.play()
        })
      }
      self.sendFlag = false // 标记是否已经发送
      this.interval = setInterval(function() {
        context.drawImage(self.video, 0, 0, 640, 480)
        var items = self.canvas.toDataURL('image/jpeg', 1)
        if (self.stompClient) {
          const data = { 'image': items }
          // self.stompClient.send('/app/receive2', {}, data)
          if (!self.sendFlag) {
            self.sendFlag = true
            self.$request.post('/api/face/face_tracking', data).then(response => {
              self.faceList = response.data
              self.sendFlag = false
            })
          }
        }
        if (self.faceList) {
          context.strokeStyle = '#ff0000' // 设置红色框线
          context.lineWidth = 5 // 设置线条宽度
          self.faceList.forEach(value => {
            context.strokeRect(value.left, value.top, value.width, value.height)
            // 写字
            context.font = '30px Arial'
            context.fillStyle = 'red'
            context.fillText(value.name, value.left, value.top - 5)
          })
          context.stroke()
        }
      }, 200)
      this.started = true
    },
    capture() {
      this.canvas = this.$refs.canvas
      const context = this.canvas.getContext('2d')
      context.drawImage(this.video, 0, 0, 640, 480)
      var items = this.canvas.toDataURL('image/jpeg', 1)
      if (this.stompClient) {
        const data = { 'image': items }
        this.stompClient.send('/app/receive2', {}, data)
      }
    },
    connect() {
      this.socket = new SockJS('http://localhost:8080/endpoint?access_token=' + getToken())
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.hasDebug = false
      this.stompClient.heartbeat.outgoing = 2000 // 心跳
      this.stompClient.heartbeat.incoming = 0
      this.stompClient.connect(
        {},
        frame => {
          this.$message.success('连接成功')
          this.connected = true
          console.log(frame)
          this.stompClient.subscribe('/user/' + this.name + '/faceInfo', function(response) {
            console.log('face info from websocket')
            const message = JSON.parse(response.body)
            console.log(message)
          })
          this.stompClient.subscribe('/user/' + this.name + '/face_pic', function(response) {
            console.log('face info from websocket')
            const message = JSON.parse(response.body)
            console.log(message)
          })
        },
        error => {
          this.$message.error('连接失败')
          console.log(error)
          this.connected = false
          // 重连
          // this.connect()
        }
      )
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
      this.connected = false
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect()
    },
    stop() {
      if (this.interval) {
        window.clearInterval(this.interval) // 关闭动态抓取
      }
      if (this.streamTrack) {
        this.streamTrack.stop() // 关闭摄像头
      }
      this.started = false
    }
  }
}
</script>

<style scoped>
  #main-test-camera {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  #video {
    background-color: #000000;
  }
  /*#canvas {*/
    /*display: none;*/
  /*}*/
  li {
    display: inline;
    padding: 5px;
  }
</style>
