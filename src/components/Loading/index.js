import React from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Animated, // 这两个都是要引入的
  Easing,
} from 'react-native';
import RNC from 'react-native-css';
//import Modal from 'react-native-modal';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
    this.dot1Value = new Animated.Value(0);
    this.dot2Value = new Animated.Value(0);
    this.dot3Value = new Animated.Value(0);

    this.animationLoading = Animated.sequence([
      // 并行执行（）
      Animated.parallel([
        Animated.timing(
          this.dot1Value, // 初始值
          {
            toValue: 1, // 终点值
            duration: 2000,
            easing: Easing.linear, // 这里使用匀速曲线，详见RN-api-Easing
          },
        ),
        Animated.timing(
          this.dot2Value, // 初始值
          {
            toValue: 1, // 终点值
            duration: 2000,
            easing: Easing.linear, // 这里使用匀速曲线，详见RN-api-Easing
          },
        ),
        Animated.timing(
          this.dot3Value, // 初始值
          {
            toValue: 1, // 终点值
            duration: 2000,
            easing: Easing.linear, // 这里使用匀速曲线，详见RN-api-Easing
          },
        ),
        // 旋转
        Animated.timing(this.spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
        }),
      ]),
    ]);

    this.state = {
      isVisible: false,
      title: '正在加载…',
    };
  }

  componentDidMount() {
    this.loading();
  }

  componentWillUnmount() {
    Animated.loop(this.animationLoading).stop;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const oldState = nextProps.isVisible;
    const newState = this.props.isVisible;

    if (!oldState && newState) {
      this.loading();
      return true;
    }

    return false;
  }

  show = title => {
    this.setState(
      {
        isVisible: true,
        title,
      },
      () => {
        this.loading();
      },
    );
  };

  hide = () => {
    this.setState(
      {
        isVisible: false,
      },
      () => {
        Animated.loop(this.animationLoading).stop;
      },
    );
  };

  loading = () => {
    this.dot1Value.setValue(0);
    this.dot2Value.setValue(0);
    this.dot3Value.setValue(0);
    this.spinValue.setValue(0);

    Animated.loop(this.animationLoading).start(); // 开始动画
  };

  goBack = () => {
    this.props.goBack();
  };

  render() {
    const {title = '正在加载…', style} = this.props;

    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: '#f1f2f3',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 200,
          },
          style,
        ]}>
        <View
          style={[
            {
              margin: 0,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 110,
              height: 110,
              borderRadius: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          ]}>
          <View style={{}}>
            <Animated.View
              style={{
                //    backgroundColor: '#000',
                width: 60,
                height: 60,
                transform: [
                  {
                    // 动画属性
                    rotate: this.spinValue.interpolate({
                      inputRange: [0, 0.3, 0.65, 1],
                      outputRange: ['0deg', '360deg', '360deg', '360deg'],
                    }),
                  },
                ],
              }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  position: 'absolute',
                  top: 20,
                  left: 20,
                }}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        // 动画属性
                        scale: this.dot1Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 1],
                          outputRange: [0.45, 0.45, 1, 1, 0.45],
                        }),
                      },
                      {
                        translateY: this.dot1Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 0.8, 0.9, 1],
                          outputRange: [-40, -40, 0, 0, -12, -12, -40],
                        }),
                      },
                    ],
                  }}>
                  <View
                    style={[styles.dot, {backgroundColor: '#6335FF'}]}></View>
                </Animated.View>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  position: 'absolute',
                  top: 20,
                  left: 20,
                }}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        // 动画属性
                        scale: this.dot2Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 1],
                          outputRange: [0.45, 0.45, 1, 1, 0.45],
                        }),
                      },
                      {
                        translateY: this.dot2Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 0.8, 0.9, 1],
                          outputRange: [40, 40, 0, 0, 8, 8, 40],
                        }),
                      },
                      {
                        translateX: this.dot2Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 0.8, 0.9, 1],
                          outputRange: [-47, -47, 0, 0, -10, -10, -47],
                        }),
                      },
                    ],
                  }}>
                  <View
                    style={[styles.dot, {backgroundColor: '#FBE616'}]}></View>
                </Animated.View>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  position: 'absolute',
                  top: 20,
                  left: 20,
                }}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        // 动画属性
                        scale: this.dot3Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 1],
                          outputRange: [0.45, 0.45, 1, 1, 0.45],
                        }),
                      },
                      {
                        translateY: this.dot3Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 0.8, 0.9, 1],
                          outputRange: [40, 40, 0, 0, 8, 8, 40],
                        }),
                      },
                      {
                        translateX: this.dot2Value.interpolate({
                          inputRange: [0, 0.3, 0.5, 0.65, 0.8, 0.9, 1],
                          outputRange: [47, 47, 0, 0, 12, 12, 47],
                        }),
                      },
                    ],
                  }}>
                  <View style={[styles.dot, {backgroundColor: 'white'}]}></View>
                </Animated.View>
              </View>
            </Animated.View>
          </View>
          <View style={{textAlign: 'center', marginTop: 10}}>
            <Text style={{color: '#fff', fontSize: 14, lineHeight: 20}}>
              {title}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = RNC`
    dot {
        width: 24;
        height: 24;
        border-radius: 50%;
        background-color: #000;
        position: absolute;
        top: 0;
        left: 0;
    }
    dot1 {
        background-color: #ffe386;
    }
    dot2 {
        background-color: #10beae;
    }
    dot3 {
        background-color: #f74d75;
    }
`;

export default Loading;
