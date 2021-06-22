/*
 * @Author: your name
 * @Date: 2021-05-05 17:49:45
 * @LastEditTime: 2021-06-01 14:00:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/util/common.js
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, Toast} from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const dealFail = (props, code, error) => {
  // 判断状态吗
  if (code === -1) {
    AsyncStorage.clear();
    props.navigation.push('login');
    global.userInfo = {};
    Toast.fail('登录失效，重新登录');
  }
};
