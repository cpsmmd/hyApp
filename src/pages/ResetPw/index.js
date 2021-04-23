/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Button from '@ant-design/react-native/lib/button';

const Login = props => {
  const loginAccount = () => {
    props.navigation.push('login');
  };
  return (
    <View style={styles.login}>
      <View style={{marginBottom: 100}}>
        <Text style={{fontSize: 30}}>修改密码</Text>
      </View>
      <View style={{width: '100%'}}>
        <Text style={styles.login_title}>身份证</Text>
        <TextInput style={styles.login_input} placeholder="请输入账号" />
        <Text style={styles.login_title}>新密码</Text>
        <TextInput style={styles.login_input} placeholder="请输入密码" />
        <Text style={styles.login_title}>新密码</Text>
        <TextInput style={styles.login_input} placeholder="请输入密码" />
        <Button
          onPress={() => {
            loginAccount();
          }}
          style={{marginTop: 80}}
          type="primary">
          确认修改
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
    height: 50,
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
    borderRadius: 30,
    marginBottom: 20,
    marginTop: 6,
    paddingLeft: 30,
  },
  forget: {
    color: 'rgba(0,0,0,.55)',
    marginTop: 10,
    textAlign: 'right',
    fontSize: 14,
  },
});
