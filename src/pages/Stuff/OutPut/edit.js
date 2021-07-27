/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 15:34:33
 * @LastEditTime: 2021-07-26 23:57:36
 * @LastEditors: Please set LastEditors
 * @Description: 出库管理
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Approach/edit.js
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
import {MAJOR_LIST} from '../../../util/constants';
import StuffLists from '../component/stuffLists';
import {
  editApproachApply,
  updateToApproval,
  addOutputApply,
  reardOutputApply,
} from '../../../api/stuff';
import dealFail from '../../../util/common';
const numberOfLines = 3;
let defaultData = {
  materialsName: '',
  materialsSpecs: '',
  materialsNum: '',
  id: `${Math.random()}-${Math.random()}-${Math.random()}`,
};
let menuObj = {
  detail: '详情',
  edit: '仓库责任人确认',
  motify: '修改',
  add: '发起申请',
  approve: '出库审批',
  confirm: '出库确认',
  return: '归还',
};
let userInfo = global.userInfo;
const EditApproach = props => {
  console.log(props.navigation);
  const routeType = props.route.params.type;
  const routeId = props.route.params.id;
  console.log('routeType', routeType);
  const [outputInfo, setOutputInfo] = useState({}); // 出库申请详情
  const [stuffLists, setstuffLists] = useState([defaultData]);
  const [majorName, setMajorName] = useState('选择专业'); // 显示名称
  const [majorValue, setMajorValue] = useState(0); // 选中value
  const [dateEnd, setDateEnd] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [timeMode, settimeMode] = useState('date');

  const [professional, setProfessional] = useState('选择专业');
  const [supplierName, setSupplierName] = useState(''); // 供应商名称
  const [theme, setTheme] = useState(''); // 申请主题
  const [purpose, setpurpose] = useState(''); // 材料用途
  const [supplierContact, setSupplierContact] = useState(''); // 供应商联系人
  const [supplierMobile, setSupplierMobile] = useState(''); // 联系方式
  const [packingWay, setPackingWay] = useState(''); // 包装方式
  const [transporteWay, setTransporteWay] = useState(''); // 进场运输方式
  const [unloadingRequire, setUnloadingRequire] = useState(''); // 卸货需求
  const [fileUrl, setFileUrl] = useState(''); // 附件上传路径
  const [contractName, setContractName] = useState(''); // 归属合同名称
  // 设置标题
  useEffect(() => {
    props.navigation.setOptions({
      title: menuObj[props.route.params.type],
    });
    if (routeType !== 'add') {
      // getDetail();
    }
  }, []);
  // 获取详情
  const getDetail = async () => {
    try {
      const res = await reardOutputApply(props.route.params.id);
      console.log('res', res);
      if (res.data.code === 200) {
        console.log('进场详情', res.data.data);
        // setOutputInfo(res.data.data);
        // setLists(res.data.data);
      } else {
        dealFail(props, res.data.code, res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 添加材料
  const addStuff = () => {
    setstuffLists(state => {
      return [...state, defaultData];
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
    if (routeType === 'add') {
      let parms = {
        theme,
        purpose,
        useTime: JSON.stringify(date).substring(1, 11),
        belongProject: userInfo.belongProject,
        materials: stuffLists,
      };
      try {
        const res = await addOutputApply(parms);
        if (res.data.code === 200) {
          props.navigation.goBack();
          Toast.success(res.data.message);
        } else {
          Toast.fail(res.data.message);
        }
      } catch (error) {
        console.error();
      }
    } else if (routeType === 'edit') {
    }
    // 编辑
    let materials = [];
    stuffLists.forEach(item => {
      materials.push({
        materialsName: item.materialsName,
        materialsSpecs: item.materialsSpecs,
        materialsNum: item.materialsNum,
      });
    });
    let parms = {
      applyId: props.route.params.id,
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
      materials: stuffLists,
    };
    console.log('修改parms', parms);
    try {
      const res = await editApproachApply(parms);
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
  // 审批
  const changeStatus = async state => {
    let parms = {
      state,
      applyId: props.route.params.id,
      content: 'dcd',
      belongProject: userInfo.belongProject,
    };
    try {
      const res = await updateToApproval(parms);
      if (res.data.code === 200) {
        // props.navigation.goBack();
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
    settimeMode(currentMode);
  };
  return (
    <View>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 编辑 */}
          {['edit', 'add'].includes(routeType) ? (
            <>
              <View>
                {/* 材料列表 */}
                {stuffLists.map((item, index) => (
                  <View key={item.id} style={styles.stuff_items}>
                    <View style={styles.flex_row}>
                      <Text style={styles.stuff_item_title}>材料名称：</Text>
                      <View>
                        <TextInput
                          onChangeText={text => {
                            let newList = [...stuffLists];
                            newList.map(v => {
                              if (v.id === item.id) {
                                v.materialsName = text;
                              }
                            });
                            setstuffLists(newList);
                          }}
                          value={item.materialsName}
                          style={styles.input_sty}
                          placeholder="请输入"
                        />
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
                <View style={styles.other_item}>
                  <Text style={styles.other_title}>材料用途：</Text>
                  <TextInput
                    style={styles.input_no_border}
                    placeholder="请输入"
                    onChangeText={text => setpurpose(text)}
                    value={purpose}
                  />
                </View>
                <View style={styles.other_item2}>
                  <Text style={styles.other_title}>领用时间：</Text>
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
              </View>
            </>
          ) : (
            // 查看
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
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: 10,
              marginTop: 10,
            }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: '#19be6b',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  height: 38,
                  width: 70,
                  marginRight: 30,
                }}>
                <Text style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                  通过
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: '#F30000FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  height: 38,
                  width: 80,
                }}>
                <Text style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                  驳回
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditApproach;

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
    // color: 'red',
    padding: 10,
  },
  DropDownPickerText: {
    // color: 'red',
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
    color: '#108EE9',
  },
});
