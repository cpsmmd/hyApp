/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-08-01 22:39:56
 * @LastEditTime: 2021-08-10 00:41:29
 * @LastEditors: Please set LastEditors
 * @Description: 详情、入库
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Input/edit.js
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
  getMaterialsByName,
  getSupplierByName,
  getInputDetail,
  updateInputApply,
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
  detail: '入库详情',
  approave: '入库管理-入库',
  new: '发起申请',
};
let roleObj = {
  0: '申请人',
  1: '专业负责人',
  2: '库管理员',
  3: '其他审批人',
};
let userInfo = global.userInfo;
const EditApproach = props => {
  const routeType = props.route.params.type;
  const routeId = props.route.params.id;
  const [getInfos, setGetInfos] = useState({});
  const [detailInfo, setDetailInfo] = useState({});
  const [hyWarehouseDtos, sethyWarehouseDtos] = useState([]);
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

  const [warehouseMaterials, setwarehouseMaterials] = useState([]);
  const [approvalContent, setapprovalContent] = useState('');
  const [fileList, setfileList] = useState([]);
  // 设置标题
  useEffect(() => {
    props.navigation.setOptions({
      title: menuObj[props.route.params.type],
    });
    console.log('props.route.params.type', menuObj[props.route.params.type]);
    if (routeType !== 'new') {
      getDetail();
    }
  }, []);
  // 获取详情
  const getDetail = async () => {
    try {
      const res = await getInputDetail(props.route.params.id);
      if (res.data.code === 200) {
        console.log('---------入库详情------', JSON.stringify(res.data.data));
        setGetInfos(res.data.data);
        let info = res.data.data.approachRootBean;
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
        // 入库流程
        console.log('入库', res.data.data.hyWarehouseDtos);
        sethyWarehouseDtos(res.data.data.hyWarehouseDtos);
        // 当是approval的时候 warehouseMaterials
        if (routeType === 'approave') {
          if (res.data.data.hyWarehouseDtos.length === 0) {
            let list = [];
            info.materials.map(v => {
              console.log(v)
              list.push({
                id: v.id,
                lackNum: '',
                materialsName: v.materialsName,
                materialsSpecs: v.materialsSpecs,
                warehouseNum: '',
                materialsNum: v.materialsNum,
              });
            });
            console.log('哈哈哈哈哈哈哈哈哈', list);
            setwarehouseMaterials(list);
          }
        }
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
  // 审批
  const changeStatus = async state => {
    let list = [];
    let isOk = true;
    warehouseMaterials.map(v => {
      console.log('嘻嘻嘻嘻嘻', v)
      let num = v.materialsNum * 1;
      let num2 = v.warehouseNum * 1 + v.lackNum * 1;
      console.log(num);
      console.log(num2);
      if (num !== num2) {
        isOk = false;
      }
      list.push({
        materialsName: v.materialsName,
        materialsSpecs: v.materialsSpecs,
        warehouseNum: v.warehouseNum,
        lackNum: v.lackNum,
        applyMaterialsId: v.id,
      });
    });
    if (!isOk) {
      Toast.fail('请检查入库数量与缺补数量之和是否与总数量相等');
      return;
    }
    let parms = {
      id: props.route.params.id,
      approachApplyId: getInfos.approachApplyId,
      hyWarehouseExplain: {
        content: approvalContent,
        warehouseUrl: '',
        state,
      },
      warehouseMaterials: list,
      idCard: userInfo.idCard,
    };
    console.log('入库parms', parms);
    console.log('detailInfo');
    try {
      const res = await updateInputApply(parms);
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
  // 审批流程
  const RenderApproach = () => {
    if (approvalData.length) {
      let data = approvalData[0].approvalDtos || [];
      let length = data.length;
      let data1 = data.slice(0, length - 1);
      let data2 = data[length - 1];
      return (
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          {data1.map(v => (
            <>
              <Text style={{color: v.status ? '#1890ff' : ''}}>
                {roleObj[v.roleType]}({v.userName})
              </Text>
              <Text style={{paddingRight: 5, paddingLeft: 5}}>——</Text>
            </>
          ))}
          <Text style={{color: data2.status ? '#1890ff' : ''}}>
            {roleObj[data2.roleType]}({data2.userName})
          </Text>
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
              <View>
                <View style={styles.other_item3}>
                  <Text style={styles.other_title}>{v.userName}审批意见：</Text>
                  <View style={{flex: 1}}>
                    <TextInput
                      style={{
                        backgroundColor: '#EEEEEE',
                        borderWidth: 0,
                        borderRadius: 5,
                        paddingLeft: 15,
                        textAlign: 'left',
                        textAlignVertical: 'top',
                        androidtextAlignVertical: 'top',
                        width: '90%',
                      }}
                      numberOfLines={
                        Platform.OS === 'ios' ? null : numberOfLines
                      }
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
                    <Text style={{backgroundColor: '#fff'}}>
                      审批时间：{v.approvalTime}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  };
  // 入库信息
  const RenderInput = () => {
    if (hyWarehouseDtos.length > 0) {
      let data = hyWarehouseDtos[0].warehouseMaterials;
      let info = hyWarehouseDtos[0].hyWarehouseExplain;
      return (
        <View
          style={{
            margin: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1890ff'}}>
            入库信息
          </Text>
          <View style={{backgroundColor: '#fff'}}>
            {data.map(item => {
              return (
                <View key={item.id} style={styles.stuff_items}>
                  <View style={styles.flex_row}>
                    <Text style={styles.stuff_item_title}>材料名称:</Text>
                    <TextInput
                      editable={false}
                      value={item.materialsName}
                      style={styles.input_sty2}
                      placeholder="请输入"
                    />
                    <Text style={styles.stuff_item_title}> 缺补数量:</Text>
                    <TextInput
                      editable={false}
                      value={item.lackNum}
                      style={styles.input_sty2}
                      placeholder="请输入"
                    />
                  </View>
                  <View style={[styles.flex_row, {marginTop: 10}]}>
                    <Text style={styles.stuff_item_title}>规格：</Text>
                    <TextInput
                      editable={false}
                      value={item.materialsSpecs}
                      style={styles.input_sty2}
                      placeholder="请输入"
                    />
                    <Text style={[styles.stuff_item_title, {marginLeft: 6}]}>
                      入库数量：
                    </Text>
                    <TextInput
                      editable={false}
                      value={item.materialsNum}
                      style={styles.input_sty2}
                      placeholder="请输入"
                    />
                  </View>
                </View>
              );
            })}
            <View style={styles.other_item3}>
              <Text style={styles.other_title}>入库说明：</Text>
              <View style={{flex: 1}}>
                <TextInput
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderWidth: 0,
                    borderRadius: 5,
                    paddingLeft: 15,
                    textAlign: 'left',
                    textAlignVertical: 'top',
                    androidtextAlignVertical: 'top',
                    width: '90%',
                  }}
                  numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                  minHeight={
                    Platform.OS === 'ios' && numberOfLines
                      ? 20 * numberOfLines
                      : null
                  }
                  multiline
                  editable={false}
                  value={info.content}
                  maxLength={20}
                />
              </View>
            </View>
            <View style={styles.other_item3}>
              <Text style={styles.other_title}>上传凭证：</Text>
              <View style={{flex: 1}}>
                {/* <Text>{JSON.parse(info.warehouseUrl)}</Text> */}
              </View>
            </View>
          </View>
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
  // 入库信息
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
            {/* 入库信息 */}
            <RenderInput></RenderInput>
            {/* 提交 */}
            {routeType === 'approave' && (
              <View>
                {/* <RenderInput2></RenderInput2> */}
                {warehouseMaterials.length ? (
                  <View
                    style={{
                      margin: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#1890ff',
                      }}>
                      入库信息
                    </Text>
                    <View style={{backgroundColor: '#fff'}}>
                      {warehouseMaterials.map(item => {
                        return (
                          <View key={item.id} style={styles.stuff_items}>
                            <View style={styles.flex_row}>
                              <Text style={styles.stuff_item_title}>
                                材料名称:
                              </Text>
                              <TextInput
                                value={item.materialsName}
                                editable={false}
                                style={styles.input_sty2}
                                placeholder="请输入"
                              />
                              <Text style={styles.stuff_item_title}>
                                {' '}
                                缺补数量:
                              </Text>
                              <TextInput
                                onChangeText={text => {
                                  let newList = [...warehouseMaterials];
                                  newList.map(v => {
                                    if (v.id === item.id) {
                                      v.lackNum = text;
                                    }
                                  });
                                  setwarehouseMaterials(newList);
                                }}
                                value={item.lackNum}
                                style={styles.input_sty2}
                                placeholder="请输入"
                              />
                            </View>
                            <View style={[styles.flex_row, {marginTop: 10}]}>
                              <Text style={styles.stuff_item_title}>
                                规格：
                              </Text>
                              <TextInput
                                value={item.materialsSpecs}
                                editable={false}
                                style={styles.input_sty2}
                                placeholder="请输入"
                              />
                              <Text
                                style={[
                                  styles.stuff_item_title,
                                  {marginLeft: 6},
                                ]}>
                                入库数量：
                              </Text>
                              <TextInput
                                onChangeText={text => {
                                  let newList = [...warehouseMaterials];
                                  newList.map(v => {
                                    if (v.id === item.id) {
                                      v.warehouseNum = text;
                                    }
                                  });
                                  setwarehouseMaterials(newList);
                                }}
                                value={item.warehouseNum}
                                style={styles.input_sty2}
                                placeholder="请输入"
                              />
                            </View>
                          </View>
                        );
                      })}
                      <View style={styles.other_item3}>
                        <Text style={styles.other_title}>入库说明：</Text>
                        <View style={{flex: 1}}>
                          <TextInput
                            style={{
                              backgroundColor: '#EEEEEE',
                              borderWidth: 0,
                              borderRadius: 5,
                              paddingLeft: 15,
                              textAlign: 'left',
                              textAlignVertical: 'top',
                              androidtextAlignVertical: 'top',
                              width: '90%',
                            }}
                            numberOfLines={
                              Platform.OS === 'ios' ? null : numberOfLines
                            }
                            minHeight={
                              Platform.OS === 'ios' && numberOfLines
                                ? 20 * numberOfLines
                                : null
                            }
                            multiline
                            onChangeText={text => setapprovalContent(text)}
                            value={approvalContent}
                            maxLength={20}
                          />
                        </View>
                      </View>
                      {/* <View style={styles.other_item3}>
                      <Text style={styles.other_title}>上传凭证：</Text>
                      <View style={{flex: 1}}>
                        <Text>{JSON.parse(fileList)}</Text>
                      </View>
                    </View> */}
                    </View>
                  </View>
                ) : null}
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
                      <Text
                        style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                        入库
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
                      <Text
                        style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                        拒绝入库
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
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
  input_sty2: {
    height: 38,
    borderRadius: 5,
    paddingLeft: 10,
    width: 115,
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
