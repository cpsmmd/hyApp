/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Button from '@ant-design/react-native/lib/button';

const Login = props => {
  const loginAccount = () => {
    props.navigation.push('home');
  };
  const editPw = () => {
    props.navigation.push('editPw');
  };
  return (
    <View style={styles.login}>
      <View>
        <Text style={styles.login_title}>登录</Text>
      </View>
      <View style={{width: '100%'}}>
        {/* <Text style={styles.login_title}>身份证</Text> */}
        <TextInput style={styles.login_input} placeholder="请输入账号" />
        <TextInput style={styles.login_input} placeholder="请输入密码" />
        <TouchableWithoutFeedback
          onPress={() => {
            editPw();
          }}>
          <Text style={styles.forget}>忘记密码？</Text>
        </TouchableWithoutFeedback>
        <Button
          onPress={() => {
            loginAccount();
          }}
          style={{marginTop: 80}}
          type="primary">
          登录
        </Button>
      </View>
    </View>
  );
};

export default Login;
const styles = StyleSheet.create({
  login: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  login_title: {
    fontSize: 20,
    fontWeight: '500',
    paddingLeft: 20,
  },
  login_input: {
    height: 54,
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
    borderRadius: 30,
    marginTop: 17,
    paddingLeft: 30,
  },
  forget: {
    color: 'rgba(0,0,0,.55)',
    marginTop: 10,
    textAlign: 'right',
    fontSize: 14,
  },
});
