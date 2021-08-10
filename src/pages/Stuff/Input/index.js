/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 22:18:27
 * @LastEditTime: 2021-08-10 09:49:57
 * @LastEditors: Please set LastEditors
 * @Description: 入库管理
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Input/index.js
 */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {Toast} from '@ant-design/react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {IconOutline} from '@ant-design/icons-react-native';
import Empty from '../../../components/Empty';
import Loading from '../../../components/Loading';
import {INPUT_STATUS} from '../../../util/constants';
import {dealFail} from '../../../util/common';
import {getOInputApply, getSupplierByName} from '../../../api/stuff';
export default function Approach(props) {
  let userInfo = global.userInfo;
  const limit = 10;
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, settableData] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParms, setsearchParms] = useState({
    name: '',
    standards: '',
    supplier: '',
  });
  // 搜索区域
  const [stateName, setStateName] = useState('选择入库状态'); // 显示名称
  const [stateValue, setStateValue] = useState(0); // 选中value
  const [processName, setProcessName] = useState('选择流程'); // 显示名称
  const [processValue, setProcessValue] = useState(0); // 选中value
  const [professional, setProfessional] = useState('选择专业'); // 专业 显示名称

  const [supplierList, setSupplierList] = useState([]);
  const [supplierName, setSupplierName] = useState('');
  useEffect(() => {
    (async () => {
      setDrawer(false);
      settableData([]);
      setPageNumber(1);
      await getLists(1);
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
  // 获取数据
  const getLists = async num => {
    let parms = {
      pageNumber: num,
      limit,
      idCard: global.userInfo.idCard,
    };
    if (stateValue !== 0) {
      parms['state'] = stateValue;
    }
    if (supplierName !== '') {
      parms['supplierName'] = supplierName;
    }
    console.log('分页查询入库列表', parms);
    // setLoading(true);
    try {
      const res = await getOInputApply(parms);
      if (res.data.code === 200) {
        // console.log('res', JSON.stringify(res.data.data));
        console.log('入场列表', res.data.data);
        // setLists(res.data.data);
        let list = res.data.data.list || [];
        setIsAll(list.length < limit);
        settableData(state => {
          return [...state, ...list];
        });
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
  const loadMore = async () => {
    let num = pageNumber + 1;
    setPageNumber(num);
    getLists(num);
  };
  const search = () => {
    if (supplierList.length > 0) {
      return Toast.fail('请选择供应商');
    }
    console.log(professional);
    console.log(processValue);
    console.log(stateValue);
    setDrawer(false);
    settableData([]);
    setPageNumber(1);
    getLists(1);
  };
  // 详情，修改，审批
  const navigationTo = (type, id) => {
    props.navigation.push('editInput', {
      type,
      id,
    });
  };
  const searcSupplierName = async name => {
    try {
      const res = await getSupplierByName(name);
      let list = res.data.data || [];
      setSupplierList(list);
    } catch (error) {
      console.error(error);
    }
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
                navigationTo('detail', item.id);
              }}>
              <Text style={styles.detail_btn}>详情</Text>
            </TouchableWithoutFeedback>
            {item.isOperate && item.warehouseState === 7 && (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigationTo('approave', item.id);
                }}>
                <Text style={styles.edit_btn}>入库</Text>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text>
            申请时间：
            <Text style={styles.list_item_text}>{item.approachTime}</Text>
          </Text>
          <Text>
            申请人：
            <Text style={styles.list_item_text}>{item.userName}</Text>
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text style={styles.list_item_title}>
            供应商：
            <Text style={styles.list_item_text}>{item.supplierName}</Text>
          </Text>
          <Text>
            入库状态：
            <Text style={styles.list_item_text}>
              <RenderStatus status={item.warehouseState} />
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
            入库时间：
            <Text style={styles.list_item_text}>
              {item.warehouseTimes.map(v => (
                <Text style={{flex: 1, paddingLeft: 50}}>【{v}】</Text>
              ))}
            </Text>
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={{position: 'relative', width: '100%', height: '100%'}}>
      {drawer && (
        <View
          style={{position: 'absolute', width: '100%', height: '100%', top: 0}}>
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
                  {/* 关闭 */}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setDrawer(false);
                    }}>
                    <Image
                      style={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        width: 30,
                        height: 30,
                      }}
                      source={require('../../../assets/common/close.png')}
                    />
                  </TouchableWithoutFeedback>
                  <View style={{marginTop: 100, padding: 10}}>
                    <View style={styles.drawer_item}>
                      <Text style={styles.drawer_item_title}>供应商：</Text>
                      <TextInput
                        style={styles.drawer_item_input}
                        placeholder="请输入"
                        onChangeText={text => {
                          // searcSupplierName(text.trim());
                          setSupplierName(text);
                        }}
                        value={supplierName}
                      />
                    </View>
                    {supplierList.length > 0 ? (
                      <View
                        style={{
                          width: '100%',
                          zIndex: 999,
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginTop: 10,
                          marginBottom: 10,
                        }}>
                        {supplierList.map(v => (
                          <TouchableWithoutFeedback
                            key={v.id}
                            onPress={() => {
                              setSupplierName(v.supplierName);
                              setSupplierList([]);
                            }}>
                            <Text style={[styles.default_label]} key={v}>
                              {v.supplierName}
                            </Text>
                          </TouchableWithoutFeedback>
                        ))}
                      </View>
                    ) : null}
                    <View style={styles.drawer_item}>
                      <Text style={styles.drawer_item_title}>入库状态：</Text>
                      <ModalDropdown
                        defaultValue={stateName}
                        options={INPUT_STATUS}
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
                          setStateValue(item.value);
                          setStateName(item.name);
                        }}
                      />
                      <IconOutline color="#999999" name="down" />
                    </View>
                    <View style={styles._operate}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          search();
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
      <ScrollView>
        <View>
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
          </View>
        </View>
        {/* list */}
        <View>
          {loading ? (
            <Loading style={{paddingBottom: 50}} />
          ) : (
            <View>
              {tableData && tableData.length > 0 ? (
                <View>
                  {tableData.map(item => (
                    <RenderItem key={item.id} item={item} />
                  ))}
                </View>
              ) : (
                <Empty title="当前没有记录" />
              )}
            </View>
          )}
        </View>
        {!isAll ? (
          <View style={{display: 'flex', alignItems: 'center'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                loadMore();
              }}>
              <Text style={{height: 40, lineHeight: 40}}>点击加载更多</Text>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Text style={{height: 40, lineHeight: 40}}>已加载全部</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
  function RenderStatus(value) {
    const {status} = value;
    let statuss = [
      {id: 1, color: '#2b85e4', value: '审批中'},
      {id: 2, color: '#ed4014', value: '被驳回'},
      {id: 3, color: '#19be6b', value: '已审批'},
      {id: 4, color: '#19be6b', value: '已进场'},
      {id: 5, color: '#2db7f5', value: '部分进场'},
      {id: 6, color: '#ed4014', value: '拒绝进场'},
      {id: 7, color: '#ff9900', value: '未入库'},
      {id: 8, color: '#19be6b', value: '已入库'},
      {id: 9, color: '#ed4014', value: '拒绝入库'},
      {id: 10, color: '#2db7f5', value: '部分入库'},
      {id: 11, color: '#ff9900', value: '待库管确认'},
      {id: 12, color: '#ff9900', value: '待申请人确认'},
      {id: 13, color: '#ed4014', value: '已终止'},
      {id: 14, color: '#2b85e4', value: '出库中'},
      {id: 15, color: '#19be6b', value: '已出库'},
      {id: 16, color: '#2b85e4', value: '归还中'},
      {id: 17, color: '#19be6b', value: '归还完成'},
      {id: 18, color: '#ff9900', value: '待退场'},
      {id: 19, color: '#19be6b', value: '已退场'},
    ];
    let info = statuss.find(item => item.id === status);
    return <Text style={{color: info.color}}>{info.value}</Text>;
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
    color: '#666',
    padding: 10,
  },
  DropDownPickerText: {
    color: '#666',
    padding: 10,
    fontSize: 16,
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
  default_label: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
    borderRadius: 5,
    marginRight: 5,
    marginTop: 6,
    fontSize: 14,
  },
});
