// import {
//   Provider,
//   Button,
//   Toast,
//   WhiteSpace,
//   WingBlank,
//   portal,
// } from '@ant-design/react-native';
export const dealFail = props => {
  // 判断状态吗
  // Toast.fail('Load failed !!!');
  props.navigation.push('login');
};
