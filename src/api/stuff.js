/*
 * @Author: your name
 * @Date: 2021-07-19 21:40:00
 * @LastEditTime: 2021-08-22 15:25:51
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
  idCard: global.userInfo.idCard,
  token: global.userInfo.token,
};
// 材料名称查询
export const getMaterialsByName = name => {
  return fetch.get(
    `/appapi/selectMaterialsByName?name=${name}`,
    // {},
    {
      headers: {
        idCard: global.userInfo.idCard,
        token: global.userInfo.token,
      },
    },
  );
};
// 供应商名称查询（用于检索）
export const getSupplierByName = name => {
  return fetch.get(
    `/appapi/selectSupplierByName?name=${name}`,
    // {},
    {
      headers: {
        idCard: global.userInfo.idCard,
        token: global.userInfo.token,
      },
    },
  );
};
// 获取专业列表
export const getProfessions = () => {
  return fetch.get(
    '/hyProfessional/selectProfessionalApp',
    // {},
    {
      headers: {
        idCard: global.userInfo.idCard,
        token: global.userInfo.token,
      },
    },
  );
};
// --------------------------------材料清单--------------------------------
export const getBillList = params =>
  fetch.post('/appapi/selectBillByPagination', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 查询材料清单（用于检索）
export const getBillList2 = params =>
  fetch.post('/appapi/selectBillByParam', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// --------------------------------进场管理--------------------------------
// 分页查询进场申请
export const getApproachApply = params =>
  fetch.post('/appapi/selectApplyByPagination', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 进场申请接口
export const addApproachApply = params =>
  fetch.post('/appapi/insertApproachApply', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 修改接口
export const editApproachApply = params =>
  fetch.post('/appapi/updateApply', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 进场详情
export const approachApplyDetail = id =>
  fetch.get(`/appapi/selectApplyById?id=${id}`, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 进场审批
export const updateToApproval = params =>
  fetch.post('/appapi/updateToApproval', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// --------------------------------退场申请--------------------------------
// 分页查询退场申请
export const getExitApply = params =>
  fetch.post('/hyExitApply/selectExitApplyByPaginationApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 退场申请详情
export const getExitDetail = id =>
  fetch.get(`/hyExitApply/selectApplyById?id=${id}`, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 进场申请接口
export const addExitApply = params =>
  fetch.post('/hyExitApply/insertExitApplyApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 修改退场申请
export const editExitApply = params =>
  fetch.post('/hyExitApply/updateExitApplyApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 退场审核
export const approaveExitApply = params =>
  fetch.post('/hyExitApply/updateToApprovalApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 退场库管员确认
export const confirmExitApply = params =>
  fetch.post('/hyExitApply/insertReviewingApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// --------------------------------出库管理--------------------------------
// 分页查询出库申请
export const getOutputApply = params =>
  fetch.post('/hyOutboundApply/selectOutboundApplyByPaginationApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 添加出库申请
export const addOutputApply = params =>
  fetch.post('/hyOutboundApply/insertOutboundApplyApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 出库审核
export const approaveOutputApply = params =>
  fetch.post('/hyOutboundApply/updateToApprovalApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 修改出库申请
export const updateOutputApply = params =>
  fetch.post('/hyOutboundApply/updateOutboundApplyApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 出库申请详情
export const reardOutputApply = id =>
  fetch.get(`/hyOutboundApply/selectApplyByIdApp?id=${id}`, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 出库申请人复核
export const reviewOutputApply = params =>
  fetch.post('/hyOutboundApply/insertReviewingApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 出库归还提交
export const returnOutputApply = params =>
  fetch.post('/hyOutboundApply/insertReturnApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 出库归还确认
export const returnConfirmOutputApply = params =>
  fetch.post('/hyOutboundApply/insertReturnConfirmApp', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// --------------------------------入库管理--------------------------------
// 分页查询入库申请
export const getOInputApply = params =>
  fetch.post('/appapi/selectWarehouseApplyByPagination', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 入库详情
export const getInputDetail = id =>
  fetch.get(`/appapi/selectWarehouseApplyById?id=${id}`, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
// 入库接口
export const updateInputApply = params =>
  fetch.post('/appapi/updateWarehouse', params, {
    headers: {
      idCard: global.userInfo.idCard,
      token: global.userInfo.token,
    },
  });
