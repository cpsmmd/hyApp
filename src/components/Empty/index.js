/*
 * @Author: your name
 * @Date: 2021-05-08 23:00:56
 * @LastEditTime: 2021-05-11 18:17:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/components/Empty/index.js
 */
import {Flex} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

export default function Empty(props) {
  const {title} = props;
  return (
    <View style={styles.emty}>
      <Image
        style={{width: 200, height: 150, marginLeft: 20}}
        source={require('../../assets/empty.png')}
        resizeMode="contain"
      />
      <Text
        style={{
          color: '#666',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
        }}>
        {title || '暂无数据'}≧◔◡◔≦
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emty: {
    display: 'flex',
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
