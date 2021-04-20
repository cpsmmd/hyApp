/* eslint-disable react-native/no-inline-styles */
/**
 * @Author: cps
 * @Desc: 首页
 */
import React, {useEffect} from 'react';
import {View, Text, TouchableWithoutFeedback, Alert} from 'react-native';
import {dealFail} from '../../util/test';
// import {
//   Provider,
//   Toast,
//   WhiteSpace,
//   WingBlank,
//   portal,
// } from '@ant-design/react-native';
import {Button, Toast} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';

const IndexPage = props => {
  useEffect(() => {
    console.log('333');
    console.log('开始');
  });
  const Login = () => {
    props.navigation.push('login');
  };
  return (
    <View>
      <Text>首页222</Text>
      <IconFill name="account-book" />
      <IconOutline name="account-book" />
      <TouchableWithoutFeedback
        onPress={() => {
          console.log(1);
          Toast.fail('Load failed !!!');
          // Login();
          // dealFail(props);
        }}>
        <Text style={{margin: 30, fontSize: 20}}>登录221</Text>
      </TouchableWithoutFeedback>
      <Button onPress={() => Toast.fail('This is a toast tips')}>Start</Button>
    </View>
  );
};

export default IndexPage;
