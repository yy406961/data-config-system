/*
 * @Author: your name
 * @Date: 2020-11-27 09:23:40
 * @LastEditTime: 2020-11-30 15:34:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\router\config.js
 */
export default [
  {
    name: 'bigdata.configManagement',
    path: '/bigdata/configManagement',
    component: () => import('../views/config/configManagement/index'),
    meta: {
      title: "配置管理",
      type: '配置管理'
    }
  },
  {
    name: 'bigdata.cdrConfig',
    path: '/bigdata/cdrConfig',
    component: () => import('../views/config/cdrConfig/index'),
    meta: {
      title: "关注人员CDR配置",
      type: '配置管理'
    }
  },
  {
    name: 'bigdata.areaConfig',
    path: '/bigdata/areaConfig',
    component: () => import('../views/config/areaConfig/index'),
    meta: {
      title: "区域配置",
      type: '配置管理'
    }
  },
]