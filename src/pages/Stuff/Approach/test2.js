/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-06-27 15:37:22
 * @LastEditTime: 2021-07-25 15:08:16
 * @LastEditors: Please set LastEditors
 * @Description: 进场管理
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Approach/index.js
 */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Button, Toast, Drawer, InputItem} from '@ant-design/react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {IconOutline} from '@ant-design/icons-react-native';
import Empty from '../../../components/Empty';
import {PASS_STATUS, MY_PASS, MAJOR} from '../../../util/constants';
import {dealFail} from '../../../util/common';
import {getApproachApply} from '../../../api/stuff';
const {height: deviceHeight} = Dimensions.get('window');
let userInfo = global.userInfo;
export default function Approach(props) {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, settableData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchParms, setsearchParms] = useState({
    name: '',
    standards: '',
    supplier: '',
  });
  // 搜索区域
  const [suppierName, setSuppierName] = useState('选择供应商'); // 显示名称
  const [suppierValue, setSuppierValue] = useState(0); // 选中value
  const [processName, setProcessName] = useState('选择流程'); // 显示名称
  const [processValue, setProcessValue] = useState(0); // 选中value
  const [majorName, setMajorName] = useState('选择专业'); // 显示名称
  const [majorValue, setMajorValue] = useState(0); // 选中value
  useEffect(() => {
    (async () => {
      await getLists();
    })();
  }, []);
  // useEffect(() => {
  //   const navFocusListener = props.navigation.addListener('focus', async () => {
  //     await getMaterialList(true, true);
  //   });

  //   return () => {
  //     navFocusListener.remove();
  //   };
  // }, []);
  // 获取数据
  const getLists = async () => {
    console.log(global.userInfo);
    let parms = {
      pageNumber: 1,
      limit: 10,
      idCard: global.userInfo.idCard,
    };
    console.log('分页查询进场申请/appapi/selectApplyByPagination', parms);
    try {
      const res = await getApproachApply(parms);
      console.log('result', res);
      if (res.data.code === 200) {
        // console.log('res', JSON.stringify(res.data.data));
        console.log('进场列表', res.data.data);
        // setLists(res.data.data);
        let list = res.data.data.list || [];
        settableData(list);
      } else {
        // Toast.fail(res.data.message);
        dealFail(props, res.data.code, res.data.message);
      }
      setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log(error);
    }
  };
  const loadMoreData = () => {
    console.log(11);
  };
  // 详情，修改，审批
  const navigationTo = type => {
    props.navigation.push('editapproach', {
      type,
    });
  };
  // const renderItem = ({item}) => <Item item={item} />;
  const RenderItem = ({item}) => {
    return (
      <View key={item.name} style={styles.list_item}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Text style={styles.list_item_name}>{item.theme}</Text>
          <View
            style={{display: 'flex', marginLeft: 'auto', flexDirection: 'row'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigationTo('detail');
              }}>
              <Text style={styles.detail_btn}>详情</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                navigationTo('edit');
              }}>
              <Text style={styles.edit_btn}>修改</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text style={styles.list_item_title}>
            申请人：
            <Text style={styles.list_item_text}>{item.userName}</Text>
          </Text>
          <Text>
            申请时间：
            <Text style={styles.list_item_text}>{item.approachTime}</Text>
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text>
            专业：
            <Text style={styles.list_item_text}>{item.professional}</Text>
          </Text>

          <Text>
            审批状态：
            <Text style={styles.list_item_text}>
              <RenderStatus status={item.state} />
            </Text>
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text>
            供应商：
            <Text style={styles.list_item_text}>{item.supplierName}</Text>
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{position: 'relative', width: '100%', height: '100%'}}>
      <ScrollView>
        <KeyboardAvoidingView>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View
              style={{
                position: 'relative',
                width: '100%',
                height: deviceHeight,
              }}>
              {drawer && (
                <View
                  style={{position: 'relative', width: '100%', height: '100%'}}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setDrawer(false);
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        zIndex: 9,
                      }}>
                      <TouchableWithoutFeedback
                        onPress={e => {
                          e.stopPropagation();
                          Keyboard.dismiss();
                        }}>
                        <View
                          style={{
                            width: '75%',
                            height: '100%',
                            backgroundColor: '#fff',
                            marginLeft: 'auto',
                          }}>
                          {/* 退出 */}
                          <TouchableWithoutFeedback
                            onPress={() => {
                              setDrawer(false);
                            }}>
                            <Text
                              style={{
                                position: 'absolute',
                                right: 20,
                                top: 20,
                                fontSize: 20,
                              }}>
                              X
                            </Text>
                          </TouchableWithoutFeedback>
                          <View style={{marginTop: 100, padding: 10}}>
                            <View style={styles.drawer_item}>
                              <Text style={styles.drawer_item_title}>
                                供应商：
                              </Text>
                              <TextInput
                                style={styles.drawer_item_input}
                                placeholder="请输入"
                                onChangeText={text => {
                                  setsearchParms(state => {
                                    return {
                                      ...state,
                                      name: text,
                                    };
                                  });
                                }}
                                value={searchParms.name}
                              />
                            </View>
                            <View style={styles.drawer_item}>
                              <Text style={styles.drawer_item_title}>
                                审批状态：
                              </Text>
                              <ModalDropdown
                                defaultValue={suppierName}
                                options={PASS_STATUS}
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
                                  setSuppierValue(item.value);
                                  setSuppierName(item.name);
                                }}
                              />
                              <IconOutline color="#999999" name="down" />
                            </View>
                            <View style={styles.drawer_item}>
                              <Text style={styles.drawer_item_title}>
                                我的流程：
                              </Text>
                              <ModalDropdown
                                defaultValue={processName}
                                options={MY_PASS}
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
                                  setProcessValue(item.value);
                                  setProcessName(item.name);
                                }}
                              />
                              <IconOutline color="#999999" name="down" />
                            </View>
                            <View style={styles.drawer_item}>
                              <Text style={styles.drawer_item_title}>
                                专业：
                              </Text>
                              <ModalDropdown
                                defaultValue={majorName}
                                options={MAJOR}
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
                              <IconOutline color="#999999" name="down" />
                            </View>
                            <View style={styles._operate}>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  setDrawer(false);
                                }}>
                                <View style={styles.search_modal_btn}>
                                  <Text
                                    style={{
                                      color: '#FFF',
                                      fontSize: 14,
                                      lineHeight: 17,
                                    }}>
                                    查询
                                  </Text>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setDrawer(true);
                  }}>
                  <View
                    style={{
                      backgroundColor: '#108EE9',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      height: 38,
                      width: 70,
                      marginRight: 30,
                    }}>
                    <Text style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                      筛选
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    props.navigation.push('newapproach');
                  }}>
                  <View
                    style={{
                      backgroundColor: '#108EE9',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      height: 38,
                      width: 80,
                    }}>
                    <Text style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                      发起申请
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {/* list */}
              {tableData.map(item => (
                <RenderItem key={item.id} item={item} />
              ))}
              <View style={{height: 300}}>
                <Text>加载更多</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
  function RenderStatus(value) {
    const {status} = value;
    let statuss = [
      {
        id: 1,
        color: '#F30000FF',
        value: '被驳回',
      },
      {
        id: 2,
        color: '#F30000FF',
        value: '被驳回',
      },
      {
        id: 3,
        color: '#F30000FF',
        value: '被驳回',
      },
      {
        id: 4,
        color: '#F30000FF',
        value: '被驳回',
      },
      {
        id: 5,
        color: '#F30000FF',
        value: '被驳回',
      },
    ];
    let info = statuss.find(item => item.id === status);
    return <Text style={{color: info.color}}>{info.value}</Text>;
  }
  function renderLoadMoreView() {
    return (
      <View style={styles.loadMore}>
        <ActivityIndicator
          style={styles.indicator}
          size={'large'}
          color={'red'}
          animating={true}
        />
        <Text style={{textAlign: 'center'}}>正在加载更多</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list_item: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  list_item_name: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
  list_item_title: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  list_item_text: {
    color: '#999999',
    fontSize: 13,
  },
  drawer_item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  drawer_item_title: {
    color: '#108EE9',
    fontSize: 14,
    fontWeight: '500',
    width: 70,
    textAlign: 'right',
    paddingRight: 4,
  },
  drawer_item_input: {
    height: 40,
    borderRadius: 5,
    paddingLeft: 15,
    width: 160,
    borderWidth: 1,
    borderColor: '#999999',
  },
  _operate: {
    marginTop: 50,
  },
  search_modal_btn: {
    backgroundColor: '#108EE9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    height: 38,
    width: 70,
    marginLeft: 70,
  },
  detail_btn: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#108EE9',
    width: 48,
    height: 26,
    lineHeight: 26,
    textAlign: 'center',
    borderRadius: 15,
    color: '#108EE9',
    marginRight: 10,
    marginTop: -2,
  },
  edit_btn: {
    fontSize: 12,
    backgroundColor: '#108EE9',
    width: 48,
    height: 26,
    lineHeight: 26,
    textAlign: 'center',
    borderRadius: 15,
    color: '#fff',
    marginRight: 10,
    marginTop: -2,
  },
  // 下拉框样式
  dropdownText: {
    color: '#999999',
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
});
