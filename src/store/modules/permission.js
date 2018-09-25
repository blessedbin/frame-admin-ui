import { constantRouterMap } from '@/router/index'
import request from '@/utils/request'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
/*
function hasPermission(menus, route) {
  if (route.meta && route.meta.permissions) {
    return menus.some(m => route.meta.permissions.indexOf(m) >= 0)
  } else {
    return true
  }
}*/

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
/*
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}*/

/*
* 递归异步生成路由
* */
function generateRouter(data) {
  var accessedRouters = []
  if (data && data.length) {
    for (var i = 0; i < data.length; i++) {
      const r = data[i]
      var route = {
        path: r.path,
        name: r.name,
        hidden: r.hidden,
        alwaysShow: r.alwaysShow,
        component: (resolve) => require([`@/views/${r.component}`], resolve),
        meta: {
          title: r.title,
          icon: r.icon
        }
      }
      if (r.redirect) {
        route['redirect'] = r.redirect
      }
      if (r.children && r.children.length) {
        route['children'] = generateRouter(r.children)
      }
      accessedRouters.push(route)
    }
  }
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    menus: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    GenerateRoutes({ commit, state, getters, rootGetters }) {
      return new Promise((resolve, reject) => {
        request.get('/api/user/menus').then(response => {
          commit('SET_MENUS', response.data ? response.data : [])
          // const roles = rootGetters.roles
          // /////////////////
          const router = generateRouter(state.menus)
          // 增加404
          router.push({ path: '*', redirect: '/404', hidden: true })
          console.log('generateRouter.........')
          console.log(router)
          //  /////////////////////////
          commit('SET_ROUTERS', router)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
