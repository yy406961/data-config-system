/*
 * @Author: your name
 * @Date: 2020-11-24 11:27:55
 * @LastEditTime: 2020-11-27 09:50:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\store\mutations.js
 */
export default {
  getActiveMenu(state, obj) {
    state.activeMenu = obj
  },
  getHistoryMenu(state, obj) {
    state.historyMenu = obj
  },
}