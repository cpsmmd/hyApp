/*
 * @Author: your name
 * @Date: 2021-07-11 15:57:34
 * @LastEditTime: 2021-07-11 16:55:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/component/stuffLists.js
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const StuffLists = props => {
  console.log(props);
  const {data} = props;
  return (
    <View>
      {data.map(item => (
        <View style={styles.items} key={item.id}>
          <View style={styles.flex_row}>
            <Text style={styles.title}>材料名称：</Text>
            <Text style={styles.value}>{item.name}</Text>
          </View>
          <View style={[styles.flex_row, {marginTop: 8}]}>
            <View style={[styles.flex_row, {flex: 1}]}>
              <Text style={styles.title}>规格：</Text>
              <Text style={styles.value}>{item.norms}</Text>
            </View>
            <View style={[styles.flex_row, {flex: 1}]}>
              <Text style={styles.title}>数量：</Text>
              <Text style={styles.value}>{item.num}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default StuffLists;

const styles = StyleSheet.create({
  items: {
    display: 'flex',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  flex_row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 14,
    marginRight: 6,
  },
  value: {
    color: '#999',
    fontSize: 14,
  },
});
