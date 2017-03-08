import fetch from 'dva/fetch';
import querystring from 'querystring';
import { message } from 'antd';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async (url, options = {}) => {
  const fetchOptions = {
    method: options.method || 'GET',
  };

  url = options.query ? `${url}?${querystring.stringify(options.query)}` : url;

  if (fetchOptions.method !== 'GET') {
    fetchOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    try {
      fetchOptions.body = JSON.stringify(options.data);
    } catch (e) {
      global.document && message.error('未知错误,请重试！');
      console.error(`${fetchOptions.method}: ${url} Error.`, e);
      return null;
    }

    // formData
    if (options.formData) {
      const formData = new FormData();
      Object.keys((options.formData || {})).forEach((key) => {
        if (options.formData[key] !== undefined) { formData.append(key, options.formData[key]); }
      });
      fetchOptions.body = formData;
      fetchOptions.headers = {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data'
      };
    }
  }
  // fetchOptions.credentials = 'same-origin';
  fetchOptions.credentials = 'include';

  fetchOptions.headers = fetchOptions.headers || {};
  try {
    const response = await fetch(url, fetchOptions);
    checkStatus(response);
    const data = await response.json();

    //todo: server logic
    return data;

    // ignore
    if (data.code === 0) {
      return data;
    } else {
      global.document && message.error(data.code ? data.msg : '未知错误');
      console.error(`${fetchOptions.method}: ${url} Error.`, data);
      return null;
    }
  } catch (e) {
    global.document && message.error('未知错误');
    console.error(`${fetchOptions.method}: ${url} Error.`, e);
    return null;
  }
};
