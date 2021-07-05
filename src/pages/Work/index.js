/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-05 12:01:32
 * @LastEditTime: 2021-07-05 13:47:24
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
import {checkWork, checkWorkYear} from '../../api/user';
import ModalDropdown from 'react-native-modal-dropdown';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import Empty from '../../components/Empty';
import Loading from '../../components/Loading';
import {dealFail} from '../../util/common';
const Work = props => {
  const [startDate, setStartDate] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabs] = useState([
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
  const [tableData, setTableData] = useState([]);
  const [tableDataY, setTableDataY] = useState([]);
  const [monthY, setMonthY] = useState(2021);
  const [monthM, setMonthM] = useState();
  useEffect(() => {
    (async () => {
      console.log(new Date().getFullYear());
      console.log(new Date().getMonth() + 1);
      let date1 = new Date();
      let M = date1.getMonth() + 1;
      M = M < 10 ? `0${M}` : `${M}`;
      let curDate = `${date1.getFullYear()}-${M}`;
      await getWorks(curDate);
    })();
  }, []);
  // 按月
  const getWorks = async date => {
    setLoading(true);
    let parms = {
      date,
      userNo: global.userInfo.userNo,
      belongProject: global.userInfo.belongProject,
    };
    try {
      const res = await checkWork(parms);
      if (res.data.code === 200) {
        let list = res.data.data.list || [];
        let newArr = [];
        list.map(item => {
          item.firstAmTime = item.firstAmTime || '无';
          item.firstPmTime = item.firstPmTime || '无';
          item.lastAmTime = item.lastAmTime || '无';
          item.lastPmTime = item.lastPmTime || '无';
          let isisEarly = item.isEarly === 0 ? '否' : '是';
          let isiisLate = item.isLate === 0 ? '否' : '是';
          let reason = reason || '无';
          let overHours = item.overHours || 0;
          // let timeWork = `上午(${item.firstAmTime} - ${item.firstPmTime}) 下午(${item.lastAmTime} - ${item.lastPmTime})`;
          let timeWork = `上午(${item.workStartAmTime} - ${item.workEndAmTime}) 下午(${item.workStartPmTime} - ${item.workEndPmTime})`;
          let daka1 = `${item.firstAmTime} - ${item.lastAmTime}`;
          let daka2 = `${item.firstPmTime} - ${item.lastPmTime}`;
          // let daka1 = `${item.firstAmTime} - ${item.workEndAmTime}`;
          // let daka2 = `${item.workStartPmTime} - ${item.workEndPmTime}`;
          item.overStartTime = item.overStartTime || '未打卡';
          item.overEndTime = item.overEndTime || '未打卡';
          let overTmes =
            overHours === 0
              ? '无'
              : `${item.overStartTime} ~ ${item.overEndTime}`;
          let arrRow = [
            item.createTime,
            item.userName,
            item.idCard,
            item.jobName,
            timeWork,
            daka1,
            daka2,
            isisEarly,
            isiisLate,
            reason,
            overHours,
            overTmes,
          ];
          newArr.push(arrRow);
        });
        setTableData(newArr);
      } else {
        // Toast.fail(res.data.message);
        dealFail(props, res.data.code, res.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // 按年
  const getWorksY = async date => {
    setLoading(true);
    let parms = {
      date,
      userNo: global.userInfo.userNo,
      belongProject: global.userInfo.belongProject,
    };
    try {
      const res = await checkWorkYear(parms);
      if (res.data.code === 200) {
        let list = res.data.data.list || [];
        console.log('work-page-按年查询', list);
        let newArr = [];
        list.map(item => {
          let overHours = item.overHours || 0;
          item.totalCount = item.totalCount || 0;
          let arrRow = [
            item.createTime,
            item.userName,
            item.idCard,
            item.jobName,
            item.earlyDays,
            item.lateDays,
            overHours,
            item.workDays,
          ];
          newArr.push(arrRow);
        });
        setTableData(newArr);
      } else {
        // Toast.fail(res.data.message);
        dealFail(props, res.data.code, res.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const yearOption = [
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
    '2031',
    '2032',
    '2033',
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
    '日期',
    '姓名',
    '身份证号',
    '岗位',
    '当日工作时间',
    '上午打卡时间',
    '下午打卡时间',
    '是否迟到',
    '是否早退',
    '迟到/早退原因',
    '加班时长',
    '加班打卡时间',
  ];
  const tableHeadY = [
    '日期',
    '姓名',
    '身份证号',
    '岗位',
    '早退天数',
    '迟到天数',
    '加班时长',
    '出勤天数',
  ];
  const widthArrY = [100, 70, 80, 100, 80, 80, 80, 100];
  const widthArr = [100, 70, 100, 100, 120, 102, 120, 80, 80, 120, 100, 120];
  return (
    <View style={{backgroundColor: '#fff', paddingBottom: 100}}>
      <View style={styles.tabs}>
        {tabs.map(item => (
          <TouchableWithoutFeedback
            onPress={() => {
              setCurTab(item.value);
              if (item.value === 'year') {
                getWorksY(new Date().getFullYear());
              } else {
                let date1 = new Date();
                let M = date1.getMonth() + 1;
                M = M < 10 ? `0${M}` : `${M}`;
                let curDate = `${date1.getFullYear()}-${M}`;
                getWorks(curDate);
              }
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
              defaultValue={`${new Date().getFullYear()}`}
              options={yearOption}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.DropDownPickerText}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              onSelect={selectedDate => {
                setMonthY(yearOption[selectedDate]);
              }}
            />
            <Text style={styles.dropdownText}> 年</Text>
            <Text style={{fontSize: 16, color: '#666', marginLeft: 30}}>
              月份：
            </Text>
            <ModalDropdown
              defaultValue={`${new Date().getMonth() + 1}`}
              options={monthOption}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.DropDownPickerText}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              onSelect={selectedDate => {
                console.log(selectedDate);
                setMonthM(monthOption[selectedDate]);
                let date1 = `${monthY}-${monthOption[selectedDate]}`;
                getWorks(date1);
              }}
            />
            <Text style={styles.dropdownText}>月</Text>
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
                // getWorks(yearOption[selectedDate]);
                getWorksY(yearOption[selectedDate]);
              }}
            />
            <Text style={styles.dropdownText}> 年</Text>
          </View>
        )}
      </View>
      {loading ? (
        <Loading style={{paddingBottom: 50}} />
      ) : (
        <>
          {tableData.length > 0 ? (
            <ScrollView horizontal={true}>
              {curTab === 'month' ? (
                <View style={{padding: 10}}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    <Row
                      data={tableHead}
                      widthArr={widthArr}
                      style={styles.header}
                      textStyle={styles.text}
                    />
                  </Table>
                  <ScrollView style={styles.dataWrapper}>
                    <Table
                      borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
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
              ) : (
                <View style={{padding: 10}}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    <Row
                      data={tableHeadY}
                      widthArr={widthArrY}
                      style={styles.header}
                      textStyle={styles.text}
                    />
                  </Table>
                  <ScrollView style={styles.dataWrapper}>
                    <Table
                      borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                      {tableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={widthArrY}
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
              )}
            </ScrollView>
          ) : (
            <Empty title="当前无考勤记录"></Empty>
          )}
        </>
      )}
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
