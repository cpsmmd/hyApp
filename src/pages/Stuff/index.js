/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-06-26 21:48:45
 * @LastEditTime: 2021-06-27 15:41:47
 * @LastEditors: Please set LastEditors
 * @Description: 材料管理菜单页
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/index.js
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
const menuLists = [
  {
    url: require('../../assets/stuff/qingdan.png'),
    title: '材料清单1',
    route: 'detailList',
  },
  {
    url: require('../../assets/stuff/jinchang.png'),
    title: '进场管理',
    route: 'approach',
  },
  {
    url: require('../../assets/stuff/ruku.png'),
    title: '入库管理',
    route: 'account',
  },
  {
    url: require('../../assets/stuff/chuku.png'),
    title: '出库管理',
    route: 'account',
  },
  {
    url: require('../../assets/stuff/jinchang.png'),
    title: '退场管理',
    route: 'account',
  },
];
const index = props => {
  const jumpRoute = info => {
    props.navigation.push(info.route);
  };
  return (
    <View style={styles.menu_page}>
      <View>
        {menuLists.map(item => {
          return (
            <View key={item.title}>
              <TouchableWithoutFeedback
                onPress={() => {
                  jumpRoute(item);
                }}>
                <View style={styles.items}>
                  <Image source={item.url} style={styles.item_img} alt="" />
                  <Text style={{fontSize: 16, color: '#333333'}}>
                    {item.title}
                  </Text>
                  <Image
                    source={require('../../assets/right.png')}
                    style={{
                      width: 16,
                      height: 16,
                      tintColor: '#CCCCCC',
                      marginLeft: 'auto',
                      marginRight: 20,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  menu_page: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  items: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  item_img: {
    width: 30,
    height: 27,
    marginRight: 9,
  },
});
