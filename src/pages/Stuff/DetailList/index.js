/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-06-26 22:42:34
 * @LastEditTime: 2021-06-27 18:17:55
 * @LastEditors: Please set LastEditors
 * @Description: 材料清单
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/DetailList/index.js
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
  ActivityIndicator,
} from 'react-native';
import {Button, Toast, Drawer, InputItem} from '@ant-design/react-native';
import Empty from '../../../components/Empty';
export default function Index() {
  const [drawer, setDrawer] = useState(false);
  const [tableData, settableData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchParms, setsearchParms] = useState({
    name: '',
    standards: '',
    supplier: '',
  });
  const DATA = [
    {
      name: '四大皆空返回2',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回1',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回21',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回12',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回26',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回14',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回72',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
    {
      name: '四大皆空返回d1',
      guige: '闪电发货',
      chu: 2324,
      ku: 899,
      jin: 3845,
      tui: 4534,
      gong: '肯德基反馈',
    },
  ];
  const loadMoreData = () => {
    console.log(11);
  };
  // const renderItem = ({item}) => <Item item={item} />;
  const RenderItem = ({item}) => {
    return (
      <View key={item.name} style={styles.list_item}>
        <Text style={styles.list_item_name}>{item.name}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
          }}>
          <Text style={styles.list_item_title}>
            规格：
            <Text style={styles.list_item_text}>{item.guige}</Text>
          </Text>
          <Text>
            出库数量：
            <Text style={styles.list_item_text}>{item.chu}</Text>
          </Text>

          <Text>
            库存数量：
            <Text style={styles.list_item_text}>{item.ku}</Text>
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
            <Text style={styles.list_item_text}>{item.jin}</Text>
          </Text>

          <Text>
            退场数量：
            <Text style={styles.list_item_text}>{item.tui}</Text>
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
            <Text style={styles.list_item_text}>{item.gong}</Text>
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
            <View style={{position: 'relative', width: '100%', height: '100%'}}>
              {drawer && <RenderSearch />}
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setDrawer(true);
                  }}>
                  <View
                    style={{
                      backgroundColor: '#108EE9',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      height: 38,
                      width: 70,
                      marginTop: 10,
                    }}>
                    <Text style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                      筛选
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {/* list */}
              <View style={{display: 'flex', flex: 1}}>
                {DATA.map(item => (
                  <RenderItem item={item} />
                ))}
                {/* <FlatList
                  style={{flex: 1}}
                  data={DATA}
                  renderItem={renderItem}
                  keyExtractor={item => item.name}
                  ListEmptyComponent={Empty}
                  //设置下拉刷新样式
                  // refreshControl={
                  //   <RefreshControl
                  //     title={'Loading'} //android中设置无效
                  //     colors={['red']} //android
                  //     tintColor={'red'} //ios
                  //     titleColor={'red'}
                  //     refreshing={isLoading}
                  //     onRefresh={() => {
                  //       // this.loadData();
                  //     }}
                  //   />
                  // }
                  //设置上拉加载
                  // ListFooterComponent={() => renderLoadMoreView()}
                  // onEndReached={() => loadMoreData()}
                /> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
  function RenderSearch() {
    return (
      <View style={{position: 'relative', width: '100%', height: '100%'}}>
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
                    <Text style={styles.drawer_item_title}>材料名称：</Text>
                    <TextInput
                      style={styles.drawer_item_input}
                      placeholder="昵称"
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
                    <Text style={styles.drawer_item_title}>规格：</Text>
                    <TextInput
                      style={styles.drawer_item_input}
                      placeholder="昵称"
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
                    <Text style={styles.drawer_item_title}>供应商：</Text>
                    <TextInput
                      style={styles.drawer_item_input}
                      placeholder="昵称"
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
                  <View style={styles._operate}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setDrawer(false);
                      }}>
                      <View
                        style={{
                          backgroundColor: '#108EE9',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 6,
                          height: 38,
                          width: 70,
                          marginLeft: 70,
                        }}>
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
    );
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
});
