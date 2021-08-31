/*
 * @Author: your name
 * @Date: 2021-07-11 15:57:34
 * @LastEditTime: 2021-08-11 00:11:19
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
            <View style={[styles.flex_row, {flex: 1}]}>
              <Text style={styles.title}>材料名称：</Text>
              <Text style={styles.value}>{item.materialsName}</Text>
            </View>
            <View style={[styles.flex_row, {flex: 1}]}>
              <Text style={styles.title}>规格：</Text>
              <Text style={styles.value}>{item.materialsSpecs}</Text>
            </View>
          </View>
          <View style={[styles.flex_row, {marginTop: 8}]}>
            <View style={[styles.flex_row, {flex: 1}]}>
              <Text style={styles.title}>供应商名称：</Text>
              <Text style={styles.value}>{item.supplierName}</Text>
            </View>
            <View style={[styles.flex_row, {flex: 1}]}>
              <Text style={styles.title}>数量：</Text>
              <Text style={styles.value}>{item.materialsNum}</Text>
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