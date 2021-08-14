/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-06-27 15:37:22
 * @LastEditTime: 2021-08-14 21:50:04
 * @LastEditors: Please set LastEditors
 * @Description: 进场管理
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Approach/index.js
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
} from 'react-native';
import Empty from '../../../components/Empty';
import Loading from '../../../components/Loading';
import {dealFail} from '../../../util/common';
import {getBillList} from '../../../api/stuff';
export default function StuffList(props) {
  let userInfo = global.userInfo;
  const limit = 10;
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, settableData] = useState([]);
  const [isAll, setIsAll] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  // 搜索区域
  const [supplierName, setSupplierName] = useState(''); // 供应商名称
  const [materialsSpecs, setMaterialsSpecs] = useState(''); // 规格
  const [materialsName, setMaterialsName] = useState(''); // 材料名称
  // 模糊搜索材料名称
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getLists(1);
    })();
  }, []);
  // 获取数据
  const getLists = async (num, status) => {
    let hasAll = status === 'all';
    let parms = {
      pageNumber: num,
      limit,
      materialsName: hasAll ? null : materialsName,
      supplierName: hasAll ? null : supplierName,
      materialsSpecs: hasAll ? null : materialsSpecs,
      idCard: global.userInfo.idCard,
    };
    console.log('材料清单parms', parms);
    try {
      const res = await getBillList(parms);
      if (res.data.code === 200) {
        console.log('材料清单', JSON.stringify(res.data));
        let list = res.data.data.list || [];
        setIsAll(true);
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
  const reset = () => {
    setSupplierName('');
    setMaterialsSpecs('');
    setMaterialsName('');
    setDrawer(false);
    settableData([]);
    setPageNumber(1);
    getLists(1, 'all');
  };
  const search = () => {
    setDrawer(false);
    settableData([]);
    setPageNumber(1);
    getLists(1);
  };
  const RenderItem = ({item}) => {
    return (
      <View key={item.name} style={styles.list_item}>
        <Text style={styles.list_item_name}>{item.materialsName}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text style={styles.list_item_title}>
            规格：
            <Text style={styles.list_item_text}>{item.materialsSpecs}</Text>
          </Text>
          <Text>
            出库数量：
            <Text style={styles.list_item_text}>{item.outboundNum}</Text>
          </Text>

          <Text>
            库存数量：
            <Text style={styles.list_item_text}>{item.inventoryNum}</Text>
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
            进场数量：
            <Text style={styles.list_item_text}>{item.approachNum}</Text>
          </Text>

          <Text>
            退场数量：
            <Text style={styles.list_item_text}>{item.exitNum}</Text>
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
                      <Text style={styles.drawer_item_title}>材料名称：</Text>
                      <TextInput
                        style={styles.drawer_item_input}
                        placeholder="请输入"
                        onChangeText={text => {
                          setMaterialsName(text);
                        }}
                        value={materialsName}
                      />
                    </View>
                    <View style={styles.drawer_item}>
                      <Text style={styles.drawer_item_title}>规格：</Text>
                      <TextInput
                        style={styles.drawer_item_input}
                        placeholder="请输入"
                        onChangeText={text => {
                          setMaterialsSpecs(text);
                        }}
                        value={materialsSpecs}
                      />
                    </View>
                    <View style={styles.drawer_item}>
                      <Text style={styles.drawer_item_title}>供应商：</Text>
                      <TextInput
                        style={styles.drawer_item_input}
                        placeholder="请输入"
                        onChangeText={text => {
                          setSupplierName(text);
                          // searcSupplierName(text.trim());
                        }}
                        value={supplierName}
                      />
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
                      <TouchableWithoutFeedback
                        onPress={() => {
                          reset();
                        }}>
                        <View style={styles.search_modal_btn_cancle}>
                          <Text
                            style={{
                              color: '#333',
                              fontSize: 14,
                              lineHeight: 17,
                            }}>
                            重置
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
            <Text style={{height: 40, lineHeight: 40}}>
              {' '}
              {tableData.length > 0 ? '已加载全部' : ''}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
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
  },
  drawer_item_input: {
    height: 40,
    borderRadius: 5,
    paddingLeft: 5,
    width: 170,
    borderWidth: 1,
    borderColor: '#999999',
  },
  _operate: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
  },
  search_modal_btn: {
    backgroundColor: '#108EE9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    height: 38,
    width: 70,
    marginLeft: 30,
  },
  search_modal_btn_cancle: {
    borderWidth: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d9d9d9',
    borderRadius: 6,
    height: 38,
    width: 70,
    marginLeft: 30,
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
