/*
 * @Author: your name
 * @Date: 2021-04-20 21:51:20
 * @LastEditTime: 2021-05-27 14:30:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/ResetPw/index.js
 */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {Button, Toast} from '@ant-design/react-native';
import {SafeAreaView} from 'react-navigation';
import JSEncrypt from 'jsencrypt';
import {PUB_KEY} from '../../util/constants';
import {updatePwd} from '../../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = props => {
  const [idCard, setIdCard] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const editPwd = async () => {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUB_KEY);
    let parms = {
      idCard: global.userInfo.idCard,
      userPwd: encrypt.encrypt(userPwd),
      oldPwd: encrypt.encrypt(oldPwd),
      belongProject: global.userInfo.belongProject,
    };
    try {
      const res = await updatePwd(parms);
      if (res.data.code === 200) {
        // 清除缓存
        Toast.success('修改密码成功！');
        AsyncStorage.clear();
        global.userInfo = {};
        props.navigation.push('login');
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.log(error);
      Toast.fail('退出失败');
    }
  };
  return (
    <SafeAreaView forceInset={{top: 0, bottom: 0}}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={styles.login}>
            <View style={{marginBottom: 100}}>
              <Text style={{fontSize: 30}}>修改密码</Text>
            </View>
            <View style={{width: '100%'}}>
              <Text style={styles.login_title}>身份证</Text>
              <TextInput
                value={global.userInfo.idCard}
                style={styles.login_input}
                placeholder="请输入账号"
                editable={false}
              />
              <Text style={styles.login_title}>旧密码</Text>
              <TextInput
                value={oldPwd}
                onChangeText={text => setOldPwd(text)}
                style={styles.login_input}
                placeholder="请输入密码"
                secureTextEntry={true}
              />
              <Text style={styles.login_title}>新密码</Text>
              <TextInput
                value={userPwd}
                onChangeText={text => setUserPwd(text)}
                style={styles.login_input}
                placeholder="请输入密码"
                secureTextEntry={true}
              />
              <Button
                onPress={() => {
                  editPwd();
                }}
                style={{marginTop: 80}}
                type="primary">
                确认修改
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
