/*
 * @Author: your name
 * @Date: 2021-05-05 15:22:36
 * @LastEditTime: 2021-05-10 11:37:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/api/user.js
 */
import fetch from './axios';
// 登录
export const login = params =>
  fetch.post('/appapi/selectAppUserForLogin', params);
// 退出登录
export const loginOut = params =>
  fetch.post('/appapi/selectAppUserForLoginOut', params);
// 修改密码
export const updatePwd = params =>
  fetch.post('/appapi/updateAppUserLoginPwd', params);
// 考勤
export const checkWork = params =>
  fetch.post('/appapi/selectCheckInList', params);
// 工资表
export const selectWage = params =>
  fetch.post('/HySalary/selectHySalaryByParamApp', params);
// 通知记录
export const getNotice = params =>
  fetch.post('/HyNotify/selectHyNotify', params);
// 资料
export const getMaterials = params =>
  fetch.post('/HyFile/selectHyFileByParamApp', params);
// 通知
export const getNew = params =>
  fetch.post('/HyNotify/selectNotifyCount', params);
// 上传
export const upLoadFile = params =>
  fetch.post('/HyVisitors/uploadBatchApp', params);
// 通知
export const getLabel = params =>
  fetch.post('/HyLabel/selectLabelByParam', params);
// 添加资料
export const addFileLog = params =>
  fetch.post('/HyFile/insertHyFileApp', params);
// 修改资料
export const updateFileLog = params =>
  fetch.post('/HyFile/updateHyFileApp', params);
// 删除资料
export const delFileLog = params =>
  fetch.post('/HyFile/deleteHyFileApp', params);
// 查看资料
export const getSignleFileLog = params =>
  fetch.post('/HyFile/selectHyFileByFileIdApp', params);
// 文件下载
export const downFile = url => fetch.get(`/HyVisitors/downFileApp?path${url}`);
