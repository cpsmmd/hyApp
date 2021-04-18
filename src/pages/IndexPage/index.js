import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import Button from '@ant-design/react-native/lib/button';

const IndexPage = () => {
  useEffect(() => {
    console.log('开始');
  });
  const Login = () => {
    console.log(11);
  };
  return (
    <View>
      <Text>首页1</Text>
      <Button
        onClick={() => {
          // Login();
          console.log('11111');
        }}>
        登录1
      </Button>
    </View>
  );
};

export default IndexPage;
