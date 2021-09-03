/*
 * @Author: your name
 * @Date: 2021-05-06 13:37:26
 * @LastEditTime: 2021-08-22 13:34:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/util/constants.js
 */
// 服务端地址
export const BSAE_API = 'http://47.117.123.129:8900/';
export const BSAE_API2 = 'http://47.117.123.129/';
// 服务端地址
export const BSAE_IMAGE_URL = 'http://47.117.123.129:8900/image/';
// 管理岗登录后获取用户权限的接口
export const POWERS_URL = 'http://47.117.123.129:8599/';
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
  {name: '已审批', value: 3},
  {name: '被驳回', value: 2},
  {name: '已进场', value: 4},
  {name: '部分进场', value: 5},
  {name: '拒绝进场', value: 6},
];
export const PASS_STATUS_OUTPUT = [
  {name: '审批中', value: 1},
  {name: '被驳回', value: 2},
  {name: '待库管确认', value: 11},
  {name: '出库中', value: 14},
  {name: '已出库', value: 15},
  {name: '申请人确认', value: 12},
  {name: '已终止', value: 13},
  {name: '归还中', value: 16},
  {name: '归还完成', value: 17},
];
export const EXIT_STATUS = [
  {name: '审批中', value: 1},
  {name: '已审批', value: 3},
  {name: '被驳回', value: 2},
  {name: '已进场', value: 4},
];
export const INPUT_STATUS = [
  {name: '已入库', value: 8},
  {name: '已拒绝', value: 9},
  {name: '未入库', value: 7},
  {name: '部分入库', value: 10},
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
  '供应商回收',
  '材料转场其他项目',
  '第三方回收',
  '移交甲方',
  '其他',
];
