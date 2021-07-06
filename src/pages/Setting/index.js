/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-05 10:39:14
 * @LastEditTime: 2021-07-05 14:31:31
 * @LastEditors: Please set LastEditors
 * @Description: 个人设置
 * @FilePath: hy/hyApp/src/pages/Setting/index.js
 */
import React from 'react';
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNC from 'react-native-css';
import {Button, Toast} from '@ant-design/react-native';
import {loginOut} from '../../api/user';
import {CommonActions} from '@react-navigation/native';
export default function Setting(props) {
  const loginOutBtn = async () => {
    let parms = {
      idCard: global.userInfo.idCard,
      belongProject: global.userInfo.belongProject,
    };
    console.log(parms);
    try {
      const res = await loginOut(parms);
      if (res.data.code === 200 || res.data.code === 500) {
        // 清除缓存
        AsyncStorage.clear();
        // props.navigation.push('login');
        global.userInfo = {};
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'login'}],
          }),
        );
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log('退出失败', error);
      Toast.fail(JSON.stringify(error));
    }
  };
  const editPw = () => {
    props.navigation.push('editPw');
  };
  return (
    <View style={{position: 'relative', width: '100%', height: '100%'}}>
      <View
        style={{
          paddingLeft: 20,
          paddingTop: 10,
          addingRight: 0,
          margin: 13,
          borderRadius: 10,
          backgroundColor: '#fff',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            editPw();
          }}>
          <View style={styles.listItem}>
            <View style={styles.listContentView}>
              <View>
                <Text style={styles.listTitleText}>密码</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.listExtraText}>修改密码</Text>
              <Image
                source={require('../../assets/right.png')}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: '#CCCCCC',
                  marginLeft: 10,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.push('privacy');
          }}>
          <View style={styles.listItem}>
            <View style={styles.listContentView}>
              <View>
                <Text style={styles.listTitleText}>用户隐私条款</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../assets/right.png')}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: '#CCCCCC',
                  marginLeft: 10,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.grayLine} />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          padding: 20,
          width: '100%',
        }}>
        <Button
          onPress={() => {
            loginOutBtn();
          }}
          type="primary">
          退出登录
        </Button>
      </View>
    </View>
  );
}
const styles = RNC`
    switchWrap {
      width: 51;
      height: 32;
      background-color: rgba(76,216,100,1);
      border-radius:20;
      padding-top: 2;
    }
    round {
      width:28;
      height:28;
      background-color: #fff;
      border-radius:20;
      border-width: 1;
      border-color: rgba(0,0,0,0.04);
    }
    listItem {
        height: 44;
        alignItems: center;
        flexDirection: row;
        justifyContent: space-between;
        marginVertical: 5;
        paddingRight: 10;
    }
    listContentView {
        flex: 1;
    }
    listTitleText {
        font-size: 18;
        color: #0A0B0C;
        font-weight:300;
        line-height: 22;
    }
    listContentText {
        font-size:12;
        font-weight:400;
        color:rgba(156,156,156,1);
        line-height:20;
    }
    listExtraText {
      font-size:15;
      font-weight:400;
      color:rgba(156,156,156,1);
      line-height:20;
    }
    grayLine{
        margin:4 0 4;
        height:1;
        background-color: #fff;
    }
`;
