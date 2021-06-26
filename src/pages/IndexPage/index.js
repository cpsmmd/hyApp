/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/**
 * @Author: cps
 * @Desc: 首页
 */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import {Button, Toast, Badge} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
import {dealFail} from '../../util/test';
const {width} = Dimensions.get('window');
const {width: deviceWidth} = Dimensions.get('window');
import {BSAE_IMAGE_URL, BSAE_API} from '../../util/constants';
import Loading from '../../components/Loading';
import {getNew} from '../../api/user';
import MQTT from 'sp-react-native-mqtt';
const IndexPage = props => {
  const [userMsg, setUserMsg] = useState({});
  const [modeLIsts, setModeLIsts] = useState([]);
  const [newsNum, setNewsNum] = useState(0);
  const [loading, setLoading] = useState(true);
  // !要去掉注释
  useEffect(() => {
    const navFocusListener = props.navigation.addListener('focus', async () => {
      await getNews();
      if (JSON.stringify(global.userInfo) === '{}') {
        let info = await AsyncStorage.getItem('userInfo');
        if (JSON.stringify(info) === 'null') {
          goLogin();
        } else {
          global.userInfo = JSON.parse(info);
        }
        setUserMsg(global.userInfo);
      } else {
        setUserMsg(global.userInfo);
      }
      setLoading(false);
    });
    return () => {
      navFocusListener.remove();
    };
  }, []);
  useEffect(() => {
    (async () => {
      if (JSON.stringify(global.userInfo) === '{}') {
        let info = await AsyncStorage.getItem('userInfo');
        if (JSON.stringify(info) === 'null') {
          goLogin();
        } else {
          global.userInfo = JSON.parse(info);
        }
        setUserMsg(global.userInfo);
      } else {
        setUserMsg(global.userInfo);
      }
      // 员工岗才能查看消息
      getNews();
      const modeLIst =
        global.userInfo.isAdmin === 1
          ? [
              {
                url: require('../../assets/account.png'),
                title: '个人档案',
                route: 'account',
              },
              {
                url: require('../../assets/material.png'),
                title: '日志资料管理',
                route: 'material',
              },
              {
                url: require('../../assets/setting.jpg'),
                title: '设置',
                route: 'setting',
              },
            ]
          : [
              {
                url: require('../../assets/account.png'),
                title: '个人档案',
                route: 'account',
              },
              {
                url: require('../../assets/wage.png'),
                title: '工资表',
                route: 'wage',
              },
              {
                url: require('../../assets/work.png'),
                title: '考勤',
                route: 'work',
              },
              {
                url: require('../../assets/setting.jpg'),
                title: '设置',
                route: 'setting',
              },
            ];
      setModeLIsts(modeLIst);
      setLoading(false);
      dealMqtt();
    })();
  }, []);
  const getNews = async () => {
    if (global.userInfo.isAdmin === 1) {
      let parms = {
        idCard: global.userInfo.idCard,
      };
      try {
        const res = await getNew(parms);
        if (res.data.code === 200) {
          if (res.data.data.count !== 0) {
            setNewsNum(res.data.data.count);
            await AsyncStorage.setItem('newsCount', res.data.data.count + '');
          } else {
            await AsyncStorage.setItem('newsCount', res.data.data.count + '');
            let count = await AsyncStorage.getItem('newsCount');
            setNewsNum(count * 1);
          }
        } else {
          dealFail(props, res.data.code, res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const dealMqtt = () => {
    // mqtt://47.117.123.129:8900/warning/app/data
    // console.log('ready');
    MQTT.createClient({
      uri: 'mqtt://116.62.231.156:1883',
      clientId: 'mqttx_5afa9f86hhdjsdwefiwe22i',
      user: 'admin',
      pass: 'admin',
    })
      .then(function (client) {
        console.log('client', client);
        client.on('closed', function () {
          console.log('mqtt.event.closed');
        });

        client.on('error', function (msg) {
          console.log('mqtt.event.error', msg);
        });

        client.on('message', function (msg) {
          console.log('mqtt.event.message', msg);
        });

        client.on('connect', function () {
          console.log('cps2-----------connected');
          // client.subscribe('/warning/app/data', function (err) {
          //   if (!err) {
          //     console.log('cps3-----------connected');
          //     client.publish('/warning/app/data', 'Hello mqtt');
          //   }
          // });
          // client.subscribe('/data', 0);
          // client.publish('/data', 'test', 0, false);
        });

        client.connect();
        // client.publish('/warning/app/data', 'Hello mqtt');
      })
      .catch(function (err) {
        console.error('mqtt连接失败', err);
      });
  };
  const editRoute = info => {
    info.route && props.navigation.push(info.route);
  };
  const goLogin = () => {
    // props.navigation.push('login');
    Toast.info('请登录');
    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'login'}],
        }),
      );
    });
  };
  const Header = () => {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            height: 250,
            width: '100%',
            justifyContent: 'center',
            marginTop: Platform.OS === 'android' ? -30 : 0,
          }}>
          {global.userInfo.isAdmin === 1 ? (
            <View
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                marginRight: 20,
              }}>
              <TouchableWithoutFeedback
                onPress={async () => {
                  await AsyncStorage.setItem('newsCount', '0');
                  props.navigation.push('notice');
                }}>
                {newsNum > 0 ? (
                  <Badge text={newsNum}>
                    <View>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                        }}
                        source={require('../../assets/remind.png')}
                      />
                    </View>
                  </Badge>
                ) : (
                  <View>
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                      }}
                      source={require('../../assets/remind.png')}
                    />
                  </View>
                )}
              </TouchableWithoutFeedback>
            </View>
          ) : null}
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableWithoutFeedback>
              <Image
                style={{width: 80, height: 80, marginTop: 2, marginLeft: 30}}
                // source={{
                //   uri: `${BSAE_IMAGE_URL}${global.userInfo.icon}`,
                // }}
                source={require('../../assets/default_icon.png')}
                defaultSource={require('../../assets/default_icon.png')}
              />
            </TouchableWithoutFeedback>
            <View style={{flex: 1, justifyContent: 'center', marginLeft: 20}}>
              <Text style={{width: 200, color: 'white', fontSize: 30}}>
                {userMsg.userName}
              </Text>
              <Text style={styles.role}>
                {global.userInfo.isAdmin === 1 ? '管理岗' : '员工岗'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView forceInset={{top: 0, bottom: 0}}>
      <View>
        <ImageBackground
          style={{
            paddingBottom: 32,
            height: Platform.OS === 'android' ? 250 : 270,
            width: deviceWidth,
            position: 'relative',
          }}
          source={require('../../assets/bg.png')}>
          <Header></Header>
        </ImageBackground>
        <View style={styles.main_content}>
          {modeLIsts.map(item => {
            return (
              <View key={item.title} style={styles.modele_item}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    editRoute(item);
                  }}>
                  <View>
                    <Image
                      source={item.url}
                      style={{width: 70, height: 70}}
                      alt=""
                    />
                    <Text
                      style={{
                        color: '#222',
                        fontSize: 12,
                        lineHeight: 17,
                        marginTop: 10,
                        textAlign: 'center',
                      }}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IndexPage;
const styles = StyleSheet.create({
  role: {
    fontSize: 14,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: 14,
    width: 60,
    color: 'white',
    height: 26,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 6,
  },
  main_content: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: -50,
  },
  modele_item: {
    width: '33%',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
});
