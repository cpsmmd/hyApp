/*
 * @Author: your name
 * @Date: 2021-05-05 15:22:36
 * @LastEditTime: 2021-05-18 17:57:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/api/user.js
 */
import axios from 'axios';
import fetch from './axios';
let idCard = '';
if (global.userInfo && global.userInfo.idCard) {
  idCard = global.userInfo.idCard;
}
axios.defaults.headers.common['idCard'] = idCard;
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
  fetch.post('/appapi/selectCheckInList', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 按年查询
export const checkWorkYear = params =>
  fetch.post('/appapi/selectCheckinmonthByYear', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 工资表
export const selectWage = params =>
  fetch.post('/HySalary/selectHySalaryByParamApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 通知记录
export const getNotice = params =>
  fetch.post('/HyNotify/selectHyNotify', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 资料
export const getMaterials = params =>
  fetch.post('/HyFile/selectHyFileByParamApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 通知
export const getNew = params =>
  fetch.post('/HyNotify/selectNotifyCount', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 上传
export const upLoadFile = params =>
  fetch.post('/HyVisitors/uploadBatchApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 通知
export const getLabel = params =>
  fetch.post('/HyLabel/selectLabelByParam', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 添加资料
export const addFileLog = params =>
  fetch.post('/HyFile/insertHyFileApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 修改资料
export const updateFileLog = params =>
  fetch.post('/HyFile/updateHyFileApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 删除资料
export const delFileLog = params =>
  fetch.post('/HyFile/deleteHyFileApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 查看资料
export const getSignleFileLog = params =>
  fetch.post('/HyFile/selectHyFileByFileIdApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
    },
  });
// 文件下载
export const downFile = url => fetch.get(`/HyVisitors/downFileApp?path${url}`);
