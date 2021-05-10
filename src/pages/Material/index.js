/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-08 11:18:46
 * @LastEditTime: 2021-05-10 13:33:04
 * @LastEditors: Please set LastEditors
 * @Description: 获取日志/资料列表页
 * @FilePath: /web/hy/hyApp/src/pages/Material/index.js
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
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import {Button, Toast, Drawer, Modal} from '@ant-design/react-native';
import {getMaterials, getLabel, delFileLog} from '../../api/user';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {LOG_TYPE, TYPELOG_OPTIONS} from '../../util/constants';
import Loading from '../../components/Loading';
export default function Material(props) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState(' date');
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [labelList, setLabelList] = useState([]);
  // 搜索
  const [logType, setLogType] = useState(1);
  const [logTypeText, setLogTypeText] = useState(LOG_TYPE[0].name);
  const [labelType, setLabelType] = useState(0);
  const [labelTypeText, setlabelTypeText] = useState('选择标签类型');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      await getMaterialList();
      await getLabelList();
    })();
  }, []);
  const getMaterialList = async () => {
    setLoading(true);
    let parms = {
      logType: logType,
    };
    try {
      const res = await getMaterials(parms);
      if (res.data.code === 200) {
        console.log('res', JSON.stringify(res.data.data));
        setLists(res.data.data);
      } else {
        Toast.fail(res.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const getLabelList = async () => {
    let parms = {};
    try {
      const res = await getLabel(parms);
      let newLists = res.data.data || [];
      newLists.map(item => {
        item.isSelect = false;
      });
      setLabelList(newLists);
    } catch (error) {
      console.error(error);
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
      <RenderSearch />
    </ScrollView>
  );
  const selectLabel = info => {
    let newList = [...labelList];
    newList.map(item => {
      if (item.id === info.id) {
        item.isSelect = !item.isSelect;
      }
    });
    setLabelList(newList);
  };
  return (
    <>
      <Drawer
        sidebar={sidebar}
        position="left"
        open={false}
        drawerRef={el => setDrawer(el)}
        onOpenChange={isOpen => onOpenChange(isOpen)}
        drawerBackgroundColor="#fff">
        <View>
          <View
            style={{
              padding: 10,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <Button
              type="primary"
              style={{width: 80}}
              onPress={() => {
                drawer && drawer.openDrawer();
              }}>
              筛选
            </Button>
            <Button
              type="primary"
              style={{width: 80, marginLeft: 'auto'}}
              onPress={() => {
                props.navigation.push('newMaterial');
              }}>
              新增
            </Button>
          </View>
          <View>
            {loading ? (
              <Loading style={{paddingBottom: 50}} />
            ) : (
              <>
                {lists && lists.length > 0 ? (
                  <ScrollView>
                    <View style={{backgroundColor: '#fff'}}>
                      {lists.map(item => (
                        <View style={styles.log_item} key={item.id}>
                          <View style={{display: 'flex', flexDirection: 'row'}}>
                            <Text style={styles.item_title_color}>
                              名称：{item.logName}
                            </Text>
                            <Text style={{marginLeft: 'auto'}}>
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
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  props.navigation.push('watchMaterial');
                                }}>
                                <Text style={{color: '#1890ff', fontSize: 16}}>
                                  查看
                                </Text>
                              </TouchableWithoutFeedback>
                              {item.idCard === global.userInfo.idCard && (
                                <View
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                  }}>
                                  <TouchableWithoutFeedback
                                    onPress={() => {
                                      props.navigation.push('editMaterial', {
                                        id: item.id,
                                        logType: item.logType,
                                      });
                                    }}>
                                    <Text
                                      style={{
                                        marginLeft: 10,
                                        color: '#1890ff',
                                        fontSize: 16,
                                      }}>
                                      编辑
                                    </Text>
                                  </TouchableWithoutFeedback>
                                  <TouchableWithoutFeedback
                                    onPress={() => {
                                      Modal.alert(
                                        '提示',
                                        '确认删除此条内容？',
                                        [
                                          {
                                            text: '取消',
                                            onPress: () =>
                                              console.log('cancel'),
                                            style: 'cancel',
                                          },
                                          {
                                            text: '确认',
                                            onPress: async () => {
                                              let parms = {
                                                id: item.id,
                                              };
                                              console.log(parms);
                                              try {
                                                const res = await delFileLog(
                                                  parms,
                                                );
                                                if (res.data.code === 200) {
                                                  getMaterials();
                                                  Toast.success('删除成功');
                                                }
                                              } catch (error) {
                                                getMaterials();
                                                console.error(error);
                                              }
                                            },
                                          },
                                        ],
                                      );
                                    }}>
                                    <Text
                                      style={{
                                        marginLeft: 10,
                                        color: 'red',
                                        fontSize: 16,
                                      }}>
                                      删除
                                    </Text>
                                  </TouchableWithoutFeedback>
                                </View>
                              )}
                            </View>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                            }}>
                            {item.labels.length > 0 &&
                              item.labels.map(v => (
                                <Text style={styles.default_label2} key={v.id}>
                                  {v.labelName}
                                </Text>
                              ))}
                          </View>
                        </View>
                      ))}
                    </View>
                    <View style={{height: 160}} />
                  </ScrollView>
                ) : null}
              </>
            )}
          </View>
        </View>
      </Drawer>
    </>
  );
  function RenderSearch() {
    return (
      <View style={{padding: 10, position: 'relative'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            drawer && drawer.closeDrawer();
          }}>
          <Text
            style={{position: 'absolute', right: 20, top: 20, fontSize: 20}}>
            X
          </Text>
        </TouchableWithoutFeedback>
        <View style={styles.type}>
          <Text style={{fontSize: 20, marginRight: 10}}>资料类型：</Text>
          <ModalDropdown
            defaultValue={logTypeText}
            options={LOG_TYPE}
            renderButtonText={({name}) => name}
            renderRow={({name}) => <Text style={styles.row_sty}>{name}</Text>}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={styles.DropDownPickerText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
            onSelect={(value, item) => {
              setLogType(item.value);
            }}
          />
          <IconOutline color="#409EFF" name="down" />
        </View>
        <View style={styles.type}>
          <Text style={{fontSize: 20, marginRight: 10}}>标签类型：</Text>
          <ModalDropdown
            defaultValue={labelTypeText}
            options={TYPELOG_OPTIONS}
            renderButtonText={({name}) => name}
            renderRow={({name}) => <Text style={styles.row_sty}>{name}</Text>}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={styles.DropDownPickerText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
            onSelect={(value, item) => {
              setlabelTypeText(item.name);
              setLabelType(item.value);
              console.log(item.value);
            }}
          />
          <IconOutline color="#409EFF" name="down" />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 20, marginRight: 10}}>开始日期：</Text>
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
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 20, marginRight: 10}}>结束日期：</Text>
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
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 20, marginRight: 10}}>标签ID：</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {labelList.map(item => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  selectLabel(item);
                }}>
                <Text
                  style={[
                    styles.default_label,
                    item.isSelect && styles.default_label_active,
                  ]}
                  key={item.id}>
                  {item.labelName}
                  {item.isSelect && 'x'}
                </Text>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', padding: 10}}>
          <Button
            type="primary"
            onPress={() => {
              getMaterialList();
              drawer && drawer.closeDrawer();
            }}>
            搜索
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // marginTop: 40,
    // display: 'none',
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
    marginTop: 20,
  },
  dropdownText: {
    color: '#409EFF',
    fontSize: 16,
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
  laben_content: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cecece',
    borderRadius: 5,
  },
  default_label: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bebebe',
    borderRadius: 5,
    marginRight: 5,
    marginTop: 6,
  },
  default_label_active: {
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  default_label2: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    borderRadius: 5,
    marginRight: 5,
    marginTop: 6,
  },
});
