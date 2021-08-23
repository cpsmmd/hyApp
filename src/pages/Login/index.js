/*
 * @Author: your name
 * @Date: 2021-04-18 15:41:45
 * @LastEditTime: 2021-08-22 15:15:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Login/index.js
 */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  BackHandler,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-navigation';
import {Button, Toast} from '@ant-design/react-native';
import JSEncrypt from 'jsencrypt';
import {PUB_KEY} from '../../util/constants';
import {login} from '../../api/user';
import MQTT from 'sp-react-native-mqtt';
const Login = props => {
  const [idCard, setIdCard] = useState('');
  const [userPwd, setUserPwd] = useState('');
  useEffect(() => {
    (async () => {
      let info = await AsyncStorage.getItem('userInfo');
      console.log('获取用户信息', info);
    })();
  }, []);
  const loginAccount = async () => {
    if (idCard.trim().length === 0) {
      return Toast.fail('请填写账号');
    }
    if (userPwd.trim().length === 0) {
      return Toast.fail('请填写密码');
    }
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUB_KEY);
    let encrypted = encrypt.encrypt(userPwd);
    let parms = {
      idCard,
      userPwd: encrypted,
    };
    try {
      const res = await login(parms);
      if (res.data.code === 200) {
        // 存个人数据
        global.userInfo = res.data.data;
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data));
        console.log('登录成功', res.data);
        props.navigation.push('home');
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      Toast.fail('登录失败，请检查账号密码');
    }
  };
  const editPw = () => {
    props.navigation.push('editPw');
  };
  return (
    <SafeAreaView forceInset={{top: 0, bottom: 0}}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={styles.login}>
            <View
              style={{display: 'flex', alignItems: 'center', marginTop: 50}}>
              <Image
                source={require('../../assets/logo.png')}
                style={{width: 120, height: 120, alignItems: 'center'}}
              />
              <Text style={{fontSize: 30, marginTop: 20, marginBottom: 20}}>
                宏远智慧工地管理系统
              </Text>
            </View>
            <View style={{width: '100%'}}>
              {/* <Text style={styles.login_title}>身份证</Text> */}
              <Text style={styles.login_title}>身份证</Text>
              <TextInput
                value={idCard}
                onChangeText={text => {
                  setIdCard(text);
                  // !测试阶段
                  setUserPwd(text.substring(text.length - 6));
                }}
                style={styles.login_input}
                placeholder="请输入账号"
              />
              <Text style={styles.login_title}>密码</Text>
              <TextInput
                value={userPwd}
                onChangeText={text => setUserPwd(text)}
                style={styles.login_input}
                placeholder="请输入密码"
                secureTextEntry={true}
              />
              {/* <TouchableWithoutFeedback
                onPress={() => {
                  editPw();
                }}>
                <Text style={styles.forget}>忘记密码？</Text>
              </TouchableWithoutFeedback> */}
              <Button
                onPress={() => {
                  loginAccount();
                }}
                style={{marginTop: 50}}
                type="primary">
                登录
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
    padding: 20,
    backgroundColor: 'white',
  },
  login_title: {
    fontSize: 20,
    fontWeight: '500',
    paddingLeft: 20,
    marginTop: 20,
  },
  login_input: {
    height: 54,
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
    borderRadius: 30,
    marginTop: 10,
    paddingLeft: 30,
  },
  forget: {
    color: 'rgba(0,0,0,.55)',
    marginTop: 10,
    textAlign: 'right',
    fontSize: 14,
    display: 'flex',
    width: 100,
    marginLeft: 'auto',
  },
});
