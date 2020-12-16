/*
 * @Author: your name
 * @Date: 2020-10-24 09:43:49
 * @LastEditTime: 2020-12-08 10:08:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \case-manage\src\common\upload.js
 */
import axios from 'axios'
import router from "@/router";
import QS from 'qs'

let upload =axios.create({
    baseURL: '/api',
    // baseURL: 'http://rap2api.taobao.org/app/mock/268576/';
    timeout: 6000,
    withCredentials: true
})

upload.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'multipart/form-data';
    if (localStorage.getItem('token')) {
      config.headers.Authorization = localStorage.getItem('token');
    }
    return config;
}, error => {
    return Promise.reject(error);
})
upload.interceptors.response.use(res => {
    if (res.status === 200) {
        if (res.data.code === 100) {
            router.push({path:'/'});
        }else{
            return Promise.resolve(res.data);
        }
    } else
        return Promise.reject("网络错误")
}, error => {
    return Promise.reject(error);
})


export function uploadPost(url, params) {
    return new Promise((resolve, reject) => {
        upload.post(url, params).then(res => {
            resolve(res)
        }, error => {
            reject(error);
        }).catch((error) => {
            reject(error)
        })
    })
}