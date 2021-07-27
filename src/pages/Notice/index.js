/*
 * @Author: your name
 * @Date: 2021-05-07 20:47:58
 * @LastEditTime: 2021-06-01 13:54:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Notice/index.js
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView, Platform} from 'react-native';
import {Button, Toast, Drawer} from '@ant-design/react-native';
import {getNotice, upLoadFile} from '../../api/user';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Empty from '../../components/Empty';
import {dealFail} from '../../util/common';
export default function Notice(props) {
  const [startDate, setStartDate] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [drawer, setDrawer] = useState(null);
  useEffect(() => {
    (async () => {
      await getNotices();
      console.log(
        `http://116.62.231.156:8900/HyVisitors/downFileApp?path=files/baidu932.numbers`,
      );
    })();
  }, []);
  const getNotices = async () => {
    let parms = {
      idCard: global.userInfo.idCard,
    };
    try {
      const res = await getNotice(parms);
      if (res.data.code === 200) {
        let arr = res.data.data || [];
        setNewsList(arr);
        console.log('记录', res.data.data);
      } else {
        Toast.fail(res.data.message);
        dealFail(props, res.data.code, res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const showFile = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('文件', results);
      let url = '';
      if (Platform.OS === 'android') {
        url = results[0].uri;
      } else {
        url = results[0].uri.replace('file://', '');
      }
      // http://116.62.231.156:8900
      console.log('url', url);
      console.log(RNFetchBlob.wrap(url));
      let parms = new FormData();
      parms.append('files', {
        uri: RNFetchBlob.wrap(url),
        name: results[0].name,
        type: 'multipart/form-data',
      });
      parms.append('type', 3);
      console.log('parms', parms);
      RNFetchBlob.fetch(
        'POST',
        'http://116.62.231.156:8900/HyVisitors/uploadBatchApp',
        {
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        [
          {name: 'type', data: 3},
          {
            name: 'files',
            filename: results[0].name,
            type: results[0].type,
            data: RNFetchBlob.wrap(url),
          },
        ],
      )
        .then(resp => {
          // files/baidu932.numbers
          // files/baidu191.numbers
          console.log('success', resp.data);
          console.log('success', resp.data.code);
          console.log('success', resp.data.data);
        })
        .catch(err => {
          console.log('error', err);
        });
      for (const res of results) {
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  const downFil = () => {
    RNFetchBlob.fetch(
      'GET',
      'http://116.62.231.156:8900/HyVisitors/downFileApp?path=files/baidu932.numbers',
      {
        Authorization: 'Bearer access-token...',
        // more headers  ..
      },
    )
      .then(res => {
        let status = res.info().status;
        if (status == 200) {
          // the conversion is done in native code
          let base64Str = res.base64();
          // the following conversions are done in js, it's SYNC
          let text = res.text();
          let json = res.json();
          // console.log('下载', json);
        } else {
          // handle other status codes
        }
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
      });
  };
  return (
    <>
      <View>
        {newsList.length > 0 ? (
          <View style={{backgroundColor: '#fff'}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {newsList.map(item => (
                <View style={styles.log_item} key={item.sendTime}>
                  <Text style={{color: '#333', fontSize: 16}}>
                    {item.sendTime}
                  </Text>
                  <Text
                    style={{
                      color: '#FC5F46',
                      fontSize: 18,
                      fontWeight: '500',
                      margin: 10,
                    }}>
                    {item.message}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Empty title="当前暂无通知消息"></Empty>
        )}
        {/* <Text>dkjifew</Text>
        <Button
          onPress={() => {
            showFile();
          }}>
          显示
        </Button>
        <Button
          onPress={() => {
            downFil();
          }}>
          下载
        </Button> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  log_item: {
    display: 'flex',
    padding: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#bebebebe',
  },
});
