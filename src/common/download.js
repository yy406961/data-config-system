/*
 * @Author: your name
 * @Date: 2020-10-19 09:28:24
 * @LastEditTime: 2020-12-08 09:32:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \case-manage\src\axios\index.js
 */
import { Message } from 'element-ui'
import axios from 'axios'
import QS from 'qs'
import router from "@/router";
import { showLoading, hideLoading } from '@/util/loading'

const service = axios.create({
  baseURL: '/api',
  responseType: 'blob',
  // baseURL: 'http://rap2api.taobao.org/app/mock/268576/',
  timeout: 3000,
  withCredentials: true
})

/**
 * 通用request封装
 * @param method
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */
const request = (method, url, data, config = {}) => {
  const options = Object.assign({}, config, {
      url,
      method,
      data
  })
  showLoading()
  options.headers = options.headers || {}
  return new Promise((resolve, reject) => {
      service
          .request(options)
          .then(res => {
            if (res.status === 200) {
              if (res.data.code === 100) {
                // 超时 重新登录
                Message({
                  message: res.data.message,
                  type: 'error'
                })
                hideLoading()
                router.push({path:'/'});
              }else{
                hideLoading()
                resolve(res.data)
              }
            } else {
              hideLoading()
              resolve(res.data)
            }
          })
          .catch(error => {
            hideLoading()
            resolve(error)
          })
  })
}

export function download(url, params, config = {}) {
  return request('get', (url + '?' + QS.stringify(params)), params, config)
}
