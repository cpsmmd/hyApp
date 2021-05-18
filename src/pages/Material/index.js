/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-08 11:18:46
 * @LastEditTime: 2021-05-18 13:28:14
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
import {IconOutline} from '@ant-design/icons-react-native';
import {Button, Toast, Drawer, Modal} from '@ant-design/react-native';
import {getMaterials, getLabel, delFileLog} from '../../api/user';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {LOG_TYPE, TYPELOG_OPTIONS} from '../../util/constants';
import Loading from '../../components/Loading';
import Empty from '../../components/Empty';
export default function Material(props) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [lists, setLists] = useState([]);
  // 开始时间
  // 结束时间
  const [dateEnd, setDateEnd] = useState(new Date());
  const [modeEnd, setModeEnd] = useState('date');
  const [showEnd, setShowEnd] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const [labelList, setLabelList] = useState([]);
  // 搜索
  const [logType, setLogType] = useState(1);
  const [logTypeText, setLogTypeText] = useState(LOG_TYPE[0].name);
  const [labelType, setLabelType] = useState(0);
  const [labelTypeText, setlabelTypeText] = useState('选择标签类型');
  const [loading, setLoading] = useState(true);
  const [tabs] = useState([
    {
      title: '施工日志',
      value: 1,
    },
    {
      title: '安全日志',
      value: 2,
    },
    {
      title: '其他资料',
      value: 3,
    },
  ]);
  const [curTab, setCurTab] = useState(1);
  useEffect(() => {
    (async () => {
      await getMaterialList(true);
      await getLabelList();
      drawer && drawer.openDrawer();
    })();
  }, []);
  useEffect(() => {
    const navFocusListener = props.navigation.addListener('focus', async () => {
      await getMaterialList(true, true);
    });

    return () => {
      navFocusListener.remove();
    };
  }, []);
  const getMaterialList = async (isTime = false, isNotLoading = false) => {
    if (!isNotLoading) {
      setLoading(true);
    }
    let parms = {
      logType: curTab,
    };
    // if (labelType !== 0) {
    //   parms.fileType = labelType;
    // }
    let labelIds = [];
    labelList.map(item => {
      if (item.isSelect) {
        labelIds.push(item.id);
      }
    });
    if (labelIds.length > 0) {
      parms.labelIds = labelIds;
    }
    if (date && !isTime) {
      parms.startTime = JSON.stringify(date).substring(1, 11);
    }
    if (dateEnd && !isTime) {
      parms.endTime = JSON.stringify(dateEnd).substring(1, 11);
    }
    console.log('getList-parms', parms);
    try {
      const res = await getMaterials(parms);
      if (res.data.code === 200) {
        // console.log('res', JSON.stringify(res.data.data));
        console.log('资料列表', res.data.data);
        setLists(res.data.data);
      } else {
        Toast.fail(res.data.message);
      }
      setLoading(false);
    } catch (error) {
      // setLoading(false);
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
  const onChangeBegin = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowEnd(Platform.OS === 'ios');
    setDateEnd(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  const showModeEnd = currentMode => {
    setShowEnd(true);
    setModeEnd(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showDatepickerEnd = () => {
    showModeEnd('date');
  };
  const showTimepicker = () => {
    showMode('time');
  };
  const onOpenChange = isOpen => {
    if (isOpen && Platform.OS === 'ios') {
      showMode('date');
      showModeEnd('date');
    }
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
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{backgroundColor: '#fff'}}>
                      {lists.map(item => (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            props.navigation.push('watchMaterial', {
                              id: item.id,
                              logType: item.logType,
                            });
                          }}>
                          <View style={styles.log_item} key={item.id}>
                            <View
                              style={{display: 'flex', flexDirection: 'row'}}>
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
                                    props.navigation.push('watchMaterial', {
                                      id: item.id,
                                      logType: item.logType,
                                    });
                                  }}>
                                  <Text
                                    style={{color: '#1890ff', fontSize: 16}}>
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
                                  <Text
                                    style={styles.default_label2}
                                    key={v.id}>
                                    {v.labelName}
                                  </Text>
                                ))}
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      ))}
                    </View>
                    <View style={{height: 160}} />
                  </ScrollView>
                ) : (
                  <Empty title="当前没有记录" />
                )}
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
          {/* <ModalDropdown
            defaultValue={logTypeText}
            options={LOG_TYPE}
            renderButtonText={({name}) => name}
            renderRow={({name}) => <Text style={styles.row_sty}>{name}</Text>}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={styles.DropDownPickerText}
            dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
            onSelect={(value, item) => {
              setLogTypeText(item.name);
              setLogType(item.value);
            }}
          />
          <IconOutline color="#409EFF" name="down" /> */}
        </View>
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
        <View style={(styles.type, {display: 'none'})}>
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
            }}
          />
          <IconOutline color="#409EFF" name="down" />
        </View>
        <View
          style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, marginRight: 10}}>开始日期：</Text>
          {Platform.OS === 'android' && (
            <TouchableWithoutFeedback
              onPress={() => {
                showDatepicker();
              }}>
              <Text style={{width: 200, color: '#409EFF', fontSize: 16}}>
                {JSON.stringify(date).substring(1, 11)}
              </Text>
            </TouchableWithoutFeedback>
          )}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
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
        <View
          style={{
            marginTop: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, marginRight: 10}}>结束日期：</Text>
          {Platform.OS === 'android' && (
            <TouchableWithoutFeedback
              onPress={() => {
                showDatepickerEnd();
              }}>
              <Text style={{width: 200, color: '#409EFF', fontSize: 16}}>
                {JSON.stringify(dateEnd).substring(1, 11)}
              </Text>
            </TouchableWithoutFeedback>
          )}
          {showEnd && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateEnd}
              mode={modeEnd}
              is24Hour={true}
              display="default"
              style={{width: 200}}
              locale="zh-CN"
              onChange={(event, selectedDate) =>
                onChangeEnd(event, selectedDate)
              }
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
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bebebe',
    borderRadius: 5,
    marginRight: 5,
    marginTop: 6,
    fontSize: 14,
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
});
