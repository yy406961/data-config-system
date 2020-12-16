/*
 * @Author: your name
 * @Date: 2020-11-26 09:54:23
 * @LastEditTime: 2020-11-27 09:32:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\router\task.js
 */

export default [
  {
    name: 'bigdata.taskManagement',
    path: '/bigdata/taskManagement',
    component: () => import('../views/task/taskManagement/index'),
    meta: {
      title: "任务管理",
      type: '任务管理'
    }
  },
  {
    name: 'bigdata.taskDetail',
    path: '/bigdata/taskDetail',
    component: () => import('../views/task/taskDetail/index'),
    meta: {
        title: "任务详情",
        type: '任务管理'
    }
  },
]