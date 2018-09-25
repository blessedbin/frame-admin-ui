import axios from 'axios'

var Device = function() {
}

// 创建axios实例
const req = axios.create({
  baseURL: 'http://127.0.0.1:24010/ZKIDROnline', // api的base_url
  timeout: 15000 // 请求超时时间
})

function retMessage(ret) {
  var message = ''
  switch (ret) {
    case 1:
      message = '端口打开失败'
      break
    case 2:
      message = '数据传输超时'
      break
    case 4:
      message = '设备忙打开失败'
      break
    case 0:
      message = '成功'
      break
    case 10:
      message = '没有找到卡'
      break
    default:
      message = '其他错误'
      break
  }
  return message
}

export default function createISSOnlineDevice() {
  //  刷卡信息返回默认方法
  // 检查驱动安装默认方法
  // 初始化检查
  // TODO 错误处理
  req.get('/info').then(response => {
    console.log(response)
    var existVersion = response.data.data.server_version// 2.7.1
    Device.version = existVersion
  })
  Device.read = function(callback) {
    req.get('/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=0').then(response => {
      const data = JSON.parse(response.data.replace(new RegExp('\\\\', 'gm'), '/'))
      console.log(data)
      if (data.ret === 0) {
        callback(data.Certificate)
      } else {
        console.log(retMessage(data.ret))
        return null
      }
    })
  }
  Device.readRepeat = function() {
    req.get('/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1').then(response => {
      const data = JSON.parse(response.data.replace(new RegExp('\\\\', 'gm'), '/'))
      console.log(data)
      if (data.ret === 0) {
        return data.Certificate
      } else {
        console.log(retMessage(data.ret))
        return null
      }
    })
  }
  return Device
  //  /////////
}
