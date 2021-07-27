/* eslint-disable no-labels */
/*
 * @Author: your name
 * @Date: 2021-04-18 14:06:37
 * @LastEditTime: 2021-07-26 22:04:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/AppPage.js
 */
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import IndexPage from './pages/IndexPage';
import Login from './pages/Login';
import EditPw from './pages/ResetPw';
import Setting from './pages/Setting';
import Account from './pages/Account';
import Wage from './pages/Wage';
import Work from './pages/Work';
import Notice from './pages/Notice';
import Material from './pages/Material';
import NewMaterial from './pages/Material/NewMaterial';
import WatchMaterial from './pages/Material/WatchMaterial';
import EditMaterial from './pages/Material/EditMaterial';
// 二期
import stuffMenu from './pages/Stuff/index';
import DetailList from './pages/Stuff/DetailList/index';
import Approach from './pages/Stuff/Approach/index';
import Newapproach from './pages/Stuff/Approach/new';
import Editapproach from './pages/Stuff/Approach/edit';
import ExitList from './pages/Stuff/Exit/index.js';
import EditExit from './pages/Stuff/Exit/edit.js';
import InputList from './pages/Stuff/Input/index.js';
import OutputList from './pages/Stuff/OutPut/index.js';
import OutputEdit from './pages/Stuff/OutPut/edit.js';
import Privacy from './pages/Privacy';
import {Provider} from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

export default function AppPage(props) {
  let name = 'login';
  AsyncStorage.getItem('userInfo').then(res => {
    console.log(res === null);
    if (res === null) {
      name = 'home';
    }
  });
  const [defaultName, setDefaultName] = useState('home');
  useEffect(() => {
    (async () => {
      let info = await AsyncStorage.getItem('userInfo');
      if (JSON.stringify(info) === 'null') {
        setDefaultName('editPw');
      } else {
        setDefaultName('home');
      }
    })();
  }, []);
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          navigationOptions={{
            gestureEnabled: false,
          }}
          initialRouteName={defaultName}>
          <Stack.Screen
            name="home"
            component={IndexPage}
            options={{
              headerShown: false, // 隐藏header
              title: '首页',
              gestureEnabled: false,
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
              },
            }}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
            name="login"
            component={Login}
          />
          <Stack.Screen
            options={{
              title: '修改密码',
              gestureEnabled: false,
            }}
            name="editPw"
            component={EditPw}
          />
          <Stack.Screen
            options={{title: '设置'}}
            name="setting"
            component={Setting}
          />
          <Stack.Screen
            options={{title: '个人档案'}}
            name="account"
            component={Account}
          />
          <Stack.Screen
            options={{
              title: '考勤',
            }}
            name="work"
            component={Work}
          />
          <Stack.Screen
            options={{
              title: '工资表',
            }}
            name="wage"
            component={Wage}
          />
          <Stack.Screen
            options={{
              title: '通知',
            }}
            name="notice"
            component={Notice}
          />
          <Stack.Screen
            options={{
              title: '资料/日志',
            }}
            name="material"
            component={Material}
          />
          <Stack.Screen
            options={{
              title: '新增',
            }}
            name="newMaterial"
            component={NewMaterial}
          />
          <Stack.Screen
            options={{
              title: '查看',
            }}
            name="watchMaterial"
            component={WatchMaterial}
          />
          <Stack.Screen
            options={{
              title: '修改',
            }}
            name="editMaterial"
            component={EditMaterial}
          />
          <Stack.Screen
            options={{
              title: '隐私条款',
            }}
            name="privacy"
            component={Privacy}
          />
          {/* -----------------------二期 Approach------------------*/}
          <Stack.Screen
            options={{
              title: '材料管理',
            }}
            name="stuffMenu"
            component={stuffMenu}
          />
          <Stack.Screen
            options={{
              title: '材料清单',
            }}
            name="detailList"
            component={DetailList}
          />
          <Stack.Screen
            options={{
              title: '进场管理',
            }}
            name="approach"
            component={Approach}
          />
          <Stack.Screen
            options={{title: '发起申请'}}
            name="newapproach"
            component={Newapproach}
          />
          <Stack.Screen
            options={({route}) => ({title: route.params?.name || '修改申请'})}
            name="editapproach"
            component={Editapproach}
          />
          <Stack.Screen
            options={{title: '退场管理'}}
            name="exitList"
            component={ExitList}
          />
          <Stack.Screen
            options={({route}) => ({title: route.params?.name || '退场申请'})}
            name="editExit"
            component={EditExit}
          />
          <Stack.Screen
            options={{title: '入库管理'}}
            name="inputList"
            component={InputList}
          />
          <Stack.Screen
            options={{title: '出库管理'}}
            name="outputList"
            component={OutputList}
          />
          <Stack.Screen
            options={({route}) => ({title: route.params?.name})}
            name="outputEdit"
            component={OutputEdit}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
