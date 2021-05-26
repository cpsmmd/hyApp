/*
 * @Author: your name
 * @Date: 2021-04-19 19:44:48
 * @LastEditTime: 2021-05-18 14:49:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/api/axios.js
 */
import axios from 'axios';
import {Toast} from '@ant-design/react-native';
import {Alert, Platform} from 'react-native';
let idCard = '';
if (global.userInfo && global.userInfo.idCard) {
  idCard = global.userInfo.idCard;
}
console.log('idCard', idCard);
axios.defaults.timeout = 100000;
axios.defaults.baseURL = 'http://116.62.231.156:8900';
// axios.defaults.headers.common['idCard'] = idCard;
export default axios;
