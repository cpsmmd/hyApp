/* eslint-disable react-native/no-inline-styles */
/*
 * @Author: your name
 * @Date: 2021-05-09 14:03:03
 * @LastEditTime: 2021-05-10 00:54:53
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
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import {Button, Toast} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
import {upLoadFile} from '../../../api/user';
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
export default function NewMaterial() {
  const [labelList, setLabelList] = useState([]);
  const [logType, setSetLogType] = useState(0);
  const [labelType, setSetLabelType] = useState(0);
  const [logName, setLogName] = useState('');
  const [logText, setLogText] = useState('');
  const [logPics, setLogPics] = useState([]);
  useEffect(() => {
    (async () => {
      await getLabelList();
    })();
  }, []);
  const saveAll = async () => {
    let parms = {
      logName,
      logType,
      logText,
      logPics: JSON.stringify(logPics),
      logUser: global.userInfo.userName,
      fileType: labelType,
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
  const showImg = async () => {
    // try {
    //   const photos = await SyanImagePicker.showImagePicker(imgOptions);
    //   console.log(photos);
    // } catch (err) {
    //   console.log(err.message);
    // }
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
  const TYPELOG_OPTIONS = [
    {name: '施工日志', value: 1},
    {name: '安全日志', value: 2},
    {name: '其他资料', value: 3},
  ];
  const selectLabel = info => {
    let newList = [...labelList];
    newList.map(item => {
      if (item.id === info.id) {
        item.isSelect = !item.isSelect;
      }
    });
    setLabelList(newList);
  };
  const TYPELABEL_OPTIONS = [
    {name: '图纸', value: 1},
    {name: '技术资料', value: 2},
    {name: '事故报告', value: 3},
    {name: '产品资料', value: 4},
  ];
  return (
    <View>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <ScrollView>
            <View style={styles.new_material}>
              <View style={styles.items}>
                <Text style={styles.item_title}>资料类型：</Text>
                <View style={styles.item_content}>
                  <ModalDropdown
                    defaultValue={'选择日志类型'}
                    options={TYPELOG_OPTIONS}
                    renderButtonText={({name}) => name}
                    renderRow={({name}) => (
                      <Text style={styles.row_sty}>{name}</Text>
                    )}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.DropDownPickerText}
                    dropdownTextHighlightStyle={
                      styles.dropdownTextHighlightStyle
                    }
                    onSelect={(value, item) => {
                      setSetLogType(item.value);
                    }}
                  />
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>名称：</Text>
                <View style={styles.item_content}>
                  <TextInput
                    style={{
                      height: 40,
                      backgroundColor: '#EEEEEE',
                      borderWidth: 0,
                      borderRadius: 5,
                      paddingLeft: 15,
                    }}
                    placeholder="昵称"
                    onChangeText={text => setLogName(text)}
                    value={logName}
                  />
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>详情：</Text>
                <View style={styles.item_content}>
                  <TextInput
                    style={{
                      backgroundColor: '#EEEEEE',
                      borderWidth: 0,
                      borderRadius: 5,
                      paddingLeft: 15,
                      textAlign: 'left',
                      textAlignVertical: 'top',
                      androidtextAlignVertical: 'top',
                    }}
                    numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                    minHeight={
                      Platform.OS === 'ios' && numberOfLines
                        ? 20 * numberOfLines
                        : null
                    }
                    placeholder="描述"
                    multiline
                    editable
                    onChangeText={text => setLogText(text)}
                    value={logText}
                  />
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>标签类型：</Text>
                <View style={styles.item_content}>
                  <ModalDropdown
                    defaultValue={'选择标签类型'}
                    options={TYPELABEL_OPTIONS}
                    renderButtonText={({name}) => name}
                    renderRow={({name}) => (
                      <Text style={styles.row_sty}>{name}</Text>
                    )}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.DropDownPickerText}
                    dropdownTextHighlightStyle={
                      styles.dropdownTextHighlightStyle
                    }
                    onSelect={(value, item) => {
                      setSetLabelType(item.value);
                    }}
                  />
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>标签ID：</Text>
                <View style={styles.item_content}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                    }}>
                    {labelList.map(item => (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          selectLabel(item);
                        }}>
                        <Text
                          style={[
                            styles.default_label,
                            item.isSelect && styles.default_label_active,
                          ]}
                          key={item.id}>
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
                  <TouchableWithoutFeedback onPress={() => showImg()}>
                    <Image
                      style={{height: 100, marginTop: 2}}
                      source={require('../../../assets/addPhoto.png')}
                      resizeMode="contain"
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={styles.items}>
                <Text style={styles.item_title}>文件：</Text>
                <View style={styles.item_content}>
                  <Button style={{width: 80}} type="ghost">
                    上传
                  </Button>
                </View>
              </View>
              <View style={{padding: 20}}>
                <Button
                  onPress={() => {
                    saveAll();
                  }}
                  type="primary">
                  保存提交
                </Button>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  new_material: {
    backgroundColor: '#fff',
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
});
