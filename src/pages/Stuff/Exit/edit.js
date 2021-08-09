/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 17:40:17
 * @LastEditTime: 2021-08-08 23:13:04
 * @LastEditors: Please set LastEditors
 * @Description: 退场 (增删改查)
 * @FilePath: /web/hy/hyApp/src/pages/Stuff/Exit/edit.js
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
  Dimensions,
} from 'react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Toast} from '@ant-design/react-native';
import {EXIT_DIRECTION} from '../../../util/constants';
import StuffLists from '../component/stuffLists';
import {
  getMaterialsByName,
  getSupplierByName,
  getExitDetail,
  getBillList2,
  addExitApply,
  editExitApply,
  confirmExitApply,
  approaveExitApply,
} from '../../../api/stuff';
import {upLoadFile} from '../../../api/user';
import dealFail from '../../../util/common';
const numberOfLines = 3;
let defaultData = {
  materialsName: '',
  materialsSpecs: '',
  materialsNum: '',
  id: Math.random().toString(16),
};
let menuObj = {
  detail: '审批详情',
  edit: '退场管理-修改',
  approave: '退场管理-审批',
  new: '发起申请',
  confirm: '退场管理-编辑',
};
const {width} = Dimensions.get('window');
const imgOptions = {
  imageCount: 1, // 最大选择图片数目，默认6
  isRecordSelected: false, // 是否已选图片
  isCamera: true, // 是否允许用户在内部拍照，默认true
  isCrop: false, // 是否允许裁剪，默认false, imageCount 为1才生效
  CropW: ~~(width * 0.6), // 裁剪宽度，默认屏幕宽度60%
  CropH: ~~(width * 0.6), // 裁剪高度，默认屏幕宽度60%
  isGif: false, // 是否允许选择GIF，默认false，暂无回调GIF数据
  showCropCircle: false, // 是否显示圆形裁剪区域，默认false
  circleCropRadius: ~~(width / 4), // 圆形裁剪半径，默认屏幕宽度一半
  showCropFrame: true, // 是否显示裁剪区域，默认true
  showCropGrid: false, // 是否隐藏裁剪区域网格，默认false
  freeStyleCropEnabled: false, // 裁剪框是否可拖拽
  rotateEnabled: true, // 裁剪是否可旋转图片
  scaleEnabled: true, // 裁剪是否可放大缩小图片
  compress: true,
  minimumCompressSize: 100, // 小于100kb的图片不压缩
  quality: 90, // 压缩质量
  enableBase64: false, // 是否返回base64编码，默认不返回
  allowPickingOriginalPhoto: false,
  allowPickingMultipleVideo: false, // 可以多选视频/gif/图片，和照片共享最大可选张数maxImagesCount的限制
  videoMaximumDuration: 10 * 60, // 视频最大拍摄时间，默认是10分钟，单位是秒
  isWeChatStyle: false, // 是否是微信风格选择界面 Android Only
  sortAscendingByModificationDate: true, // 对照片排序，按修改时间升序，默认是YES。如果设置为NO,最新的照片会显示在最前面，内部的拍照按钮会排在第一个,
  showSelectedIndex: true,
};
let userInfo = global.userInfo;
const EditExit = props => {
  const routeType = props.route.params.type;
  const routeId = props.route.params.id;
  const [detailInfo, setDetailInfo] = useState({});
  const [stuffLists, setstuffLists] = useState([defaultData]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [timeMode, settimeMode] = useState('date');

  const [professional, setProfessional] = useState('选择专业');
  const [exitDirecte, setExitDirecte] = useState('选择方向');
  const [supplierName, setSupplierName] = useState(''); // 供应商名称
  const [theme, setTheme] = useState(''); // 申请主题

  const [approvalData, setApprovalData] = useState({});
  // 模糊搜索材料名称
  const [materialsList, setMaterialsList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [curId, setCurId] = useState('');
  // 审批
  const [content, setContent] = useState(''); // 退场审核意见
  // 编辑
  const [signFileurl, setsignFileurl] = useState(''); // 上传凭证
  const [signContent, setSignContent] = useState(''); // 上传退场说明
  // 设置标题
  useEffect(() => {
    props.navigation.setOptions({
      title: menuObj[props.route.params.type],
    });
    if (routeType !== 'new') {
      getDetail();
    }
  }, []);
  // 获取详情
  const getDetail = async () => {
    try {
      const res = await getExitDetail(props.route.params.id);
      if (res.data.code === 200) {
        console.log('---------退场详情------', JSON.stringify(res.data.data));
        // setLists(res.data.data);
        let info = res.data.data;
        setDetailInfo(info);
        // setstuffLists(info.materials || []);
        setTheme(info.theme);
        setExitDirecte(info.exitDirecte);
        setDate(info.exitTime);
        // setPackingWay(info.packingWay);
        // setTransporteWay(info.transporteWay);
        // setUnloadingRequire(info.unloadingRequire);
        // setContractName(info.contractName);
        // setSupplierName(info.supplierName);
        // setSupplierContact(info.supplierContact);
        // setSupplierMobile(info.supplierMobile);
        setApprovalData(info.approvalProcedureDtos);
        // console.log('审批流程', JSON.stringify(info.approvalProcedureDtos));
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
    let newData = {...defaultData};
    newData.id = Math.random().toString(16);
    setstuffLists(state => {
      return [...state, newData];
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
  // 申请、修改提交材料
  const submit = async () => {
    // 编辑
    let parms = {
      theme,
      exitDirecte,
      exitTime: JSON.stringify(date).substring(1, 11),
      belongProject: global.userInfo.belongProject,
      materials: [
        {
          materialsName: '材料1',
          materialsSpecs: '12',
          materialsNum: '2',
          supplierName: '测',
        },
      ],
    };
    if (routeType === 'edit') {
      parms['applyId'] = detailInfo.applyId;
    }
    console.log('修改parms', parms);
    // let test = 1;
    // if (test === 1) {
    //   return;
    // }
    if (routeType === 'edit') {
      try {
        const res = await editExitApply(parms);
        if (res.data.code === 200) {
          props.navigation.goBack();
          Toast.success(res.data.message);
        } else {
          Toast.fail(res.data.message);
        }
        console.log(res.data.message);
      } catch (error) {
        console.error(error);
      }
    } else if (routeType === 'new') {
      try {
        const res = await addExitApply(parms);
        if (res.data.code === 200) {
          props.navigation.goBack();
          Toast.success(res.data.message);
        } else {
          Toast.fail(res.data.message);
        }
        console.log(res.data.message);
      } catch (error) {
        console.error(error);
      }
    }
  };
  // 审批（退场审核）
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
      const res = await approaveExitApply(parms);
      console.log('审批意见', res.data);
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
  // 编辑
  const confirmEditBtn = async () => {
    if (signContent.trim().length === 0) {
      return Toast.fail('请填写退场说明');
    }
    if (signFileurl.trim().length === 0) {
      return Toast.fail('请填写退场凭证');
    }
    let parms = {
      applyId: detailInfo.applyId,
      signContent,
      signFileurl,
      belongProject: global.userInfo.belongProject,
    };
    console.log('审批parms', parms);
    try {
      const res = await confirmExitApply(parms);
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
      console.log('材料名称', res.data);
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
  // 根据材料名称获取列表
  const getBillData = async (
    materialsName = null,
    supplierName = null,
    belongProject = null,
  ) => {
    let parms = {
      materialsName,
      supplierName,
      belongProject,
    };
    console.log('材料清单parms', parms);
    try {
      const res = await getBillList2(parms);
      if (res.data.code === 200) {
        console.log('材料清单', res.data);
        // let list = res.data.data || [];
        // setIsAll(true);
        // settableData(state => {
        //   return [...state, ...list];
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 上传图片（凭证）
  const showImg = async () => {
    SyanImagePicker.showImagePicker(imgOptions, async (err, photos) => {
      if (err) {
        // 取消选择
        console.log('取消');
        return;
      }
      let data = new FormData();
      data.append('files', {
        uri: photos[0].uri,
        name: new Date().valueOf() + '.jpg',
        type: 'image/jpeg',
      });
      data.append('type', 3);
      console.log(photos);
      try {
        const res = await upLoadFile(data);
        console.log('success', res.data);
        if (res.data.code === 200) {
          setsignFileurl(res.data.data);
        }
      } catch (error) {
        console.log('error', error);
      }
      // 选择成功，渲染图片
      // ...
    });
  };
  return (
    <View>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 编辑 */}
          {routeType === 'edit' || routeType === 'new' ? (
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
                            getBillData();
                            // searchMaterisName(text.trim(), item.id);
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
                <View style={styles.other_item2}>
                  <Text style={styles.other_title}>退场去向：</Text>
                  <View>
                    <ModalDropdown
                      defaultValue={exitDirecte}
                      options={EXIT_DIRECTION}
                      textStyle={styles.dropdownText}
                      dropdownStyle={styles.dropdownStyle}
                      dropdownTextStyle={styles.DropDownPickerText}
                      dropdownTextHighlightStyle={
                        styles.dropdownTextHighlightStyle
                      }
                      onSelect={value => {
                        setExitDirecte(EXIT_DIRECTION[value]);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.other_item2}>
                  <Text style={styles.other_title}>退场时间：</Text>
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
                  <Text style={styles.other_title}>退场去向：</Text>
                  <TextInput
                    style={styles.input_no_border}
                    placeholder="请输入"
                    editable={false}
                    value={exitDirecte}
                  />
                </View>
                <View style={styles.other_item2}>
                  <Text style={styles.other_title}>退场时间：</Text>
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
              </View>
            </View>
          )}
          {/* 审批流程 */}
          <View style={styles.other_item4}>
            <Text style={styles.other_title}>审批流程：</Text>
            <RenderApproach></RenderApproach>
          </View>
          <RenderApprovalComments></RenderApprovalComments>
          {/* 编辑 */}
          {routeType === 'confirm' && (
            <View>
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>退场说明：</Text>
                <TextInput
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderWidth: 0,
                    borderRadius: 5,
                    paddingLeft: 15,
                    textAlign: 'left',
                    textAlignVertical: 'top',
                    androidtextAlignVertical: 'top',
                    width: '70%',
                  }}
                  numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                  minHeight={
                    Platform.OS === 'ios' && numberOfLines
                      ? 20 * numberOfLines
                      : null
                  }
                  placeholder="输入说明"
                  multiline
                  // editable={false}
                  onChangeText={text => setSignContent(text)}
                  value={signContent}
                  maxLength={20}
                />
              </View>
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>上传凭证：</Text>
                <TouchableWithoutFeedback onPress={() => showImg()}>
                  <Image
                    style={{height: 100, marginLeft: 20, marginTop: -16}}
                    source={require('../../../assets/addPhoto.png')}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>
              </View>
              <View
                style={{
                  padding: 30,
                  marginBottom: 40,
                  width: '100%',
                }}>
                <Button
                  onPress={() => {
                    confirmEditBtn();
                  }}
                  type="primary">
                  退场
                </Button>
              </View>
            </View>
          )}
          {/* 修改/申请 */}
          {(routeType === 'edit' || routeType === 'new') && (
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
          {/* 审批(只有一个审批意见) */}
          {routeType === 'approave' && (
            <View>
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
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditExit;

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
