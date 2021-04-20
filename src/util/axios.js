import axios from 'axios';
import {message} from 'antd';
const BASE_URL = 'https://chat-httpservice.kuipmake.com/';
// const BASE_URL = 'http://192.168.28.95:60000/'

const _axios = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

const ajax = params => {
  const token = '';
  const {headers, method, url, data} = params;
  const _params = {
    headers: {
      token: token || '',
      ...(headers || {}),
    },
    method: method || 'POST',
    url,
    data: data || {},
  };
  return new Promise((resolve, reject) => {
    _axios(_params)
      .then(response => {
        const res = response.data;
        switch (res.code) {
          case 0:
            resolve(res);
            break;
          case 10005:
            // token 失效
            window.location.href = '#/';
            break;
          case 10003:
            // 未登录
            window.location.href = '#/';
            break;
          default:
            reject(res);
        }
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              message.error('请求未找到：404');
              break;
            case 503:
              message.error('服务器连接不上：503');
              break;
            case 700:
              message.error('该网络的服务器正在升级中, 请稍后重试');
              break;
            default:
              message.error(`响应异常：${error.response.status}`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          message.error('服务器无响应');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error);
        }
      });
  });
};

export default ajax;
