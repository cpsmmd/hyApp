/*
 * @Author: your name
 * @Date: 2021-05-06 13:37:26
 * @LastEditTime: 2021-07-26 20:38:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/util/constants.js
 */
// 服务端地址
export const BSAE_API = 'http://116.62.231.156:8900/';
export const BSAE_API2 = 'http://116.62.231.156/';
// 服务端地址
export const BSAE_IMAGE_URL = 'http://116.62.231.156:8900/image/';
// 管理岗登录后获取用户权限的接口
export const POWERS_URL = 'http://116.62.231.156:8599/';
// RSA加密公钥
export const PUB_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCISLP98M/56HexX/9FDM8iuIEQozy6kn2JMcbZS5/BhJ+U4PZIChJfggYlWnd8NWn4BYr2kxxyO8Qgvc8rpRZCkN0OSLqLgZGmNvoSlDw80UXq90ZsVHDTOHuSFHw8Bv//B4evUNJBB8g9tpVxr6P5EJ6FMoR/kY2dVFQCQM4+5QIDAQAB';
export const LOG_TYPE = [
  {name: '施工日志', value: 1},
  {name: '安全日志', value: 2},
  {name: '其他资料', value: 3},
];
export const TYPELOG_OPTIONS = [
  {name: '全部', value: 0},
  {name: '图纸', value: 1},
  {name: '技术资料', value: 2},
  {name: '事故报告', value: 3},
  {name: '产品资料', value: 4},
];
export const TYPELOG_OPTIONS2 = [
  {name: '图纸', value: 1},
  {name: '技术资料', value: 2},
  {name: '事故报告', value: 3},
  {name: '产品资料', value: 4},
];
export const PASS_STATUS = [
  {name: '审批中', value: 1},
  {name: '已审批', value: 2},
  {name: '被驳回', value: 3},
  {name: '已进场', value: 4},
  {name: '部分进场', value: 4},
  {name: '拒绝进场', value: 4},
];
export const MY_PASS = [
  {name: '我的申请', value: 1},
  {name: '待我审批', value: 2},
  {name: '经我审批', value: 3},
];
export const MAJOR = [
  {name: '我的申请', value: 1},
  {name: '待我审批', value: 2},
  {name: '经我审批', value: 3},
];
export const MAJOR_LIST = [
  '土建',
  '电气',
  '暖通空调',
  '给排水',
  '智能化',
  '装饰',
  '幕墙',
  '园林',
  '消防',
];
export const EXIT_DIRECTION = [
  {name: '供应商回收', value: 1},
  {name: '材料转场其他项目', value: 2},
  {name: '第三方回收', value: 3},
  {name: '移交甲方', value: 4},
];
