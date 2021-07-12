/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 17:40:17
 * @LastEditTime: 2021-07-11 22:12:36
 * @LastEditors: Please set LastEditors
 * @Description: 发起申请、修改申请
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Exit/edit.js
 */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Toast} from '@ant-design/react-native';
import {EXIT_DIRECTION} from '../../../util/constants';
import StuffLists from '../component/stuffLists';
const numberOfLines = 3;
let defaultData = {
  name: 'haah',
  norms: 'sda',
  num: 'ad',
  id: Math.random(),
};
let menuObj = {
  detail: '审批详情',
  edit: '退场审批-修改',
};
const EditExit = props => {
  console.log(props.navigation);
  const routeType = props.route.params.type;
  console.log(routeType);
  const [stuffLists, setstuffLists] = useState([defaultData]);
  const [majorName, setMajorName] = useState('选择去向'); // 显示名称
  const [majorValue, setMajorValue] = useState(0); // 选中value
  const [dateEnd, setDateEnd] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [timeMode, settimeMode] = useState('date');
  useEffect(() => {
    props.navigation.setOptions({
      title: menuObj[props.route.params.type],
    });
  }, []);
  // 添加材料
  const addStuff = () => {
    setstuffLists(state => {
      return [...state, defaultData];
    });
  };
  // 删除材料
  const delStuff = id => {
    console.log(id);
  };
  // 提交材料
  const submit = () => {};
  const onChangeBegin = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showMode = currentMode => {
    setShow(true);
    settimeMode(currentMode);
  };
  return (
    <View>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => {
            // Keyboard.dismiss();
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 编辑 */}
            {routeType === 'edit' ? (
              <View>
                <View>
                  {/* 材料列表 */}
                  {stuffLists.map(item => (
                    <View style={styles.stuff_items} key={item.id}>
                      <View style={styles.flex_row}>
                        <Text style={styles.stuff_item_title}>材料名称：</Text>
                        <View>
                          <TextInput
                            onChangeText={text => {
                              let newList = [...stuffLists];
                              newList.map(v => {
                                if (v.id === item.id) {
                                  v.name = text;
                                }
                              });
                              setstuffLists(newList);
                            }}
                            value={item.name}
                            style={styles.input_sty}
                            placeholder="请输入"
                          />
                        </View>
                      </View>
                      <View style={[styles.flex_row, {marginTop: 10}]}>
                        <Text style={styles.stuff_item_title}>规格：</Text>
                        <TextInput
                          style={styles.input_sty}
                          placeholder="请输入"
                        />
                        <Text
                          style={[styles.stuff_item_title, {marginLeft: 6}]}>
                          数量：
                        </Text>
                        <TextInput
                          style={styles.input_sty}
                          placeholder="请输入"
                        />
                      </View>
                    </View>
                  ))}
                </View>
                <View>
                  <View style={styles.other_item2}>
                    <Text style={styles.other_title}>退场时间：</Text>
                    {Platform.OS === 'android' && (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          showDatepicker();
                        }}>
                        <Text
                          style={{width: 200, color: '#999999', fontSize: 14}}>
                          {JSON.stringify(date).substring(1, 11)}
                        </Text>
                      </TouchableWithoutFeedback>
                    )}
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        timeMode={timeMode}
                        is24Hour={true}
                        display="default"
                        locale="zh-CN"
                        style={{width: 200}}
                        onChange={(event, selectedDate) =>
                          onChangeBegin(event, selectedDate)
                        }
                      />
                    )}
                  </View>
                  <View style={styles.other_item2}>
                    <Text style={styles.other_title}>退场去向：</Text>
                    {/* <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                /> */}
                    <View>
                      <ModalDropdown
                        defaultValue={majorName}
                        options={EXIT_DIRECTION}
                        renderButtonText={({name}) => name}
                        renderRow={({name}) => (
                          <Text style={styles.row_sty}>{name}</Text>
                        )}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownStyle}
                        dropdownTextStyle={styles.DropDownPickerText}
                        dropdownTextHighlightStyle={
                          styles.dropdownTextHighlightStyle
                        }
                        onSelect={(value, item) => {
                          setMajorValue(item.value);
                          setMajorName(item.name);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              // 详情
              <View>
                <StuffLists data={stuffLists} />
              </View>
            )}
            {/* 审批流程 */}
            <View style={styles.other_item2}>
              <Text style={styles.other_title}>审批流程：</Text>
              <Text style={styles.value}>
                审批流程：审批流程——审批流程：审批流程：审批流程：审批流程：审批流程：审批流程：审批流程：
              </Text>
            </View>
            <View style={styles.other_item3}>
              <Text style={styles.other_title}>审批意见：</Text>
              <TextInput
                style={{
                  backgroundColor: '#EEEEEE',
                  borderWidth: 0,
                  borderRadius: 5,
                  paddingLeft: 15,
                  textAlign: 'left',
                  textAlignVertical: 'top',
                  androidtextAlignVertical: 'top',
                  width: '80%',
                }}
                numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                minHeight={
                  Platform.OS === 'ios' && numberOfLines
                    ? 20 * numberOfLines
                    : null
                }
                placeholder="简介"
                multiline
                editable={false}
                // onChangeText={text => onChangeText(text)}
                // value={value}
                maxLength={20}
              />
            </View>
            {/* 提交 */}
            <View
              style={{
                padding: 30,
                marginBottom: 40,
                width: '100%',
              }}>
              <Button
                onPress={() => {
                  submit();
                }}
                type="primary">
                提交
              </Button>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditExit;

const styles = StyleSheet.create({
  add_area: {
    padding: 20,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  add_text: {
    color: '#108EE9',
    fontSize: 16,
    marginLeft: 10,
  },
  // 材料列表
  stuff_items: {
    display: 'flex',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  stuff_item_title: {
    fontSize: 14,
    marginRight: 6,
  },
  flex_row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_sty: {
    height: 38,
    borderRadius: 5,
    paddingLeft: 10,
    width: 136,
    borderWidth: 1,
    borderColor: '#999999',
  },
  del_btn: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
    marginRight: 20,
  },
  other_item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#fff',
  },
  value: {
    color: '#999',
    fontSize: 14,
  },
  other_item2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
  },
  other_item3: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  other_title: {
    fontSize: 14,
    marginRight: 4,
  },
  input_no_border: {
    color: '#666',
    fontSize: 14,
    flex: 1,
    paddingVertical: 18,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontWeight: '300',
  },
  // 下拉框样式
  dropdownText: {
    color: '#999999',
    fontSize: 14,
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
    color: '#666',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 16,
  },
  dropdownTextHighlightStyle: {
    color: 'red',
  },
});
