/*
 * @Author: your name
 * @Date: 2020-11-03 10:28:21
 * @LastEditTime: 2020-12-08 09:14:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \case-manage\src\common\axios.js
 */
import { Message } from 'element-ui'
import axios from 'axios'
import QS from 'qs'
import {showLoading, hideLoading} from '@/util/loading'

const service = axios.create({
    baseURL: '/keyBigDate',
    // baseURL: 'api',
    timeout: 8000,
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
        const data = res.data
        const status = res.status
        if (status === 200) {
          if (data.code === 200) {
            Message({
              message: data.msg,
              type: 'success'
            })
            hideLoading()
            resolve(data)
          } else {
            Message({
              message: data.msg,
              type: 'warning'
            })
            hideLoading()
            resolve(data)
          }
        } else {
          Message({
            message: data.msg,
            type: 'error'
          })
          hideLoading()
          reject(data)
        }
      })
      .catch(error => {
        hideLoading()
        reject(error)
      })
  })
}

export function fetchPost(url, params, config = {}) {
  return request('post', url, QS.stringify(params, {allowDots: true}), config)
}

export function fetchGet(url, params, config = {}) {
  return request('get', (url + '?' + QS.stringify(params)), params, config)
}

export function jsonPost(url, params, config = {}) {
  if (!config.headers) {
    config.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  }
  return request('post', url, JSON.stringify(params), config)
}
