/*
 * @Author: your name
 * @Date: 2021-05-05 12:02:28
 * @LastEditTime: 2021-06-01 13:40:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Wage/index.js
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, Toast} from '@ant-design/react-native';
import {selectWage} from '../../api/user';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import Empty from '../../components/Empty';
import {dealFail} from '../../util/common';
export default function Wage(props) {
  const [tableData, setTableData] = useState([]);
  const tableHead = [
    '日期',
    '姓名',
    '身份证号',
    '出勤天数',
    '日(月)工资',
    '工资金额',
    '加班(时)',
    '加班费',
    // '其它',
    '总合计',
    // '预支',
    '考勤扣款',
    '总余额',
  ];
  const widthArr = [100, 80, 90, 90, 80, 90, 100, 100, 100, 90, 100];
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
        let list = res.data.data || [];
        let newArr = [];
        list.map(item => {
          // item.firstAmTime = item.firstAmTime || '无';
          // item.firstPmTime = item.firstPmTime || '无';
          // item.lastAmTime = item.lastAmTime || '无';
          // item.lastPmTime = item.lastPmTime || '无';
          // let reason = reason || '无';
          let overHours = overHours || 0;
          let arrRow = [
            item.month,
            item.userName,
            item.idCard,
            item.workDays,
            item.salaryDaysOrMonth,
            item.salaryTotal,
            overHours,
            item.overHoursMoney,
            item.totalMoney.toFixed(2),
            item.loseMoney.toFixed(2),
            item.finalMoney.toFixed(2),
          ];
          newArr.push(arrRow);
        });
        setTableData(newArr);
      } else {
        dealFail(props, res.data.code, res.data.message);
        // Toast.fail(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      {tableData.length > 0 ? (
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
      ) : (
        <Empty></Empty>
      )}
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
