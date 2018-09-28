import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// /////////////////////////////////////////
import request from './utils/request'
import { formatDate } from './utils/common-utils'

import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

Vue.config.productionTip = false
Vue.prototype.$request = request
// 全局日期过滤器
Vue.filter('dateFormat', function(value) {
  const date = new Date(value)
  return formatDate(date, 'yyyy-MM-dd hh:mm')
})

Vue.use(VCalendar, {
  firstDayOfWeek: 2
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
