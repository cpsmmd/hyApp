/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/**
 * @Author: cps
 * @Desc: 首页
 */
import React, {useEffect} from 'react';
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
import {Button, Toast} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
const {width} = Dimensions.get('window');
const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
const modeLIsts = [
  {
    url: require('../../assets/account.png'),
    title: '个人档案',
  },
  {
    url: require('../../assets/material.png'),
    title: '资料管理',
  },
  {
    url: require('../../assets/record.png'),
    title: '日志文档',
  },
  {
    url: require('../../assets/wage.png'),
    title: '工资表',
  },
  {
    url: require('../../assets/work.png'),
    title: '考勤',
  },
  {},
];
const IndexPage = props => {
  useEffect(() => {
    console.log('333');
    console.log('开始');
  });
  const Header = () => {
    return (
      <View>
        <Image
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            top: 20,
            right: 20,
          }}
          source={require('../../assets/remind.png')}
        />
        <View
          style={{
            display: 'flex',
            height: 250,
            width: '100%',
            justifyContent: 'center',
            marginTop: -30,
          }}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Image
              style={{width: 80, height: 80, marginTop: 2, marginLeft: 30}}
              source={require('../../assets/default_icon.png')}
            />
            <View style={{flex: 1, justifyContent: 'center', marginLeft: 20}}>
              <Text style={{width: 200, color: 'white', fontSize: 30}}>
                哈哈哈
              </Text>
              <Text style={styles.role}>哈哈哈</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView forceInset={{top: 0, bottom: 0}}>
      <ImageBackground
        style={{
          paddingBottom: 32,
          height: 250,
          width: deviceWidth,
          position: 'relative',
        }}
        source={require('../../assets/bg.png')}>
        <Header></Header>
      </ImageBackground>
      <View style={styles.main_content}>
        {modeLIsts.map(item => {
          return (
            <View style={styles.modele_item}>
              <Image source={item.url} style={{width: 70, height: 70}} alt="" />
              <Text
                style={{
                  color: '#222',
                  fontSize: 12,
                  lineHeight: 17,
                  marginTop: 10,
                }}>
                {item.title}
              </Text>
            </View>
          );
        })}
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
    borderColor: 'white',
    borderRadius: 50,
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
