import { match, RoutingContext, createMemoryHistory } from 'dva/router';
import { renderToString } from 'react-dom/server'
import { join } from 'path';
import co from 'co';
import thunkify from 'thunkify-wrap';

import router, { routes } from '../common/routes';
import createApp from '../common/create_app';
import * as models from '../common/models';

export default function(req, res) {

  const reducersMap = new Map();
  let currentNamespace = undefined;
  let initStates = {};

  co(function *() {

    // 服务器渲染错误记录
    let serverGetDataError = undefined;

    // 匹配路由
    const matchedData = yield thunkify(match)({
      routes: routes,
      location: req.url
    });
    const renderProps = matchedData[1];
    if(!renderProps) {
      console.error(`Unexpected request! url: ${req.url}`);
      return {
        serverError: `Unexpected request! url: ${req.url}`,
      };
    }
    const route = renderProps.routes[renderProps.routes.length - 1];

    // 路由处理
    if (route.namespace) {
      currentNamespace = route.namespace;
    }

    // 处理models
    if (models) {
      const _models = Object.keys(models).map(k => models[k]);
      for (const model of _models) {
        if(model.namespace === currentNamespace) {

          //创建传统reducers map;
          const namespace = model.namespace;
          if (typeof model.reducers === 'object') {
            const modelReducers = model.reducers;
            Object.keys(modelReducers)
              .map(k => reducersMap.set(`${namespace}__${k}`, modelReducers[k]))
          }

          // 获取初始化数据，服务器渲染
          if(model.initData) {
            try {
              const allRes = yield Promise.all(
                Object.keys(model.initData)
                  .map(k => model.initData[k])
                  .map(fn => co(fn(
                    { params: renderProps.params, location: renderProps.params },
                    _mapEffect2State(model))
                  ))
              );
            } catch (err) {
              console.error('###### server init data error. #####\n', err.stack);
              serverGetDataError = err.message;
            }
          }
        }
      }
    }

    // 准备HTML需要的信息
    const initialState = { ...initStates, _system: { serverGetDataError } };
    const app = createApp({
      history: createMemoryHistory(),
      initialState,
    }, { router, models } , /* isServer */true);
    const html = renderToString(app.start()({ renderProps }));

    return {
      html,
      initialState,
      notFound: route.path === '*',
    }
  }).then((data = {}) => {
    console.log('co res: ', data);
    if(data.serverError) {
      res.end(data.serverError);
    } else {
      res.end(renderFullPage(data.html, data.initialState));
    }
  }).catch(err => {
    console.error(err);
  });

  //////////////////////////
  // helper functions
  function _mapEffect2State(model = {}) {
    function* put(action) {
      const reducer = reducersMap.get(`${model.namespace}__${action.type}`);
      const currentState = reducer( initStates, action );
      initStates = Object.assign(
        {},
        initStates,
        { [`${model.namespace}`]: Object.assign({}, initStates[`${model.namespace}`], currentState) }
      );
      yield initStates;
    }
    function call(fn, ...args) {
      return fn(args);
    }
    return { call, put };
  }
}

function renderFullPage(html, initialState) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/index.css" />
</head>
<body>
  <div id="root">
    <div>
      ${html}
    </div>
  </div>
  <script>
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
  </script>
  <script src="/index.js"></script>
</body>
</html>
  `;
}