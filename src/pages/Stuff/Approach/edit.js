/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 15:34:33
 * @LastEditTime: 2021-08-23 15:11:46
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
  Modal,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Toast} from '@ant-design/react-native';
import {MAJOR_LIST, BSAE_IMAGE_URL} from '../../../util/constants';
import StuffLists from '../component/stuffLists';
import {Autocomplete, AutocompleteItem} from '@ui-kitten/components';
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
  const [detailInfo, setDetailInfo] = useState({});
  const [stuffLists, setstuffLists] = useState([defaultData]);
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

  // 查看图片
  const [imageModal, setimageModal] = useState(false);
  const [images, setimages] = useState([]);
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
        let info = res.data.data;
        setDetailInfo(info);
        setstuffLists(info.materials || []);
        setTheme(info.theme);
        setPackingWay(info.packingWay);
        setTransporteWay(info.transporteWay);
        setUnloadingRequire(info.unloadingRequire);
        setContractName(info.contractName);
        setDate(info.approachTime);
        setSupplierName(info.supplierName);
        setSupplierContact(info.supplierContact);
        setSupplierMobile(info.supplierMobile);
        setProfessional(info.professional);
        setApprovalData(info.approvalProcedureDtos);
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
    let isEmpty = false;
    let notNum = false;
    stuffLists.map(item => {
      if (item.materialsName === '') {
        isEmpty = true;
      }
      if (item.materialsSpecs === '') {
        isEmpty = true;
      }
      if (item.materialsNum === '') {
        isEmpty = true;
      } else {
        if (isNaN(item.materialsNum)) {
          notNum = true;
        }
      }
    });
    if (isEmpty) {
      return Toast.fail('材料所有选项均是必填');
    }
    if (notNum) {
      return Toast.fail('数量为数字');
    }
    let data = {
      materialsName: '',
      materialsSpecs: '',
      materialsNum: '',
      id: new Date().getTime(),
    };
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
    newList.splice(num, 1);
    setstuffLists(newList);
  };
  // 修改提交材料
  const submit = async () => {
    let isEmpty = false;
    let notNum = false;
    let materials = [];
    stuffLists.forEach(item => {
      if (item.materialsName === '') {
        isEmpty = true;
      }
      if (item.materialsSpecs === '') {
        isEmpty = true;
      }
      if (item.materialsNum === '') {
        isEmpty = true;
      } else {
        if (isNaN(item.materialsNum)) {
          notNum = true;
        }
      }
      materials.push({
        materialsName: item.materialsName,
        materialsSpecs: item.materialsSpecs,
        materialsNum: item.materialsNum,
      });
    });
    if (isEmpty) {
      return Toast.fail('材料所有选项均是必填');
    }
    if (notNum) {
      return Toast.fail('数量为数字');
    }
    if (materials.length === 0) {
      return Toast.fail('请添加材料');
    }
    if (theme.length === 0) {
      return Toast.fail('请输入申请主题');
    }
    if (supplierName.length === 0) {
      return Toast.fail('请输入供应商');
    }
    if (supplierContact.length === 0) {
      return Toast.fail('请输入供应商联系人');
    }
    if (supplierMobile.length === 0) {
      return Toast.fail('请输入联系方式');
    }
    if (packingWay.length === 0) {
      return Toast.fail('请输入包装方式');
    }
    if (transporteWay.length === 0) {
      return Toast.fail('请输入运输方式');
    }
    if (unloadingRequire.length === 0) {
      return Toast.fail('请输入卸货需求');
    }
    if (contractName.length === 0) {
      return Toast.fail('请输入归属合同');
    }
    if (professional.length === 0) {
      return Toast.fail('请选择专业');
    }
    let parms = {
      applyId: detailInfo.applyId,
      idCard: global.userInfo.idCard,
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
      belongProject: global.userInfo.belongProject,
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
  const RenderApproach = obj => {
    let data = obj.data;
    let length = data.length;
    let data1 = data.slice(0, length - 1);
    let data2 = data[length - 1];
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {data1.map(v => (
          <>
            <Text
              style={{
                color: v.status ? (v.isReject === 1 ? 'red' : '#1890ff') : '',
              }}>
              {roleObj[v.roleType]}({v.userName})
            </Text>
            <Text style={{paddingRight: 5, paddingLeft: 5}}>——</Text>
          </>
        ))}
        <Text
          style={{
            color: data2.status
              ? data2.isReject === 1
                ? 'red'
                : '#1890ff'
              : '',
          }}>
          {roleObj[data2.roleType]}({data2.userName})
        </Text>
      </View>
    );
  };
  const RenderApprovalComments = obj => {
    let data = obj.data;
    return (
      <View>
        {data.map(v => {
          return (
            <View style={styles.other_item3}>
              <Text style={styles.other_title}>{v.userName}审批意见：</Text>
              <View style={{flex: 1}}>
                <Text style={{color: '#808695'}}>{v.content}</Text>
                <Text
                  style={{
                    backgroundColor: '#fff',
                    color: '#808695',
                    marginTop: 5,
                  }}>
                  审批时间：{v.approvalTime}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };
  const RenderOutConfirm = obj => {
    let info = obj.data;
    if (info) {
      let pics = JSON.parse(info.signFileurl) || [];
      let image = [];
      pics.map(v => {
        image.push({
          url: `${BSAE_IMAGE_URL}${v}`,
        });
      });
      // setimages(image);
      return (
        <View style={{backgroundColor: '#fff'}}>
          <View style={styles.other_item3}>
            <Text style={styles.other_title}>退场说明：</Text>
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
                placeholder="简介"
                multiline
                editable={false}
                value={info.signContent}
                maxLength={20}
              />
              <Text style={{backgroundColor: '#fff'}}>
                退场确认时间：{info.signTime}
              </Text>
            </View>
          </View>
          <View style={styles.other_item3}>
            <Text style={styles.other_title}>上传凭证：</Text>
            <View style={{flex: 1}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {image.map(item => (
                  <View key={item}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        // setimageModal(true);
                      }}>
                      <Image
                        style={{
                          height: 160,
                          width: 160,
                          marginBottom: 10,
                        }}
                        source={{uri: `${item.url}`}}
                        resizeMode="contain"
                      />
                    </TouchableWithoutFeedback>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      );
    }
    return null;
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
  const renderMateriaName = (item, index) => (
    <AutocompleteItem key={item.id} title={item.materialsName} />
  );
  const renderSupplierName = (item, index) => (
    <AutocompleteItem key={item.id} title={item.supplierName} />
  );
  return (
    <View>
      <KeyboardAvoidingView>
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
                        {/* <TextInput
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
                        /> */}
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
                        value={item.materialsNum.toString()}
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
                <View style={styles.other_item5}>
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
              <Text style={styles.mode_title}>基本信息</Text>
              <View style={{paddingLeft: 10, backgroundColor: '#fff'}}>
                <StuffLists data={stuffLists} />
                <View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>申请主题：</Text>
                    <Text style={styles.item_value}>{theme}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>包装方式：</Text>
                    <Text style={styles.item_value}>{packingWay}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>进场运输方式：</Text>
                    <Text style={styles.item_value}>{transporteWay}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>卸货需求：</Text>
                    <Text style={styles.item_value}>{unloadingRequire}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>归属合同名称：</Text>
                    <Text style={styles.item_value}>{contractName}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>进场时间：</Text>
                    <Text style={styles.item_value}>
                      {date ? date.toString().substring(0, 10) : '-'}
                    </Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>所属专业：</Text>
                    <Text style={styles.item_value}>{professional}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>供应商名称：</Text>
                    <Text style={styles.item_value}>{supplierName}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>供应商联系人：</Text>
                    <Text style={styles.item_value}>{supplierContact}</Text>
                  </View>
                  <View style={styles.other_item}>
                    <Text style={styles.other_title}>联系方式：</Text>
                    <Text style={styles.item_value}>{supplierMobile}</Text>
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
            </View>
          )}
          {/* 审批流程 */}
          <View>
            <Text style={styles.mode_title}>审批流程</Text>
            <View style={{paddingLeft: 10, backgroundColor: '#fff'}}>
              {approvalData.length ? (
                <View>
                  {approvalData.map((item, index) => (
                    <View>
                      <Text
                        style={{
                          display: 'flex',
                          marginBottom: 5,
                          marginTop: 10,
                          width: '100%',
                          textAlign: 'center',
                          fontSize: 16,
                          color: '#b7eb8f',
                        }}>
                        第{index + 1}次审批流程
                      </Text>
                      <View style={styles.other_item4}>
                        <Text style={styles.other_title}>审批流程：</Text>
                        <RenderApproach data={item.approvalDtos} />
                      </View>
                      <RenderApprovalComments data={item.hyApproachApprovals} />
                      <RenderOutConfirm data={item.outConfirm} />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
          {routeType === 'approave' && (
            <View style={styles.other_item3}>
              <Text style={styles.other_title}>
                {global.userInfo.userName}审批意见：
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
      </KeyboardAvoidingView>
      <Modal visible={imageModal} transparent={true}>
        <ImageViewer
          onClick={() => {
            // 图片单击事件
            setimageModal(false);
          }}
          enableImageZoom={true} // 是否开启手势缩放
          saveToLocalByLongPress={false} //是否开启长按保存
          // menuContext={{saveToLocal: '保存图片', cancel: '取消'}}
          imageUrls={images}
          // onSave={url => {
          //   savePhoto(url);
          // }}
        />
      </Modal>
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
    borderColor: '#f8f8f8',
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
  other_item5: {
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
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontWeight: '300',
    minWidth: 160,
  },
  item_value: {
    color: '#999',
    fontSize: 14,
    flex: 1,
    paddingVertical: 12,
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
  mode_title: {
    color: '#1890ff',
    fontSize: 16,
    padding: 12,
  },
});
