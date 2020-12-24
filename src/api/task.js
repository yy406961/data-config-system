/*
 * @Author: your name
 * @Date: 2020-12-08 08:59:11
 * @LastEditTime: 2020-12-16 09:30:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\api\task.js
 */
import { fetchGet, fetchPost } from '@/common/axios.js'
import { uploadPost } from '@/common/upload.js'
import { downloadPost } from '@/common/download.js'

/**
 * 任务管理 
 */

// --------------------------------------  任务管理 --------------------------------------
// 查询所有任务
export const taskInfoAll = params => fetchPost('/taskInfo/taskInfoAll', params)

// 新增任务
export const taskInfoAdd = params => fetchPost('/taskInfo/taskInfoAdd', params)

// 文件上传
export const fileUpload = params => uploadPost('/taskInfo/fileUpload', params)

// 任务暂停
export const taskPause = params => fetchPost('/taskInfo/taskPause', params)

// 任务关闭
export const taskShut = params => fetchPost('/taskInfo/taskShut', params)

// ------------------------------------------ 任务详情 ------------------------------------------
// 任务详情
export const taskDetails = params => fetchPost('/taskInfo/taskDetails', params)

// 新增预警
export const warnAdd = params => fetchPost('/warnInto/warnAdd', params)

// 修改预警信息
export const updateWarnTask = params => fetchPost('/warnInto/updateWarnTask', params)

// 获取所有重点人员名单
export const getKeyPersons = params => fetchPost('/warnInto/getKeyPersons', params)

// 获取所有服务单位
export const serviceUigt = params => fetchPost('/warnInto/serviceUigt', params)

// 获取所有重点区域
export const getKeyArea = params => fetchPost('/warnInto/getKeyArea', params)

// 添加预警人员
export const addKeyperson = params => fetchPost('/warnInto/addKeyperson', params)

// 添加预警区域
export const addWarnArea = params => fetchPost('/warnInto/addWarnArea', params)

// 按任务编号预警类型查看重点人
export const queryTaskNumKP = params => fetchPost('/warnInto/queryTaskNumKP', params)

// 按任务编号预警类型查看重点区域
export const queryTaskNumKA = params => fetchPost('/warnInto/queryTaskNumKA', params)

// 按任务编号预警类型查看预警消息
export const queryWarn = params => fetchPost('/warnInto/queryWarn', params)

// 任务详情凭证下载
export const downloadTask = params => downloadPost('/taskInfo/downloadTask', params)

// 根据任务编号预警类型重点人ID删除重点人
export const deleteTaskKP = params => fetchPost('/warnInto/deleteTaskKP', params)

// 根据任务编号预警类型重点区域编号删除重点区域
export const deleteTaskKeyArea = params => fetchPost('/warnInto/deleteTaskKeyArea', params)

// 获取湖南所有市的名称
export const hnCity = params => fetchGet('/warnInto/hnCity', params)
