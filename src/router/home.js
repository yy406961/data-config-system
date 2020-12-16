/*
 * @Author: your name
 * @Date: 2020-11-27 09:47:10
 * @LastEditTime: 2020-11-27 09:47:42
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\router\home.js
 */
export default [
  {
    name: 'bigdata.home',
    path: '/bigdata/home',
    component: () => import('../views/home/index'),
    meta: {
      title: "首页",
      type: '首页'
    }
  }
]