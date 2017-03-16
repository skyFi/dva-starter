# dva-starter
完美使用 dva react react-router,最好用的ssr脚手架，服务器渲染最佳实践
> 欢迎 Fork ，Issue 交流各种想法

- 努力在最佳的路上，不断完善，建议star或watch.
- 有想法就Fork, Pull requests ，我很耐 操.

## Usage
安装redis
```bash
$ brew install redis
```
启动redis
```bash
$ brew services start redis
```
准备配置文件
- 将config.example.js拷贝一份config.js并修改为你想要的配置
- 共两个地方

运行
```bash
 'production': $ npm run start
'development': $ npm run dev
```
##服务器渲染需要的initData
对于服务器渲染需要获取的数据，放置的model中的initData中，结构和effects一样，也一样可以在页面中像调用effects一样调用，你所需要关心的仅仅是哪些数据需要首屏出现，把它从effects中移到initData中即可，其他的你都不需要关心了，是不是很爽，哇哈哈

```JavaScript
export default ModelHelper({
  namespace: 'user',
  state: [
    {
      list: undefined,
    }
  ],
  reducers: {
    list(state, { list }) {
      return { ...state, list };
    },
  },
  effects: {
    *fetchTodoList(action, { call, put }) {
      const res = yield call(fetchTodoList);
      if (res) {
        yield put({
          type: 'list',
          list: res
        });
      } else {
        throw new Error(`Init data Error: fetchTodoList.`);
      }
    },
  },
  initData: {
    *fetchAnotherList({}, { call, put }) {
      const res = yield call(fetchAnotherList);
      if (res) {
        yield put({
          type: 'list',
          list: res
        });
      } else {
        throw new Error(`Init data Error: fetchAnotherList.`);
      }
    },
  },
})
```

##魔法全局变量initialState的消失
```HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/index.css" />
</head>
<body>
  <div id="root">
    <div>
      <div data-reactroot="" data-reactid="1" data-react-checksum="-35862160"><div data-reactid="2"><h1 data-reactid="3"><!-- react-text: 4 -->App _ <!-- /react-text --><!-- react-text: 5 --><!-- /react-text --></h1><h3 data-reactid="6">About</h3><h3 data-reactid="7">点我试试</h3><h2 class="title" data-reactid="8">User</h2><div data-reactid="9"><!-- react-text: 10 -->- <!-- /react-text --><!-- react-text: 11 -->周静<!-- /react-text --></div><div data-reactid="12"><!-- react-text: 13 -->- <!-- /react-text --><!-- react-text: 14 -->侯军<!-- /react-text --></div><div data-reactid="15"><!-- react-text: 16 -->- <!-- /react-text --><!-- react-text: 17 -->郭超<!-- /react-text --></div><div data-reactid="18"><!-- react-text: 19 -->- <!-- /react-text --><!-- react-text: 20 -->乔涛<!-- /react-text --></div><div data-reactid="21"><!-- react-text: 22 -->- <!-- /react-text --><!-- react-text: 23 -->杨超<!-- /react-text --></div><div data-reactid="24"><!-- react-text: 25 -->- <!-- /react-text --><!-- react-text: 26 -->万娟<!-- /react-text --></div><div data-reactid="27"><!-- react-text: 28 -->- <!-- /react-text --><!-- react-text: 29 -->何超<!-- /react-text --></div><div data-reactid="30"><!-- react-text: 31 -->- <!-- /react-text --><!-- react-text: 32 -->戴秀兰<!-- /react-text --></div><div data-reactid="33"><!-- react-text: 34 -->- <!-- /react-text --><!-- react-text: 35 -->孙秀英<!-- /react-text --></div><div data-reactid="36"><!-- react-text: 37 -->- <!-- /react-text --><!-- react-text: 38 -->邹超<!-- /react-text --></div><div data-reactid="39"><!-- react-text: 40 -->- <!-- /react-text --><!-- react-text: 41 -->苏刚<!-- /react-text --></div><div data-reactid="42"><!-- react-text: 43 -->- <!-- /react-text --><!-- react-text: 44 -->毛刚<!-- /react-text --></div><div data-reactid="45"><!-- react-text: 46 -->- <!-- /react-text --><!-- react-text: 47 -->萧丽<!-- /react-text --></div><div data-reactid="48"><!-- react-text: 49 -->- <!-- /react-text --><!-- react-text: 50 -->胡勇<!-- /react-text --></div><div data-reactid="51"><!-- react-text: 52 -->- <!-- /react-text --><!-- react-text: 53 -->毛刚<!-- /react-text --></div><div data-reactid="54"><!-- react-text: 55 -->- <!-- /react-text --><!-- react-text: 56 -->贺强<!-- /react-text --></div></div></div>
    </div>
  </div>
  <script type="text/javascript" src="/states/YT50C6TStrTsitaHF0gwkxpyslhAYJAZ1489673610988.js"></script>
  <script src="/index.js"></script>
</body>
</html>
```
最初版本采用了一个全局变量initialState来将服务器渲染时获得的初始化states同步到客户端初始化的states，这个方法有个弊端，

- 第一，暴漏个全局的变量，不爽；

- 第二，不够优雅；

- 第三，使得html页面拥有大段大段的script，这会**降低你的网站在百度的权重！**。

所以，这里将states放到了一个redis中缓存，避免了一些问题，但，伟大的同性交流平台啊，这一定有更好的解决办法，如果有，那你一定要告诉我，翘首期盼之！！

####目前最佳方案：
1. 缓存住准备好的初始化states
```JavaScript
module.exports.set = function *(stateString) {
  const key = randomstring.generate() + Date.now();
  yield cache.setexAsync(`${cache.prefix}:state:${key}`, EXPIRE, stateString);
  return key;
};
```
2.页面加载
```html
<script type="text/javascript" src="/states/${stateKey}.js"></script>
```
3.路由截取
```JavaScript
app.use('/states/(:key).js', stateServe);
```
4.页面同步states
```JavaScript
const app = createApp({
  history: browserHistory,
  initialState: JSON.parse(window.states),
}, { router, models });
```
5.删除states
```JavaScript
delete window.states;
```

最后，如果你有更好的解决方案，请一定要告诉我，不甚感激！
