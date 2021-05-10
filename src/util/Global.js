/*
 * @Author: your name
 * @Date: 2021-05-07 15:31:13
 * @LastEditTime: 2021-05-08 00:00:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/util/Global.js
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
global.test = 3;
global.userInfo = {};
global.getUser = async () => {
  let info = await AsyncStorage.getItem('userInfo');
  return info;
};
