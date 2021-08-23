/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-07-11 15:34:33
 * @LastEditTime: 2021-08-23 20:24:34
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
  Dimensions,
  Modal,
} from 'react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import StuffLists2 from '../component/stuffLists2';
import StuffLists3 from '../component/stuffLists3';
import StuffListsReturn from '../component/stuffListsReturn';
import {Button, Toast} from '@ant-design/react-native';
import {BSAE_IMAGE_URL} from '../../../util/constants';
import {
  reviewOutputApply,
  approaveOutputApply,
  updateOutputApply,
  addOutputApply,
  reardOutputApply,
  returnOutputApply,
  returnConfirmOutputApply,
  getBillList2,
} from '../../../api/stuff';
import {upLoadFile} from '../../../api/user';
import dealFail from '../../../util/common';
const numberOfLines = 3;
let defaultData = {
  materialsName: '',
  materialsSpecs: '',
  materialsNum: '',
  supplierName: '',
  guigelist: [],
  supernameList: [],
  id: Math.random().toString(16),
};
let menuObj = {
  detail: '详情',
  edit: '仓库管理员确认',
  modify: '修改',
  new: '发起申请',
  approave: '出库审批',
  confirm: '确认归还',
  return: '归还',
  review: '复核',
  editTotype2: '申请详情', //待申请人确认
};
let roleObj = {
  0: '申请人',
  1: '专业',
  2: '库管员',
  3: '其他审批人',
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
const EditOutput = props => {
  const routeType = props.route.params.type;
  const routeId = props.route.params.id;
  const [detailInfo, setDetailInfo] = useState({});
  const [stuffLists, setstuffLists] = useState([defaultData]);
  const [dateEnd, setDateEnd] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [timeMode, settimeMode] = useState('date');

  const [purpose, setpPurpose] = useState('');
  const [theme, setTheme] = useState(''); // 申请主题

  const [approvalData, setApprovalData] = useState({});
  const [confirmMaterials, setconfirmMaterials] = useState([]); // 库管理员确认信息
  const [returnMaterials, setreturnMaterials] = useState([]); // 归还材料信息
  const [returnImgs, setreturnImgs] = useState([]); // 归还凭证图片
  // 模糊搜索材料名称
  const [allMaterialLists, setallMaterialLists] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  // 审批
  const [content, setContent] = useState('');
  // 复核 签收
  const [logPics, setLogPics] = useState([]);
  const [signContent, setSignContent] = useState(''); // 上传签收说明
  // 确认归还
  const [confirmList, setrconfirmList] = useState([]); // 确认归还凭证
  // 编辑 待库管理员确认信息
  const [materiasEdit, setmateriasEdit] = useState([]);

  // 查看签收凭证
  // 查看图片
  const [imageModal, setimageModal] = useState(false);
  const [images, setimages] = useState([]);
  const [imageModal2, setimageModal2] = useState(false);
  const [images2, setimages2] = useState([]);
  // 设置标题
  useEffect(() => {
    props.navigation.setOptions({
      title: menuObj[props.route.params.type],
    });
    (async () => {
      if (routeType !== 'new') {
        let newlist = [];
        if (routeType === 'edit') {
          newlist = await getAllBillData();
        }
        getDetail(newlist);
      }
    })();
  }, []);
  // 获取详情
  const getDetail = async bills => {
    console.log('出库详情', props.route.params.id);
    try {
      const res = await reardOutputApply(props.route.params.id);
      if (res.data.code === 200) {
        let info = res.data.data;
        let newmaterials = info.materials || [];
        newmaterials.map(v => {
          v.guigelist = [];
          v.supernameList = [];
        });
        setDetailInfo(info);
        setstuffLists(newmaterials);
        setTheme(info.theme);
        setDate(info.useTime);
        setpPurpose(info.purpose);
        setApprovalData(info.approvalProcedureDtos);
        setconfirmMaterials(info.confirmMaterials);
        setreturnMaterials(info.returnMaterials || []);
        // 归还凭证图片
        let imgs = JSON.parse(info.returnFileurl) || [];
        let imgr = [];
        imgs.map(vv => {
          imgr.push({
            url: `${BSAE_IMAGE_URL}${vv}?v=3&s=460`,
          });
        });
        setimages2(imgr);
        setreturnImgs(imgs);
        if (routeType === 'edit') {
          // 当时待库管理员确认时
          let list2 = info.materials || [];
          list2.map(v => {
            v.supernameList = bills.filter(
              b =>
                v.materialsName === b.materialsName &&
                v.materialsSpecs === b.materialsSpecs,
            );
          });
          setmateriasEdit([...list2]);
        }
        if (routeType === 'confirm') {
          let listss = [...info.confirmMaterials];
          listss.map(v => {
            v.supplierNames.map(v2 => {
              v2.outboundNum2 = v2.outboundNum;
            });
          });
          setrconfirmList([...info.confirmMaterials]);
        }
        // 签收查看图片
        let imgq = [];
        info.approvalProcedureDtos.map(v1 => {
          if (v1.outConfirm) {
            let imgs2 = JSON.parse(v1.outConfirm.signFileurl) || [];
            imgs2.map(v2 => {
              imgq.push({
                url: `${BSAE_IMAGE_URL}${v2}?v=3&s=460`,
              });
            });
          }
        });
        setimages(imgq);
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
      if (item.supplierName === '') {
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
    let newData = {
      materialsName: '',
      materialsSpecs: '',
      materialsNum: '',
      supplierName: '',
      guigelist: [],
      supernameList: [],
      id: Math.random().toString(16),
    };
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
    newList.splice(num, 1);
    setstuffLists(newList);
  };
  // 修改提交材料 done
  const submit = async () => {
    let materials = [];
    stuffLists.forEach(item => {
      materials.push({
        materialsName: item.materialsName,
        materialsSpecs: item.materialsSpecs,
        materialsNum: item.materialsNum,
        supplierName: item.supplierName,
      });
    });
    let parms = {
      theme,
      purpose,
      useTime: JSON.stringify(date).substring(1, 11),
      belongProject: global.userInfo.belongProject,
      materials,
      // idCard: global.userInfo.idCard,
    };
    if (routeType === 'modify') {
      parms.applyId = detailInfo.applyId;
    }
    console.log('出库管理parms', parms);
    // let test = 1;
    // if (test === 1) {
    //   return;
    // }
    if (routeType === 'modify') {
      try {
        const res = await updateOutputApply(parms);
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
      console.log('new');
      try {
        const res = await addOutputApply(parms);
        console.log(res);
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
  // 审批（done）
  const changeStatus = async state => {
    if (content.trim().length === 0) {
      return Toast.fail('请填写审批意见');
    }
    let parms = {
      state,
      applyId: detailInfo.applyId,
      content,
      belongProject: global.userInfo.belongProject,
      materials: [],
    };
    console.log('审批parms', parms);
    try {
      const res = await approaveOutputApply(parms);
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
  // 复核签收（done）
  const reviewBtn = async () => {
    if (signContent.trim().length === 0) {
      return Toast.fail('请填写签收说明');
    }
    if (logPics.length === 0) {
      return Toast.fail('请上传凭证');
    }
    let parms = {
      applyId: detailInfo.applyId,
      signContent,
      signFileurl: JSON.stringify(logPics),
      belongProject: global.userInfo.belongProject,
    };
    console.log('复核parms', parms);
    try {
      const res = await reviewOutputApply(parms);
      if (res.data.code === 200) {
        Toast.success(res.data.message);
        props.navigation.goBack();
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // 归还(done)
  const returnBtn = async () => {
    let parms = {
      applyId: detailInfo.applyId,
      belongProject: global.userInfo.belongProject,
    };
    console.log('归还parms', parms);
    try {
      const res = await returnOutputApply(parms);
      if (res.data.code === 200) {
        Toast.success(res.data.message);
        props.navigation.goBack();
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // 确认归还（ 1.16 App出库归还确认）
  const confirmBack = async () => {
    if (logPics.length === 0) {
      return Toast.fail('请上传凭证');
    }
    console.log('hhhhh', JSON.stringify(confirmList));
    let materials = [];
    let isOk1 = true;
    let isOk2 = true;
    confirmList.forEach(item => {
      let supplierNames = [];
      item.supplierNames.map(v => {
        if (isNaN(v.outboundNum)) {
          isOk1 = false;
        }
        if (v.outboundNum * 1 > v.outboundNum2 * 1) {
          isOk2 = false;
        }
        supplierNames.push({
          outboundNum: v.outboundNum,
          supplierName: v.supplierName,
        });
      });
      materials.push({
        materialsName: item.materialsName,
        materialsSpecs: item.materialsSpecs,
        outboundApplyId: item.outboundApplyId,
        supplierNames,
      });
    });
    if (!isOk1) {
      return Toast.fail('归还数量为数字');
    }
    if (!isOk2) {
      return Toast.fail('规划数量不能大于领取数量');
    }
    let parms = {
      applyId: detailInfo.applyId,
      returnFileurl: JSON.stringify(logPics),
      belongProject: global.userInfo.belongProject,
      materials,
    };
    console.log('确认归还parms', parms);
    let test = 1;
    if (test === 1) {
      return;
    }
    try {
      const res = await returnConfirmOutputApply(parms);
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
  // 编辑(待仓库管理员确认) -done
  const editBtn = async state => {
    if (signContent.trim().length === 0) {
      return Toast.fail('请填写审批意见');
    }
    console.log(materiasEdit);
    let mlist = [];
    materiasEdit.map(v => {
      mlist.push({
        materialsName: v.materialsName,
        materialsSpecs: v.materialsSpecs,
        outboundApplyId: v.outboundApplyId,
        supplierNames: [
          {
            supplierName: v.supplierName,
            outboundNum: v.materialsNum,
          },
        ],
      });
    });
    let parms = {
      state,
      applyId: detailInfo.applyId,
      content,
      belongProject: global.userInfo.belongProject,
      materials: mlist,
    };
    console.log('审批parms', parms);
    try {
      const res = await approaveOutputApply(parms);
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
  // 编辑(待申请人确认)(done)
  const editTotype2Btn = async state => {
    let parms = {
      state,
      applyId: detailInfo.applyId,
      content: null,
      belongProject: global.userInfo.belongProject,
      materials: [],
    };
    console.log('待申请人确认parms', parms);
    try {
      const res = await approaveOutputApply(parms);
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
                <Text style={{backgroundColor: '#fff', color: '#808695'}}>
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
                出库确认时间：{info.signTime}
              </Text>
            </View>
          </View>
          <View style={styles.other_item3}>
            <Text style={styles.other_title}>签收凭证：</Text>
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
                        setimageModal(true);
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
  // 上传图片（凭证）
  const showReviewImg = async () => {
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
          // setsignFileurl(res.data.data);
          let newLists = [...logPics];
          newLists.push(res.data.data);
          setLogPics(newLists);
        }
      } catch (error) {
        console.log('error', error);
      }
      // 选择成功，渲染图片
      // ...
    });
  };
  // 根据材料名称获取列表
  const getBillData = async (materialsName = null, supplierName = null) => {
    let parms = {
      materialsName,
      supplierName,
      belongProject: global.userInfo.belongProject,
    };
    console.log('材料清单parms', parms);
    try {
      const res = await getBillList2(parms);
      if (res.data.code === 200) {
        let list = res.data.data || [];
        let list2 = [];
        list.map(v => {
          let list3 = list2.filter(v2 => v2.materialsName === v.materialsName);
          if (list3 && list3.length) {
          } else {
            list2.push(v);
          }
        });
        setMaterialsList(list2);
        setallMaterialLists(list);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 根据材料名称获取所有列表
  const getAllBillData = () => {
    return new Promise(async resolve => {
      let parms = {
        materialsName: null,
        supplierName: null,
        belongProject: global.userInfo.belongProject,
      };
      try {
        const res = await getBillList2(parms);
        if (res.data.code === 200) {
          let list = res.data.data || [];
          // let list2 = [];
          // list.map(v => {
          //   let list3 = list2.filter(v2 => v2.materialsName === v.materialsName);
          //   if (list3 && list3.length) {
          //   } else {
          //     list2.push(v);
          //   }
          // });
          resolve(list);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  const renderMateriaName = (item, index) => (
    <AutocompleteItem key={item.id} title={item.materialsName} />
  );
  return (
    <View>
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 申请/ 修改 */}
          {routeType === 'modify' || routeType === 'new' ? (
            <>
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
                                let name = materialsList[index].materialsName;
                                v.materialsName = name;
                                let news =
                                  allMaterialLists.filter(
                                    c => c.materialsName === name,
                                  ) || [];
                                v.guigelist = news;
                                v.materialsSpecs = '选择';
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
                            getBillData(text.trim());
                          }}>
                          {materialsList.map(renderMateriaName)}
                        </Autocomplete>
                      </View>
                      {item.materialsName.length ? (
                        <>
                          <Text style={styles.stuff_item_title}>规格：</Text>
                          <Select
                            style={{width: 120}}
                            value={item.materialsSpecs}
                            onSelect={info => {
                              let newList = [...stuffLists];
                              newList.map(v => {
                                if (v.id === item.id) {
                                  v.materialsSpecs =
                                    item.guigelist[info.row].materialsSpecs;
                                  let news =
                                    item.guigelist.filter(
                                      n =>
                                        n.materialsSpecs ===
                                        item.materialsSpecs,
                                    ) || [];
                                  v.supernameList = news;
                                }
                              });
                              setstuffLists(newList);
                            }}>
                            {item.guigelist.map(v => (
                              <SelectItem title={v.materialsSpecs} />
                            ))}
                          </Select>
                        </>
                      ) : null}
                    </View>
                    {item.materialsSpecs.length ? (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text style={styles.stuff_item_title}>
                          供应商名称：
                        </Text>
                        <Select
                          style={{width: 160}}
                          value={item.supplierName}
                          onSelect={info => {
                            let newList = [...stuffLists];
                            newList.map(v => {
                              if (v.id === item.id) {
                                v.supplierName =
                                  item.supernameList[info.row].supplierName;
                              }
                            });
                            setstuffLists(newList);
                          }}>
                          {item.supernameList.map(v => (
                            <SelectItem title={v.supplierName} />
                          ))}
                        </Select>
                      </View>
                    ) : null}
                    <View style={[styles.flex_row, {marginTop: 10}]}>
                      {item.materialsSpecs.length ? (
                        <>
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
                        </>
                      ) : null}
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
                    onChangeText={text => setpPurpose(text)}
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
            // 详情
            <View>
              <Text style={{color: '#1890ff', fontSize: 16, padding: 12}}>
                基本信息
              </Text>
              <View style={{backgroundColor: '#fff', paddingLeft: 20}}>
                <StuffLists2 data={stuffLists} />
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
                    <Text style={styles.other_title}>材料用途：</Text>
                    <TextInput
                      style={styles.input_no_border}
                      placeholder="请输入"
                      editable={false}
                      onChangeText={text => setpPurpose(text)}
                      value={purpose}
                    />
                  </View>
                  <View style={styles.other_item2}>
                    <Text style={styles.other_title}>领用时间：</Text>
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
            </View>
          )}
          {/* 审批流程 */}
          {routeType !== 'new' && (
            <View>
              {/* 库管理员确认信息 */}
              {confirmMaterials.length > 0 ? (
                <View>
                  <Text style={{color: '#1890ff', fontSize: 16, padding: 12}}>
                    库管理员确认信息
                  </Text>
                  <View style={{backgroundColor: '#fff', paddingLeft: 20}}>
                    <StuffLists3 data={confirmMaterials} />
                  </View>
                </View>
              ) : null}
              {/* 审批流程 */}
              {approvalData.length ? (
                <View>
                  <Text style={{color: '#1890ff', fontSize: 16, padding: 12}}>
                    审批流程
                  </Text>
                  <View style={{backgroundColor: '#fff', paddingLeft: 20}}>
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
                        <RenderApprovalComments
                          data={item.hyApproachApprovals}
                        />
                        <RenderOutConfirm data={item.outConfirm} />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
              {/* 归还材料信息 */}
              {returnMaterials.length ? (
                <View>
                  <Text style={{color: '#1890ff', fontSize: 16, padding: 12}}>
                    归还材料信息
                  </Text>
                  <View style={{backgroundColor: '#fff', paddingLeft: 20}}>
                    <StuffListsReturn data={returnMaterials}></StuffListsReturn>
                  </View>
                  {returnImgs.length ? (
                    <View style={styles.other_item3}>
                      <Text style={styles.other_title}>归还凭证：</Text>
                      <View style={{flex: 1}}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                          }}>
                          {returnImgs.map(item => (
                            <View key={item}>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  setimageModal2(true);
                                }}>
                                <Image
                                  style={{
                                    height: 160,
                                    width: 160,
                                    marginBottom: 10,
                                  }}
                                  source={{uri: `${BSAE_IMAGE_URL}${item}`}}
                                  resizeMode="contain"
                                />
                              </TouchableWithoutFeedback>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          )}
          {/* 复核(签收) */}
          {routeType === 'review' && (
            <View>
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>签收说明：</Text>
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
                <TouchableWithoutFeedback onPress={() => showReviewImg()}>
                  <Image
                    style={{height: 100, marginLeft: 20, marginTop: -16}}
                    source={require('../../../assets/addPhoto.png')}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                  }}>
                  {logPics.map(item => (
                    <View key={item} style={{position: 'relative'}}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          // 删除图片
                          let arr = [...logPics];
                          const Index = arr.findIndex(v => v === item);
                          arr.splice(Index, 1);
                          setLogPics(arr);
                        }}>
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            position: 'absolute',
                            right: 0,
                            top: -10,
                            zIndex: 100,
                          }}
                          source={require('../../../assets/del.png')}
                          resizeMode="contain"
                        />
                      </TouchableWithoutFeedback>
                      <Image
                        style={{height: 160, width: 160, marginBottom: 10}}
                        source={{uri: `${BSAE_IMAGE_URL}${item}`}}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              </View>
              <View
                style={{
                  padding: 30,
                  marginBottom: 40,
                  width: '100%',
                }}>
                <Button
                  onPress={() => {
                    reviewBtn();
                  }}
                  type="primary">
                  签收
                </Button>
              </View>
            </View>
          )}
          {/* 归还（申请人 已出库） */}
          {routeType === 'return' && (
            <View
              style={{
                padding: 30,
                marginBottom: 40,
                width: '100%',
              }}>
              <Button
                onPress={() => {
                  returnBtn();
                }}
                type="primary">
                归还
              </Button>
            </View>
          )}
          {/* 编辑（仓库责任人确认）btn */}
          {routeType === 'edit' && (
            <View>
              <Text style={{color: '#1890ff', fontSize: 16, padding: 12}}>
                库管理员确认信息
              </Text>
              <View style={{backgroundColor: '#fff', paddingLeft: 20}}>
                {materiasEdit.map(v => {
                  return (
                    <View key={v.id} style={{marginTop: 10}}>
                      <View style={styles.flex_row}>
                        <View style={[styles.flex_row, {flex: 1}]}>
                          <Text style={styles.title}>材料名称：</Text>
                          <Text style={styles.value}>{v.materialsName}</Text>
                        </View>
                        <View style={[styles.flex_row, {flex: 1}]}>
                          <Text style={styles.title}>规格：</Text>
                          <Text style={styles.value}>{v.materialsSpecs}</Text>
                        </View>
                      </View>
                      <View style={styles.flex_row}>
                        <Text>供应商名称：</Text>
                        <Select
                          style={{width: 160}}
                          value={v.supplierName}
                          onSelect={info => {
                            let newList = [...stuffLists];
                            newList.map(v2 => {
                              if (v.id === v2.id) {
                                v.supplierName =
                                  v.supernameList[info.row].supplierName;
                              }
                            });
                            setstuffLists(newList);
                          }}>
                          {v.supernameList.map(v => (
                            <SelectItem title={v.supplierName} />
                          ))}
                        </Select>
                      </View>
                      <View style={styles.flex_row}>
                        <Text>领用数量：</Text>
                        <TextInput
                          onChangeText={text => {
                            let newList = [...stuffLists];
                            newList.map(v2 => {
                              if (v.id === v2.id) {
                                v.materialsNum = text;
                              }
                            });
                            setstuffLists(newList);
                          }}
                          value={v.materialsNum.toString()}
                          style={styles.input_sty}
                          placeholder="请输入"
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
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
                    width: '70%',
                  }}
                  numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                  minHeight={
                    Platform.OS === 'ios' && numberOfLines
                      ? 20 * numberOfLines
                      : null
                  }
                  placeholder="请输入"
                  multiline
                  onChangeText={text => setSignContent(text)}
                  value={signContent}
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
                    editBtn(1);
                  }}>
                  <View
                    style={{
                      backgroundColor: '#19be6b',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      height: 38,
                      width: 100,
                      marginRight: 30,
                    }}>
                    <Text style={{color: '#FFF', fontSize: 14, lineHeight: 17}}>
                      同意领用
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    editBtn(0);
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
          {/* 提交 (申请 / 修改)*/}
          {(routeType === 'modify' || routeType === 'new') && (
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
          {/* 审批(done) */}
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
          {/* 确认归还 */}
          {routeType === 'confirm' && (
            <View>
              <Text style={{color: '#1890ff', fontSize: 16, padding: 12}}>
                归还材料信息
              </Text>
              {confirmList.map((item, index) => (
                <View key={item.id} style={styles.stuff_items}>
                  <View style={styles.flex_row}>
                    <Text style={styles.stuff_item_title}>材料名称：</Text>
                    <Text
                      style={{color: '#999', fontSize: 14, marginRight: 20}}>
                      {item.materialsName}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: 'auto',
                        marginRight: 20,
                      }}>
                      <Text style={styles.stuff_item_title}>规格：</Text>
                      <Text style={{color: '#999', fontSize: 14}}>
                        {item.materialsSpecs}
                      </Text>
                    </View>
                  </View>
                  {item.supplierNames.map(vc => (
                    <View
                      key={vc.supplierName}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <View style={styles.flex_row}>
                        <Text style={styles.stuff_item_title}>
                          供应商名称：
                        </Text>
                        <Text style={{color: '#999', fontSize: 14}}>
                          {vc.supplierName}
                        </Text>
                      </View>
                      <View style={styles.flex_row}>
                        <Text
                          style={[styles.stuff_item_title, {marginLeft: 10}]}>
                          归还数量：
                        </Text>
                        <TextInput
                          onChangeText={text => {
                            if (text * 1 > vc.outboundNum2 * 1) {
                              Toast.fail('规划数量不能大于领取数量');
                            }
                            let newList = [...confirmList];
                            newList.map(vv => {
                              if (vv.materialsName === item.materialsName) {
                                vv.supplierNames.map(vb => {
                                  if (vb.supplierName === vc.supplierName) {
                                    vb.outboundNum = text;
                                  }
                                });
                              }
                            });
                          }}
                          value={vc.outboundNum}
                          style={styles.input_sty}
                          placeholder="请输入"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              ))}
              <View style={styles.other_item3}>
                <Text style={styles.other_title}>上传凭证：</Text>
                <TouchableWithoutFeedback onPress={() => showReviewImg()}>
                  <Image
                    style={{height: 100, marginLeft: 20, marginTop: -16}}
                    source={require('../../../assets/addPhoto.png')}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                  }}>
                  {logPics.map(item => (
                    <View key={item} style={{position: 'relative'}}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          // 删除图片
                          let arr = [...logPics];
                          const Index = arr.findIndex(v => v === item);
                          arr.splice(Index, 1);
                          setLogPics(arr);
                        }}>
                        <Image
                          style={{
                            height: 30,
                            width: 30,
                            position: 'absolute',
                            right: 0,
                            top: -10,
                            zIndex: 100,
                          }}
                          source={require('../../../assets/del.png')}
                          resizeMode="contain"
                        />
                      </TouchableWithoutFeedback>
                      <Image
                        style={{height: 160, width: 160, marginBottom: 10}}
                        source={{uri: `${BSAE_IMAGE_URL}${item}`}}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </View>
              </View>
              <View
                style={{
                  padding: 30,
                  marginBottom: 40,
                  width: '100%',
                }}>
                <Button
                  onPress={() => {
                    confirmBack();
                  }}
                  type="primary">
                  确认归还
                </Button>
              </View>
            </View>
          )}
          {/* 待申请人确认【editTotype2】 done */}
          {routeType === 'editTotype2' && (
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
                  editTotype2Btn(1);
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
                    确认
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  editTotype2Btn(0);
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
                    终止
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
      <Modal visible={imageModal2} transparent={true}>
        <ImageViewer
          onClick={() => {
            // 图片单击事件
            setimageModal2(false);
          }}
          enableImageZoom={true} // 是否开启手势缩放
          saveToLocalByLongPress={false} //是否开启长按保存
          // menuContext={{saveToLocal: '保存图片', cancel: '取消'}}
          imageUrls={images2}
          // onSave={url => {
          //   savePhoto(url);
          // }}
        />
      </Modal>
    </View>
  );
};

export default EditOutput;

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
    marginTop: 2,
    marginBottom: 2,
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
    paddingBottom: 16,
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
    paddingVertical: 12,
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
  borderStyle: {
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
  },
});
