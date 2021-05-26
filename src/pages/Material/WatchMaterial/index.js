/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-09 14:03:03
 * @LastEditTime: 2021-05-25 15:17:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Material/newMaterial/index.js
 */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  CameraRoll,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import {Button, Toast} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  LOG_TYPE,
  TYPELOG_OPTIONS,
  BSAE_IMAGE_URL,
} from '../../../util/constants';
import SyanImagePicker from 'react-native-syan-image-picker';
import {upLoadFile, getSignleFileLog} from '../../../api/user';
import ModalDropdown from 'react-native-modal-dropdown';
import {getLabel, addFileLog} from '../../../api/user';
const {width} = Dimensions.get('window');
const numberOfLines = 5;
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
export default function NewMaterial(props) {
  const id = props.route.params.id;
  const getLogType = props.route.params.logType;
  const [labelList, setLabelList] = useState([]);
  const [logName, setLogName] = useState('');
  const [logText, setLogText] = useState('');
  const [logPics, setLogPics] = useState([]);
  const [logDetail, setLogDeatil] = useState({
    logPics: [],
    fileUrl: [],
    labels: [],
  });
  const [logType, setLogType] = useState(1);
  const [labelType, setSetLabelType] = useState(1);
  const [labelDefault, setLabenDefault] = useState('选择标签类型');
  const [images, setImages] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    (async () => {
      await getLabelList();
      await getLogDetail();
    })();
  }, []);
  useEffect(() => {
    const navFocusListener = props.navigation.addListener('focus', async () => {
      await getLogDetail();
    });
    return () => {
      navFocusListener.remove();
    };
  }, []);
  const saveAll = async () => {
    let parms = {
      logName,
      logType,
      logText,
      logPics: JSON.stringify(logPics),
      logUser: global.userInfo.userName,
      // fileType: labelType,
      fileUrl: '[]',
    };
    console.log(parms);
    try {
      const res = await addFileLog(parms);
      if (res.data.code === 200) {
        Toast.success(res.data.message);
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getLabelList = async () => {
    let parms = {};
    try {
      const res = await getLabel(parms);
      let newLists = res.data.data || [];
      newLists.map(item => {
        item.isSelect = false;
      });
      setLabelList(newLists);
    } catch (error) {
      console.error(error);
    }
  };
  const getLogDetail = async () => {
    let parms = {
      id,
      logType: getLogType,
    };
    try {
      const res = await getSignleFileLog(parms);
      let info = res.data.data;
      info.logPics = JSON.parse(info.logPics) || [];
      info.fileUrl = JSON.parse(info.fileUrl) || [];
      info.labels = info.labels || [];
      console.log('info', info);
      setLogName(info.logName);
      setLogText(info.logText);
      setLogDeatil(info);
      setLogType(info.logType);
      // setSetLabelType(info.fileType);
      // let labelTypeValue = info.fileType
      //   ? TYPELOG_OPTIONS.find(v => v.value === info.fileType).name
      //   : '选择标签类型';
      // setLabenDefault(labelTypeValue);
      // 图片展示
      let image = [];
      info.logPics.map(v => {
        image.push({
          url: `${BSAE_IMAGE_URL}${v}?v=3&s=460`,
        });
      });
      setImages(image);
    } catch (error) {
      console.error(error);
    }
  };
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
        if (res.data.code === 200) {
          let newLists = [...logPics];
          newLists.push(res.data.data);
          setLogPics(newLists);
          console.log(logPics);
        }
      } catch (error) {
        console.log('error', error);
      }
      // 选择成功，渲染图片
      // ...
    });
  };
  const selectLabel = info => {
    let newList = [...labelList];
    newList.map(item => {
      if (item.id === info.id) {
        item.isSelect = !item.isSelect;
      }
    });
    setLabelList(newList);
  };
  // 保存图片
  const savePhoto = url => {
    console.log(url);
    // let index = this.props.curentImage;
    // let url = this.props.imaeDataUrl[index];
    let promise = CameraRoll.saveToCameraRoll(url);
    promise
      .then(function (result) {
        console.log('已保存到系统相册');
      })
      .catch(function (error) {
        console.log('保存失败！\n' + error);
      });
  };
  return (
    <View>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.new_material}>
              <View style={styles.items}>
                <Text style={styles.item_title}>记录人：</Text>
                <View style={styles.item_content}>
                  <Text style={styles.title_content}>{logDetail.logUser}</Text>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>时间：</Text>
                <View style={styles.item_content}>
                  <Text style={styles.title_content}>
                    {logDetail.createTime}
                  </Text>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>资料类型：</Text>
                <View style={styles.item_content}>
                  <Text style={styles.title_content}>
                    {logDetail.logType &&
                      LOG_TYPE.find(v => v.value === logDetail.logType).name}
                  </Text>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>名称：</Text>
                <View style={styles.item_content}>
                  <Text style={styles.title_content}>{logName}</Text>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>详情：</Text>
                <View style={styles.item_content}>
                  <Text style={styles.title_content}>{logText}</Text>
                </View>
              </View>
              <View style={(styles.items, {display: 'none'})}>
                <Text style={styles.item_title}>标签类型：</Text>
                <View style={styles.item_content}>
                  <Text style={styles.title_content}>
                    {logDetail.fileType &&
                      TYPELOG_OPTIONS.find(v => v.value === logDetail.fileType)
                        .name}
                  </Text>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>标签ID：</Text>
                <View style={styles.item_content}>
                  <View
                    style={{
                      display: 'flex',
                      // justifyContent: 'space-between',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {logDetail.labels.length > 0 &&
                      logDetail.labels.map(item => (
                        <TouchableWithoutFeedback>
                          <Text style={styles.default_label} key={item.id}>
                            {item.labelName}
                          </Text>
                        </TouchableWithoutFeedback>
                      ))}
                  </View>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>照片：</Text>
                <View style={styles.item_content}>
                  {logDetail.logPics.length > 0 ? (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}>
                      {logDetail.logPics.map(item => (
                        <View key={item}>
                          <TouchableWithoutFeedback
                            onPress={() => {
                              setModalShow(true);
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
                  ) : (
                    <Text style={styles.title_content}>无</Text>
                  )}
                </View>
              </View>
              <View style={(styles.items, {display: 'none'})}>
                <Text style={styles.item_title}>文件：</Text>
                <View style={styles.item_content}>
                  {logDetail.fileUrl.length > 0 ? (
                    <Text>文件</Text>
                  ) : (
                    <Text style={styles.title_content}>无</Text>
                  )}
                </View>
              </View>
              {logDetail.idCard === global.userInfo.idCard && (
                <View style={{padding: 20}}>
                  <Button
                    onPress={() => {
                      props.navigation.push('editMaterial', {
                        id: logDetail.id,
                        logType: logDetail.logType,
                      });
                    }}
                    type="primary">
                    修改
                  </Button>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal visible={modalShow} transparent={true}>
        <ImageViewer
          onClick={() => {
            // 图片单击事件
            setModalShow(false);
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
}

const styles = StyleSheet.create({
  new_material: {
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  items: {
    marginBottom: 10,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  item_title: {
    fontSize: 18,
    marginRight: 6,
  },
  item_content: {
    flex: 1,
    justifyContent: 'center',
  },
  item_content_color: {
    color: '#666',
    fontSize: 16,
  },
  dropdownText: {
    color: '#666',
    fontSize: 18,
  },
  dropdownStyle: {
    color: 'red',
    padding: 10,
  },
  DropDownPickerText: {
    color: 'red',
    padding: 10,
    fontSize: 20,
  },
  row_sty: {
    color: '#999',
    padding: 8,
    fontSize: 16,
  },
  dropdownTextHighlightStyle: {
    color: 'red',
  },
  default_label: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#bebebe',
    borderRadius: 5,
    marginRight: 5,
    marginTop: 6,
  },
  default_label_active: {
    color: '#52c41a',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  title_content: {
    color: '#666',
    fontSize: 16,
  },
});
