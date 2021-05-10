/*
 * @Author: your name
 * @Date: 2021-05-05 12:02:28
 * @LastEditTime: 2021-05-09 08:37:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Wage/index.js
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, Toast} from '@ant-design/react-native';
import {selectWage} from '../../api/user';
import {Table, TableWrapper, Row} from 'react-native-table-component';

export default function Wage() {
  const tableHead = [
    '月份',
    '姓名',
    '身份证号',
    '出勤天数',
    '日(月)工资',
    '工资金额',
    '加班(时)',
    '加班费',
    '其它',
    '总合计',
    '预支',
    '抵扣',
    '总余额',
  ];
  const widthArr = [40, 60, 80, 100, 120, 140, 160, 180, 200, 40, 50, 50, 50];
  useEffect(() => {
    (async () => {
      await getWorks();
    })();
  }, []);
  const getWorks = async () => {
    let parms = {
      userName: global.userInfo.userName,
      idCard: global.userInfo.idCard,
      belongProject: global.userInfo.belongProject,
    };
    try {
      const res = await selectWage(parms);
      if (res.data.code === 200) {
        console.log('wage', res.data);
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const tableData = [];
  for (let i = 0; i < 30; i += 1) {
    const rowData = [];
    for (let j = 0; j < 9; j += 1) {
      rowData.push(`${i}${j}`);
    }
    tableData.push(rowData);
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  widthArr={widthArr}
                  style={[
                    styles.row,
                    index % 2 && {backgroundColor: '#F7F6E7'},
                  ]}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
