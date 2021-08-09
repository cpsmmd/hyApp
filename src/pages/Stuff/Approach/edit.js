/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 15:34:33
 * @LastEditTime: 2021-08-03 22:11:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
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
  approachApplyDetail,
  editApproachApply,
  updateToApproval,
  getMaterialsByName,
  getSupplierByName,
} from '../../../api/stuff';
import dealFail from '../../../util/common';
const numberOfLines = 3;
let defaultData = {
  materialsName: '',
  materialsSpecs: '',
  materialsNum: '',
  id: new Date().getTime(),
};
let menuObj = {
  detail: '审批详情',
  edit: '进场管理-修改',
  approave: '进场管理-审批',
};
let userInfo = global.userInfo;
const EditApproach = props => {
  const routeType = props.route.params.type;
  const routeId = props.route.params.id;
  const [detailInfo, setDetailInfo] = useState({});
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
  const [supplierContact, setSupplierContact] = useState(''); // 供应商联系人
  const [supplierMobile, setSupplierMobile] = useState(''); // 联系方式
  const [packingWay, setPackingWay] = useState(''); // 包装方式
  const [transporteWay, setTransporteWay] = useState(''); // 进场运输方式
  const [unloadingRequire, setUnloadingRequire] = useState(''); // 卸货需求
  const [fileUrl, setFileUrl] = useState(''); // 附件上传路径
  const [contractName, setContractName] = useState(''); // 归属合同名称

  const [approvalData, setApprovalData] = useState({});
  // 模糊搜索材料名称
  const [materialsList, setMaterialsList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [curId, setCurId] = useState('');
  // 审批
  const [content, setContent] = useState('');
  // 设置标题
  useEffect(() => {
    props.navigation.setOptions({
      title: menuObj[props.route.params.type],
    });
    getDetail();
  }, []);
  // 获取详情
  const getDetail = async () => {
    try {
      const res = await approachApplyDetail(props.route.params.id);
      if (res.data.code === 200) {
        console.log('---------进场详情------', res.data.data);
        // setLists(res.data.data);
        let info = res.data.data;
        setDetailInfo(info);
        setstuffLists(info.materials || []);
        setTheme(info.theme);
        setPackingWay(info.packingWay);
        setTransporteWay(info.transporteWay);
        setUnloadingRequire(info.unloadingRequire);
        setContractName(info.contractName);
        setSupplierName(info.supplierName);
        setSupplierContact(info.supplierContact);
        setSupplierMobile(info.supplierMobile);
        setProfessional(info.professional);
        setApprovalData(info.approvalProcedureDtos);
        console.log('审批流程', JSON.stringify(info.approvalProcedureDtos));
      } else {
        dealFail(props, res.data.code, res.data.message);
      }
    } catch (error) {
      Toast.fail('获取数据失败');
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
  // 修改提交材料
  const submit = async () => {
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
      applyId: detailInfo.applyId,
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
    if (routeType === 'edit') {
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
    }
  };
  // 审批
  const changeStatus = async state => {
    if (content.trim().length === 0) {
      return Toast.fail('请填写审批意见');
    }
    let parms = {
      state,
      applyId: detailInfo.applyId,
      content,
      belongProject: userInfo.belongProject,
    };
    console.log('审批parms', parms);
    try {
      const res = await updateToApproval(parms);
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
    settimeMode(currentMode);
  };
  const RenderApproach = () => {
    if (approvalData.length) {
      let data = approvalData[0].approvalDtos || [];
      let length = data.length;
      let data1 = data.slice(0, length - 1);
      let data2 = data[length - 1];
      return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {data1.map(v => (
            <>
              <Text>{v.userName}</Text>
              <Text style={{paddingRight: 5, paddingLeft: 5}}>——</Text>
            </>
          ))}
          <Text>{data2.userName}</Text>
        </View>
      );
    } else {
      return null;
    }
  };
  const RenderApprovalComments = () => {
    if (approvalData.length) {
      let data = approvalData[0].hyApproachApprovals;
      return (
        <View>
          {data.map(v => {
            return (
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>{v.userName}审批意见：</Text>
                <TextInput
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderWidth: 0,
                    borderRadius: 5,
                    paddingLeft: 15,
                    textAlign: 'left',
                    textAlignVertical: 'top',
                    androidtextAlignVertical: 'top',
                    width: '60%',
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
                  value={v.content}
                  maxLength={20}
                />
              </View>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  };
  const searchMaterisName = async (name, id) => {
    setCurId(id);
    try {
      const res = await getMaterialsByName(name);
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
                              searchMaterisName(text.trim(), item.id);
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
                        <Text
                          style={[styles.stuff_item_title, {marginLeft: 6}]}>
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
                          value={item.materialsNum.toString()}
                          style={styles.input_sty}
                          placeholder="请输入"
                        />
                      </View>
                    </View>
                  ))}
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
                  <View style={styles.other_item2}>
                    <Text style={styles.other_title}>所属专业：</Text>
                    <View>
                      <ModalDropdown
                        defaultValue={professional}
                        options={MAJOR_LIST}
                        textStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdownStyle}
                        dropdownTextStyle={styles.DropDownPickerText}
                        dropdownTextHighlightStyle={
                          styles.dropdownTextHighlightStyle
                        }
                        onSelect={value => {
                          setProfessional(MAJOR_LIST[value]);
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>供应商名称：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      onChangeText={text => {
                        setSupplierName(text);
                        searcSupplierName(text.trim());
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
              </>
            ) : (
              // 详情
              <View>
                <StuffLists data={stuffLists} />
                <View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>申请主题：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setTheme(text)}
                      value={theme}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>包装方式：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setPackingWay(text)}
                      value={packingWay}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>进场运输方式：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setTransporteWay(text)}
                      value={transporteWay}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>卸货需求：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setUnloadingRequire(text)}
                      value={unloadingRequire}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>归属合同名称：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setContractName(text)}
                      value={contractName}
                    />
                  </View>
                  <View style={styles.other_item2}>
                    <Text style={styles.other_title}>进场时间：</Text>
                    {Platform.OS === 'android' && (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          // showDatepicker();
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
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>所属专业：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      value={professional}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>供应商名称：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setSupplierName(text)}
                      value={supplierName}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>供应商联系人：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setSupplierContact(text)}
                      value={supplierContact}
                    />
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>联系方式：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
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
              </View>
            )}
            {/* 审批流程 */}
            <View style={styles.other_item4}>
              <Text style={styles.other_title}>审批流程：</Text>
              <RenderApproach></RenderApproach>
            </View>
            <RenderApprovalComments></RenderApprovalComments>
            {routeType === 'approave' && (
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>
                  {userInfo.userName}审批意见：
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderWidth: 0,
                    borderRadius: 5,
                    paddingLeft: 15,
                    textAlign: 'left',
                    textAlignVertical: 'top',
                    androidtextAlignVertical: 'top',
                    width: '60%',
                  }}
                  numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                  minHeight={
                    Platform.OS === 'ios' && numberOfLines
                      ? 20 * numberOfLines
                      : null
                  }
                  placeholder="请填写"
                  multiline
                  onChangeText={text => setContent(text)}
                  value={content}
                  maxLength={20}
                />
              </View>
            )}
            {/* 提交 */}
            {routeType === 'edit' && (
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
            )}
            {routeType === 'approave' && (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginBottom: 30,
                  marginTop: 10,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    changeStatus(1);
                  }}>
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
                <TouchableWithoutFeedback
                  onPress={() => {
                    changeStatus(0);
                  }}>
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
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
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
    paddingBottom: 20,
  },
  other_item4: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
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
