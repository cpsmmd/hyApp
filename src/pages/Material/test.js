/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-08 11:18:46
 * @LastEditTime: 2021-05-09 21:18:18
 * @LastEditors: Please set LastEditors
 * @Description: 获取日志/资料列表页
 * @FilePath: /web/hy/hyApp/src/pages/Material/index.js
 */
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Platform, ScrollView} from 'react-native';
import {Button, Toast, Drawer} from '@ant-design/react-native';
import {getMaterials} from '../../api/user';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function Material(props) {
  const [logType, setSetLogType] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState(' date');
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState([]);
  const [drawer, setDrawer] = useState(null);
  useEffect(() => {
    (async () => {
      await getMaterialList();
    })();
  }, []);
  const getMaterialList = async () => {
    let parms = {
      logType: 1,
    };
    try {
      const res = await getMaterials(parms);
      if (res.data.code === 200) {
        // console.log('res', res.data.data);
        setLists(res.data.data);
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const logTypeChange = () => {};
  const DEMO_OPTIONS_2 = [
    {name: 'Rex', age: 30},
    {name: 'Mary', age: 25},
    {name: 'John', age: 41},
    {name: 'Jim', age: 22},
    {name: 'Susan', age: 52},
    {name: 'Brent', age: 33},
    {name: 'Alex', age: 16},
    {name: 'Ian', age: 20},
    {name: 'Phil', age: 24},
  ];
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
  const onOpenChange = isOpen => {
    console.log(isOpen);
  };
  const sidebar = (
    <ScrollView>
      <Text>dddd</Text>
    </ScrollView>
  );
  return (
    <>
      <Drawer
        sidebar={sidebar}
        position="left"
        open={false}
        drawerRef={el => setDrawer(el)}
        onOpenChange={isOpen => onOpenChange(isOpen)}
        drawerBackgroundColor="#ccc">
        <View>
          <Button
            onPress={() => {
              drawer && drawer.openDrawer();
            }}>
            Open drawer
          </Button>
        </View>
      </Drawer>
      <View style={styles.container}>
        {/* <RenderSearch></RenderSearch> */}
        <View style={{margin: 20}}>
          {/* <Button>点击筛选</Button> */}
          {/* <Drawer
          sidebar={sidebar}
          position="left"
          open={false}
          drawerRef={el => (this.drawer = el)}
          onOpenChange={isOpen => onOpenChange(isOpen)}
          drawerBackgroundColor="#ccc">
          <View>
            <Button
              onPress={() => {
                this.drawer && this.drawer.openDrawer();
              }}>
              Open drawer
            </Button>
          </View>
        </Drawer> */}
        </View>
        <ScrollView>
          <View>
            {lists.map(item => (
              <View style={styles.log_item} key={item.id}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={styles.item_title_color}>
                    名称：{item.logName}
                  </Text>
                  <Text style={{marginLeft: 10, marginLeft: 'auto'}}>
                    记录人：{item.logUser}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <Text style={{color: '#999', fontSize: 14}}>
                    日期：{item.createTime}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: 'auto',
                    }}>
                    <Text style={{color: '#1890ff', fontSize: 16}}>查看</Text>
                    {item.idCard === global.userInfo.idCard && (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#1890ff',
                          fontSize: 16,
                        }}>
                        编辑
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={{height: 160}}></View>
        </ScrollView>
      </View>
    </>
  );
  // function sidebar() {
  //   return (
  //     <ScrollView style={[styles.container]}>
  //       <Text>ddd</Text>
  //     </ScrollView>
  //   );
  // }
  function RenderSearch() {
    return (
      <View style={styles.search}>
        <View style={styles.type}>
          <Text>资料类型</Text>
          <ModalDropdown
            defaultValue={'选择日志类型'}
            options={DEMO_OPTIONS_2}
            renderButtonText={({name}) => name}
            renderRow={({name}) => <Text style={styles.row_sty}>{name}</Text>}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={styles.DropDownPickerText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
            onSelect={value => {
              console.log(value);
            }}
          />
          <Text>标签类型</Text>
          <ModalDropdown
            defaultValue={'选择日志类型'}
            options={DEMO_OPTIONS_2}
            renderButtonText={({name}) => name}
            renderRow={({name}) => <Text style={styles.row_sty}>{name}</Text>}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={styles.DropDownPickerText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
            onSelect={value => {
              console.log(value);
            }}
          />
        </View>
        <View>
          <Text>开始日期</Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              locale="zh-CN"
              onChange={onChange}
            />
          )}
        </View>
        <Button style={{width: 126}}>选择标签ID</Button>
        <View style={styles.laben_content}></View>
        <View style={{display: 'flex', flexDirection: 'row', padding: 10}}>
          <Button
            type="primary"
            onPress={() => {
              props.navigation.push('newMaterial');
            }}
            style={{width: 80}}>
            搜索
          </Button>
          <Button
            type="primary"
            style={{marginLeft: 'auto', width: 80}}
            onPress={() => {
              props.navigation.push('newMaterial');
            }}>
            新增
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  log_item: {
    display: 'flex',
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#bebebebe',
  },
  item_title_color: {
    color: '#333',
    fontSize: 16,
  },
  type: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dropdownText: {
    color: 'red',
  },
  dropdownStyle: {
    color: 'red',
    padding: 10,
  },
  DropDownPickerText: {
    color: 'red',
    padding: 10,
    fontSize: 20,
  },
  row_sty: {
    color: '#999',
    padding: 8,
  },
  dropdownTextHighlightStyle: {
    color: 'red',
  },
  laben_content: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cecece',
    borderRadius: 5,
  },
});
