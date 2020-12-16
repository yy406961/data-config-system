/*
 * @Author: your name
 * @Date: 2020-11-16 09:36:30
 * @LastEditTime: 2020-11-27 09:50:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
    activeMenu: '',
    historyMenu:[],
  },
  mutations,
  actions,
  getters,
  modules: {

  },
  plugins: [persistedState({
    paths: ['activeMenu', 'historyMenu']
  })]
})
