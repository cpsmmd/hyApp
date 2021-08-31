/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-06-26 21:48:45
 * @LastEditTime: 2021-08-30 13:57:22
 * @LastEditors: Please set LastEditors
 * @Description: 材料管理菜单页
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/index.js
 */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button} from '@ant-design/react-native';
import {getUserMenu} from '../../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
const list = [
  {
    url: require('../../assets/stuff/qingdan.png'),
    title: '材料清单',
    route: 'detailList',
  },
  {
    url: require('../../assets/stuff/jinchang.png'),
    title: '进场管理',
    route: 'approach',
  },
  {
    url: require('../../assets/stuff/jinchang.png'),
    title: '退场管理',
    route: 'exitList',
  },
  {
    url: require('../../assets/stuff/ruku.png'),
    title: '入库管理',
    route: 'inputList',
  },
  {
    url: require('../../assets/stuff/chuku.png'),
    title: '出库管理',
    route: 'outputList',
  },
];
const Stuff = props => {
  const jumpRoute = info => {
    props.navigation.push(info.route);
  };
  const [menuLists, setmenuLists] = useState(list);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    getMenus();
  }, []);
  const getMenus = async () => {
    try {
      const res = await getUserMenu();
      let mallMenus = res.data.data.menuList || [];
      let newList = [];
      let mLists =
        mallMenus.find(v => v.menuName === 'material-management')
          .childMenuList || [];
      if (mLists.length) {
        mLists.forEach(item => {
          let btns = item.buttonList.filter(v =>
            v.buttonTitle.includes('发起'),
          );
          let isShow = btns.length > 0;
          if (item.menuName === 'materialList') {
            list[0].isShow = isShow;
            newList.push(list[0]);
          }
          if (item.menuName === 'approachManagement') {
            list[1].isShow = isShow;
            newList.push(list[1]);
          }
          if (item.menuName === 'warehousingMangement') {
            list[3].isShow = isShow;
            newList.push(list[3]);
          }
          if (item.menuName === 'deliveryManagement') {
            list[4].isShow = isShow;
            newList.push(list[4]);
          }
          if (item.menuName === 'exitManagement') {
            list[2].isShow = isShow;
            newList.push(list[2]);
          }
        });
        setmenuLists(newList);
        await AsyncStorage.setItem('menuList', JSON.stringify(newList));
      }
    } catch (error) {
      console.error();
    }
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
      {/* <Button
        onPress={() => {
          // submit();
          setloading(true);
          setTimeout(() => {
            setloading(false);
          }, 2000);
        }}
        disabled={loading}
        type="primary">
        提交
      </Button> */}
    </View>
  );
};

export default Stuff;

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
