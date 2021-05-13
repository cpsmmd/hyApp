/*
 * @Author: your name
 * @Date: 2021-05-05 11:56:58
 * @LastEditTime: 2021-05-11 22:25:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Account/index.js
 */
import {Flex} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import {BSAE_IMAGE_URL} from '../../util/constants';
import {SafeAreaView} from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Account = () => {
  const users = global.userInfo;
  console.log(`${BSAE_IMAGE_URL}${users.cardBack}`);
  return (
    <ScrollView>
      <View style={styles.account}>
        <View style={styles.items}>
          <Text style={styles.item_title}>姓名：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>{users.userName}</Text>
          </View>
        </View>
        <View style={styles.items}>
          <Text style={styles.item_title}>性别：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>
              {users.sex === 0 ? '男' : '女'}
            </Text>
          </View>
        </View>
        <View style={styles.items}>
          <Text style={styles.item_title}>身份证号：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>{users.idCard}</Text>
          </View>
        </View>
        <View style={styles.items}>
          <Text style={styles.item_title}>手机号：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>{users.userMobile}</Text>
          </View>
        </View>
        <View style={styles.items}>
          <Text style={styles.item_title}>住址：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>
              {users.address || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.items}>
          <Text style={styles.item_title}>头像：</Text>
          <View style={styles.item_content}>
            <Image
              style={{width: 80, height: 80, marginTop: 2, marginLeft: 30}}
              // source={{
              //   uri: `${BSAE_IMAGE_URL}${users.icon}`,
              // }}
              source={require('../../assets/default_icon.png')}
              defaultSource={require('../../assets/default_icon.png')}
            />
          </View>
        </View>
        {/* 身份证照片： */}
        <View style={styles.items}>
          <Text style={styles.item_title}>身份证照片：</Text>
          <View style={styles.item_content}>
            <Image
              style={{height: 80, marginTop: 2}}
              // source={{
              //   uri: `${BSAE_IMAGE_URL}${users.cardFront}`,
              // }}
              source={require('../../assets/idCardEmpty.png')}
              resizeMode="contain"
              defaultSource={require('../../assets/idCardEmpty.png')}
            />
            <Image
              style={{height: 80, marginTop: 2}}
              resizeMode="contain"
              // source={{
              //   uri: `${BSAE_IMAGE_URL}${users.cardBack}`,
              // }}
              source={require('../../assets/idCardEmpty.png')}
              defaultSource={require('../../assets/idCardEmpty.png')}
            />
          </View>
        </View>
        {users.otherCard && (
          <View style={styles.items}>
            <Text style={styles.item_title}>其他证件照：</Text>
            <View style={styles.item_content}>
              <Image
                style={{height: 80, marginTop: 2}}
                source={{
                  uri: `${BSAE_IMAGE_URL}${users.otherCard}`,
                }}
                resizeMode="contain"
                defaultSource={require('../../assets/idCardEmpty.png')}
              />
            </View>
          </View>
        )}
        {/* 是否购买保险： */}
        <View style={styles.items}>
          <Text style={styles.item_title}>是否购买保险：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>
              {users.isHaveInsurance === 0 ? '否' : '是'}
            </Text>
          </View>
        </View>
        {/* 岗位： */}
        <View style={styles.items}>
          <Text style={styles.item_title}>岗位：</Text>
          <View style={styles.item_content}>
            <Text style={styles.item_content_color}>{users.jobName}</Text>
          </View>
        </View>
        {/* 薪资类型： */}
        {users.isAdmin === 0 && (
          <View style={styles.items}>
            <Text style={styles.item_title}>薪资类型：</Text>
            <View style={styles.item_content}>
              <Text style={styles.item_content_color}>
                {users.salaryType === 0 ? '日薪' : '月薪'}
              </Text>
            </View>
          </View>
        )}
        {users.isAdmin === 0 && (
          <View style={styles.items}>
            <Text style={styles.item_title}>雇佣期：</Text>
            <View style={styles.item_content}>
              <Text style={styles.item_content_color}>
                {users.hireStart || '-'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  account: {
    fontSize: 14,
    marginTop: 10,
  },
  items: {
    marginBottom: 5,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  item_title: {
    fontSize: 18,
    marginRight: 6,
  },
  item_content: {
    flex: 1,
    justifyContent: 'center',
  },
  item_content_color: {
    color: '#666',
    fontSize: 16,
  },
});
