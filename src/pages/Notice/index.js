/*
 * @Author: your name
 * @Date: 2021-05-07 20:47:58
 * @LastEditTime: 2021-05-09 21:51:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /web/hy/hyApp/src/pages/Notice/index.js
 */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, Toast, Drawer} from '@ant-design/react-native';
import {getNotice} from '../../api/user';

export default function Notice() {
  const [startDate, setStartDate] = useState(null);
  const [drawer, setDrawer] = useState(null);
  useEffect(() => {
    (async () => {
      await getNotices();
    })();
  }, []);
  const getNotices = async () => {
    let parms = {
      idCard: global.userInfo.idCard,
    };
    try {
      const res = await getNotice(parms);
      if (res.data.code === 200) {
        console.log(res.data.data);
      } else {
        Toast.fail(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onOpenChange = isOpen => {
    console.log(isOpen);
  };
  const sidebar = (
    <ScrollView>
      <Text>dddd</Text>
    </ScrollView>
  );
  return (
    <>
      <View>
        <Text>dkjifew</Text>
      </View>
      <Drawer
        sidebar={sidebar}
        position="left"
        open={false}
        drawerRef={el => setDrawer(el)}
        onOpenChange={isOpen => onOpenChange(isOpen)}
        drawerBackgroundColor="#ccc">
        <View>
          <Button
            onPress={() => {
              drawer && drawer.openDrawer();
            }}>
            Open drawer
          </Button>
          <ScrollView>
            <Text>dddd</Text>
            <View style={{height: 2000,backgroundColor: 'red'}}></View>
          </ScrollView>
        </View>
      </Drawer>
      <View>
        <Text>dkjifew</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
