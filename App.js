/*
 * @Author: your name
 * @Date: 2021-04-18 14:06:37
 * @LastEditTime: 2021-08-06 16:32:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/App.js
 */
import React from 'react';
import Global from './src/util/Global';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components';
import AppNavigator from './src/AppPage';
class App extends React.PureComponent {
  render() {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppNavigator />
      </ApplicationProvider>
    );
  }
}
export default App;
