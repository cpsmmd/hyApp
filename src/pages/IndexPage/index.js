/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/**
 * @Author: cps
 * @Desc: 首页
 */
import React, {useEffect} from 'react';
import {View, Text, TouchableWithoutFeedback, Dimensions} from 'react-native';
import {dealFail} from '../../util/test';
// import {
//   Provider,
//   Toast,
//   WhiteSpace,
//   WingBlank,
//   portal,
// } from '@ant-design/react-native';
import {Button, Toast} from '@ant-design/react-native';
import {IconFill, IconOutline} from '@ant-design/icons-react-native';
import SyanImagePicker from 'react-native-syan-image-picker';
const {width} = Dimensions.get('window');
const imgOptions = {
  imageCount: 3, // 最大选择图片数目，默认6
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
const videoOptions = {
  videoCount: 1,
  isCamera: true,
  allowPickingGif: false,
  allowPickingVideo: true,
  allowPickingImage: false,
  allowPickingMultipleVideo: true,
  videoMaximumDuration: 20,
  MaxSecond: 60,
  MinSecond: 0,
  recordVideoSecond: 60,
};

const IndexPage = props => {
  useEffect(() => {
    console.log('333');
    console.log('开始');
  });
  const Login = () => {
    props.navigation.push('login');
  };
  const showImg = () => {
    SyanImagePicker.showImagePicker(imgOptions, (err, selectedPhotos) => {
      if (err) {
        // 取消选择
        return;
      }
      // 选择成功，渲染图片
      // ...
    });
  };
  const showVideo = () => {
    SyanImagePicker.openVideoPicker(videoOptions, (err, selectedPhotos) => {
      if (err) {
        // 取消选择
        return;
      }
      // 选择成功，渲染图片
      // ...
    });
  };
  return (
    <View>
      <Text>首页222</Text>
      <IconFill name="account-book" />
      <IconOutline name="account-book" />
      <TouchableWithoutFeedback
        onPress={() => {
          console.log(1);
          Toast.fail('Load failed !!!');
          // Login();
          // dealFail(props);
        }}>
        <Text style={{margin: 30, fontSize: 20}}>登录221</Text>
      </TouchableWithoutFeedback>
      <Button onPress={() => showImg()}>选择图片</Button>
      <Button onPress={() => showVideo()}>选择视频</Button>
    </View>
  );
};

export default IndexPage;
