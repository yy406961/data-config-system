/*
 * @Author: your name
 * @Date: 2020-11-24 11:27:55
 * @LastEditTime: 2020-11-27 09:47:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "@/router/home"
import task from "@/router/task"
import config from "@/router/config"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index')
  },
  {
    path: '/bigdata',
    name: 'bigdata',
    component: () => import('../components/layout/index'),
    children: [
      ...home,
      ...task,
      ...config
    ]
  }
]

const router = new VueRouter({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  mode: 'hash',
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
