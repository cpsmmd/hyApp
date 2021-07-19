/*
 * @Author: your name
 * @Date: 2021-07-19 21:40:00
 * @LastEditTime: 2021-07-19 23:19:38
 * @LastEditors: Please set LastEditors
 * @Description: 进场管理接口
 * @FilePath: /web/hy/hyApp/src/api/stuff.js
 */
import axios from 'axios';
import fetch from './axios';
let idCard = '';
if (global.userInfo && global.userInfo.idCard) {
  idCard = global.userInfo.idCard;
}
axios.defaults.headers.common['idCard'] = idCard;
let defaultHeader = {
  dCard: global.userInfo.idCard,
  token: global.userInfo.token,
};
// 分页查询进场申请
export const getApproachApply = params =>
  fetch.post('/appapi/selectApplyByPagination', params, {
    headers: defaultHeader,
  });
// 进场申请接口
export const addApproachApply = params =>
  fetch.post('/appapi/insertApproachApply', params, {
    headers: defaultHeader,
  });
// 修改接口
export const editApproachApply = params =>
  fetch.post('/appapi/updateApply', params, {
    headers: defaultHeader,
  });
// 进场详情
export const approachApplyDetail = params =>
  fetch.post('/appapi/selectApplyById', params, {
    headers: defaultHeader,
  });
// 进场审批
export const updateToApproval = params =>
  fetch.post('/appapi/updateToApproval', params, {
    headers: defaultHeader,
  });
