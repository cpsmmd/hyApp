import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import IndexPage from './pages/IndexPage';
import Login from './pages/Login';

const Stack = createStackNavigator();

export default function AppPage() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="首页">
        <Stack.Screen
          name="home"
          component={IndexPage}
          options={{
            headerShown: false, // 隐藏header
            title: 'My home',
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
        <Stack.Screen name="login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
