/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-06 23:08:05
 * @LastEditTime: 2021-08-09 21:32:56
 * @LastEditors: Please set LastEditors
 * @Description: 发起进场申请
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Approach/new.js
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
import {MAJOR, MAJOR_LIST} from '../../../util/constants';
import {Input, Autocomplete, AutocompleteItem} from '@ui-kitten/components';
import {
  addApproachApply,
  getMaterialsByName,
  getSupplierByName,
} from '../../../api/stuff';
let defaultData = {
  materialsName: '',
  materialsSpecs: '',
  materialsNum: '',
  id: new Date().getTime(),
};
let userInfo = global.userInfo;
const New = props => {
  console.log(props.navigation);
  const [stuffLists, setstuffLists] = useState([defaultData]);
  const [professional, setProfessional] = useState('选择专业'); // 专业 显示名称
  const [majorValue, setMajorValue] = useState(0); // 选中value
  const [dateEnd, setDateEnd] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [supplierName, setSupplierName] = useState(''); // 供应商名称
  const [theme, setTheme] = useState(''); // 申请主题
  const [supplierContact, setSupplierContact] = useState(''); // 供应商联系人
  const [supplierMobile, setSupplierMobile] = useState(''); // 联系方式
  const [packingWay, setPackingWay] = useState(''); // 包装方式
  const [transporteWay, setTransporteWay] = useState(''); // 进场运输方式
  const [unloadingRequire, setUnloadingRequire] = useState(''); // 卸货需求
  const [fileUrl, setFileUrl] = useState(''); // 附件上传路径
  const [contractName, setContractName] = useState(''); // 归属合同名称

  // 模糊搜索材料名称
  const [materialsList, setMaterialsList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [curId, setCurId] = useState('');
  useEffect(() => {
    // props.navigation.setOptions({
    //   title: 'hhahah',
    // });
  }, []);
  // 添加材料
  const addStuff = () => {
    // if (materialsList.length > 0) {
    //   Toast.fail('请选择材料名称');
    //   return;
    // }
    let data = {...defaultData};
    data.id = new Date().getTime();
    setstuffLists(state => {
      return [...state, data];
    });
  };
  // 删除材料
  const delStuff = num => {
    let newList = [...stuffLists];
    if (newList.length === 1) {
      return Toast.info('至少保留一项');
    }
    const Index = newList.findIndex(v => v === num);
    newList.splice(Index, 1);
    setstuffLists(newList);
  };
  // 提交材料
  const submit = async () => {
    let materials = [];
    stuffLists.forEach(item => {
      // item.materialsName
      materials.push({
        materialsName: item.materialsName,
        materialsSpecs: item.materialsSpecs,
        materialsNum: item.materialsNum,
      });
    });
    if (materials.length === 0) {
      Toast.fail('请添加材料');
      return;
    }
    let parms = {
      idCard: userInfo.idCard,
      supplierName,
      theme,
      supplierContact,
      supplierMobile,
      packingWay,
      transporteWay,
      unloadingRequire,
      contractName,
      professional,
      approachTime: JSON.stringify(date).substring(1, 11),
      fileUrl,
      materials: materials,
    };
    console.log('新增parms', parms);
    try {
      const res = await addApproachApply(parms);
      console.log('res.data', res.data);
      if (res.data.code === 200) {
        props.navigation.goBack();
        Toast.success(res.data.message);
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
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
    setMode(currentMode);
  };
  const searchMaterisName = async (name, id) => {
    setCurId(id);
    try {
      const res = await getMaterialsByName(name);
      console.log('模糊查询材料名称/appapi/selectMaterialsByName', res.data);
      let list = res.data.data || [];
      setMaterialsList(list);
    } catch (error) {
      console.error(error);
    }
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
  const renderMateriaName = (item, index) => (
    <AutocompleteItem key={item.id} title={item.materialsName} />
  );
  const renderSupplierName = (item, index) => (
    <AutocompleteItem key={item.id} title={item.supplierName} />
  );
  return (
    <View>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => {
            // Keyboard.dismiss();
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {/* 材料列表 */}
              {stuffLists.map((item, index) => (
                <View key={item.id} style={styles.stuff_items}>
                  <View style={styles.flex_row}>
                    <Text style={styles.stuff_item_title}>材料名称：</Text>
                    <View>
                      <Autocomplete
                        style={styles.input_sty}
                        value={item.materialsName}
                        onSelect={index => {
                          let newList = [...stuffLists];
                          newList.map(v => {
                            if (v.id === item.id) {
                              v.materialsName =
                                materialsList[index].materialsName;
                            }
                          });
                          setstuffLists(newList);
                        }}
                        onChangeText={text => {
                          let newList = [...stuffLists];
                          newList.map(v => {
                            if (v.id === item.id) {
                              v.materialsName = text;
                            }
                          });
                          setstuffLists(newList);
                          searchMaterisName(text.trim());
                        }}>
                        {materialsList.map(renderMateriaName)}
                      </Autocomplete>
                    </View>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        delStuff(index);
                      }}>
                      <Image
                        style={styles.del_btn}
                        source={require('../../../assets/stuff/del.png')}
                      />
                    </TouchableWithoutFeedback>
                  </View>
                  {item.id === curId && materialsList.length > 0 ? (
                    <View
                      style={{
                        width: '100%',
                        zIndex: 999,
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}>
                      {materialsList.map(v => (
                        <TouchableWithoutFeedback
                          key={v.id}
                          onPress={() => {
                            let newList = [...stuffLists];
                            newList.map(v1 => {
                              if (v1.id === curId) {
                                v1.materialsName = v.materialsName;
                              }
                            });
                            setstuffLists(newList);
                            setMaterialsList([]);
                          }}>
                          <Text style={[styles.default_label]} key={v}>
                            {v.materialsName}
                          </Text>
                        </TouchableWithoutFeedback>
                      ))}
                    </View>
                  ) : null}
                  <View style={[styles.flex_row, {marginTop: 10}]}>
                    <Text style={styles.stuff_item_title}>规格：</Text>
                    <TextInput
                      onChangeText={text => {
                        let newList = [...stuffLists];
                        newList.map(v => {
                          if (v.id === item.id) {
                            v.materialsSpecs = text;
                          }
                        });
                        setstuffLists(newList);
                      }}
                      value={item.materialsSpecs}
                      style={styles.input_sty}
                      placeholder="请输入"
                    />
                    <Text style={[styles.stuff_item_title, {marginLeft: 6}]}>
                      数量：
                    </Text>
                    <TextInput
                      onChangeText={text => {
                        let newList = [...stuffLists];
                        newList.map(v => {
                          if (v.id === item.id) {
                            v.materialsNum = text;
                          }
                        });
                        setstuffLists(newList);
                      }}
                      value={item.materialsNum}
                      style={styles.input_sty}
                      placeholder="请输入"
                    />
                  </View>
                </View>
              ))}
              <TouchableWithoutFeedback
                onPress={() => {
                  addStuff();
                }}>
                <View style={styles.add_area}>
                  <Image source={require('../../../assets/stuff/add.png')} />
                  <Text style={styles.add_text}>添加材料</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>申请主题：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setTheme(text)}
                  value={theme}
                />
              </View>
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>供应商名称：</Text>
                <Autocomplete
                  style={styles.input_no_border}
                  value={supplierName}
                  onSelect={index => {
                    setSupplierName(supplierList[index].supplierName);
                  }}
                  onChangeText={text => {
                    setSupplierName(text);
                    searcSupplierName(text.trim());
                  }}>
                  {supplierList.map(renderSupplierName)}
                </Autocomplete>
              </View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>包装方式：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setPackingWay(text)}
                  value={packingWay}
                />
              </View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>进场运输方式：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setTransporteWay(text)}
                  value={transporteWay}
                />
              </View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>卸货需求：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setUnloadingRequire(text)}
                  value={unloadingRequire}
                />
              </View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>归属合同名称：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setContractName(text)}
                  value={contractName}
                />
              </View>
              <View style={styles.other_item2}>
                <Text style={styles.other_title}>进场时间：</Text>
                {Platform.OS === 'android' && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      showDatepicker();
                    }}>
                    <Text style={{width: 200, color: '#999999', fontSize: 14}}>
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
              <View style={styles.other_item2}>
                <Text style={styles.other_title}>所属专业：</Text>
                <View>
                  <ModalDropdown
                    defaultValue={'请选择专业'}
                    options={MAJOR_LIST}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.DropDownPickerText}
                    dropdownTextHighlightStyle={
                      styles.dropdownTextHighlightStyle
                    }
                    onSelect={value => {
                      console.log('专业', value);
                      // setMajorValue(item.value);
                      setProfessional(MAJOR_LIST[value]);
                    }}
                  />
                </View>
              </View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>供应商联系人：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setSupplierContact(text)}
                  value={supplierContact}
                />
              </View>
              <View style={styles.other_item}>
                <Text style={styles.other_title}>联系方式：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                  onChangeText={text => setSupplierMobile(text)}
                  value={supplierMobile}
                />
              </View>
              {/* <View style={styles.other_item}>
                <Text style={styles.other_title}>附件上传：</Text>
                <TextInput
                  style={styles.input_no_border}
                  placeholder="请输入"
                />
              </View> */}
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

export default New;

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
    position: 'relative',
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#fff',
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
    minWidth: 160,
  },
  // 下拉框样式
  dropdownText: {
    color: '#999999',
    fontSize: 14,
  },
  dropdownStyle: {
    padding: 10,
  },
  DropDownPickerText: {
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
    color: '#1890ff',
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
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
