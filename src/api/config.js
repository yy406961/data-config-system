/*
 * @Author: your name
 * @Date: 2020-12-08 08:59:11
 * @LastEditTime: 2020-12-16 09:52:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\api\config.js
 */
import { fetchGet, fetchPost } from '@/common/axios.js'
import { download, downloadPost } from '@/common/download.js'
import { uploadPost } from '@/common/upload.js'

/**
 * 配置管理 
 */

// --------------------------------------  关注人员CDR配置 --------------------------------------
// 查询所有重点人
export const pageAll = params => fetchPost('/keyPerson/pageAll', params)

// 新增重点人
export const addKeyPerson = params => fetchPost('/keyPerson/addKeyPerson', params)

// 重点人上控操作
export const keyPersonControl = params => fetchPost('/keyPerson/keyPersonControl', params)

// 一键上控
export const keyPersonAllControl = params => fetchPost('/keyPerson/keyPersonAllControl', params)

// 重点人模板下载
export const downloadExcelTemplate  = params => downloadPost('/keyPerson/downloadExcelTemplate', params)

// 重点人批量上传
export const bacthAddkeyPerson  = params => uploadPost('/keyPerson/bacthAddkeyPerson', params)

// 数据导出excel
export const exportExcel  = params => downloadPost('/keyPerson/exportExcel', params)

// 下控
export const keyPersonUnlock = params => fetchPost('/keyPerson/keyPersonUnlock', params)

// 重点人员信息修改
export const keyPersonUpdate = params => fetchPost('/keyPerson/keyPersonUpdate', params)

// 获取所有重点人类型
export const getKeyPersonType = params => fetchPost('/warnInto/getKeyPersonType', params)

// ---------------------------------------  区域配置 -------------------------------------------------
// 查询重点区域
export const keyAreasAll = params => fetchPost('/keyAreas/keyAreasAll', params)

// 根据区域编号查询区域基站
export const keyAreaUli = params => fetchPost('/keyAreas/keyAreaUli', params)

// 新增重点区域
export const keyAreasAdd = params => fetchPost('/keyAreas/keyAreasAdd', params)

// 修改重点区域
export const keyAreasUpdate = params => fetchPost('/keyAreas/keyAreasUpdate', params)

// 基站数据
export const uliList = params => fetchPost('/keyAreas/uliList', params)

// 删除重点区域
export const keyAreasDelete = params => fetchPost('/keyAreas/keyAreasDelete', params)

// 根据区域导出区域基站
export const keyAreaUliExport  = params => downloadPost('/keyAreas/keyAreaUliExport', params)