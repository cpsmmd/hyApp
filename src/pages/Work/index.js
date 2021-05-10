/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-05 12:01:32
 * @LastEditTime: 2021-05-09 18:56:08
 * @LastEditors: Please set LastEditors
 * @Description: 考勤
 * @FilePath: /web/hy/hyApp/src/pages/Work/index.js
 */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {CalendarList} from 'react-native-common-date-picker';
import {Button, Toast} from '@ant-design/react-native';
import {checkWork} from '../../api/user';
import ModalDropdown from 'react-native-modal-dropdown';
import {Table, TableWrapper, Row} from 'react-native-table-component';
const Work = () => {
  const [startDate, setStartDate] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [dateType, setDateType] = useState('y');
  const [tabs, setTabs] = useState([
    {
      title: '按月查看',
      value: 'month',
    },
    {
      title: '按年查看',
      value: 'year',
    },
  ]);
  const [curTab, setCurTab] = useState('month');
  useEffect(() => {
    (async () => {
      // showMode('date');
      await getWorks();
    })();
  }, []);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const getWorks = async () => {
    let parms = {
      date: '',
      userNo: global.userInfo.userNo,
      belongProject: global.userInfo.belongProject,
    };
    try {
      const res = await checkWork(parms);
      if (res.data.code === 200) {
        console.log(res.data.data);
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const yearOption = [
    2020,
    2021,
    2022,
    2023,
    2024,
    2025,
    2026,
    2027,
    2028,
    2029,
    2030,
  ];
  const monthOption = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '11',
    '12',
  ];
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
  const tableData = [];
  for (let i = 0; i < 30; i += 1) {
    const rowData = [];
    for (let j = 0; j < 9; j += 1) {
      rowData.push(`${i}${j}`);
    }
    tableData.push(rowData);
  }
  return (
    <View style={{backgroundColor: '#fff'}}>
      <View style={styles.tabs}>
        {tabs.map(item => (
          <TouchableWithoutFeedback
            onPress={() => {
              setCurTab(item.value);
            }}>
            <View style={styles.tab_item}>
              <Text
                style={{
                  color:
                    curTab === item.value ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                {item.title}
              </Text>
              {curTab === item.value ? (
                <View style={styles.tab_active}></View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
      <View>
        {curTab === 'month' ? (
          <View
            style={{
              padding: 10,
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, color: '#666'}}>年份：</Text>
            <ModalDropdown
              defaultValue={'2021'}
              options={yearOption}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.DropDownPickerText}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              onSelect={selectedDate => {
                console.log(selectedDate);
              }}
            />
            <Text style={styles.dropdownText}> 年</Text>
            <Text style={{fontSize: 16, color: '#666', marginLeft: 30}}>
              月份：
            </Text>
            <ModalDropdown
              defaultValue={'1'}
              options={monthOption}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.DropDownPickerText}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              onSelect={selectedDate => {
                console.log(selectedDate);
              }}
            />
            <Text style={styles.dropdownText}> 月</Text>
          </View>
        ) : (
          <View
            style={{
              padding: 10,
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, color: '#666'}}>年份：</Text>
            <ModalDropdown
              defaultValue={'2021'}
              options={yearOption}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.DropDownPickerText}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              onSelect={selectedDate => {
                console.log(selectedDate);
              }}
            />
            <Text style={styles.dropdownText}> 年</Text>
          </View>
        )}
      </View>
      {/* {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          locale="zh-CN"
          onChange={onChange}
        />
      )} */}
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
};

export default Work;

const styles = StyleSheet.create({
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
  },
  tab_item: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  tab_active: {
    position: 'absolute',
    bottom: -20,
    width: 80,
    height: 2,
    backgroundColor: '#1890ff',
  },
  dropdownText: {
    fontSize: 20,
  },
  dropdownStyle: {
    padding: 10,
  },
  DropDownPickerText: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 20,
  },
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
