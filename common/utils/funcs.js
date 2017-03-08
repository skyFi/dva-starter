import { routerRedux } from 'dva/router';
import config from '../config/config';

// 切换路由
let dispatch;
export const setRedirectToDispatch = (d) => { dispatch = d; };
export const getDispatch = () => dispatch;
export const redirectTo = (pathname, query) => {
  if (typeof dispatch !== 'function') {
    throw new Error(`[redirectTo] dispatch is not a function! but a ${typeof dispatch}`);
  }
  dispatch(routerRedux.push({
    pathname: pathname,
    query,
  }));
};

// 读取cookie
export const getCookie = (key) => {
  key = config.cookie.prefix + key;

  const pairs = document.cookie.split(';').map((pair) => {
    return {
      key: pair.split('=')[0],
      value: pair.split('=')[1],
    };
  });

  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].key.trim() === key) {
      return decodeURIComponent(pairs[i].value);
    }
  }

  return undefined;
};

// 写入cookie
export const setCookie = (key, value, maxAge = -1) => {
  if (maxAge === -1) {
    document.cookie = `${config.cookie.prefix}${key}=${encodeURIComponent(value)};domain=${config.cookie.domain};path=/;`;
  } else {
    document.cookie = `${config.cookie.prefix}${key}=${encodeURIComponent(value)};max-age=${maxAge};domain=${config.cookie.domain};path=/;`;
  }
};

// 校验手机号
export const isValidPhone = (phone) => {
  return !isNaN(Number(phone)) && /^1[0-9]{10}$/.test(phone);
};
