import { getToken, setToken, removeToken } from '@/utils/auth'
import Qs from 'qs'
import request from '@/utils/request'
import axios from 'axios'
import { Message } from 'element-ui'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    info: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        const data = {
          username: username,
          password: password,
          grant_type: 'password',
          scope: 'all',
          client_id: 'vue-admin',
          client_secret: 'secret',
          validatecode: userInfo.validateCode,
          imgToken: userInfo.imgToken
        }
        axios.post('/api/auth/oauth/token', data, {
          transformRequest: [function(data) {
            data = Qs.stringify(data)
            return data
          }],
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          // baseURL: process.env.BASE_API, // api的base_url
          timeout: 15000, // 请求超时时间
          withCredentials: true
        }).then(response => {
          const data = response.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          console.log('登录成功')
          console.log(data)
          resolve()
        }).catch(error => {
          const data = error.response.data
          console.log(data)
          Message.error(data.message)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request.get('/api/user/me').then(response => {
          const data = response.data
          if (data) {
            commit('SET_NAME', data.username)
            commit('SET_INFO', data)
          } else {
            reject('getInfo: info must not null')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
