/* eslint-disable react-native/no-inline-styles */
/**
 * @Author: cps
 * @Desc: 首页
 */
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from 'react-native';
// import Button from '@ant-design/react-native/lib/button';

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
      <Text>首页1</Text>
      <TouchableWithoutFeedback
        onPress={() => {
          console.log(1);
          Login();
        }}>
        <Text style={{margin: 30, fontSize: 20}}>登录221</Text>
      </TouchableWithoutFeedback>
      <Button
        title="Press me"
        onPress={() => {
          console.log('111');
          Login();
        }}
      />
    </View>
  );
};

export default IndexPage;
