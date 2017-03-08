import React from 'react';
import dva from 'dva';
import { RouterContext } from 'dva/router';

export default function createApp(opts = {}, { router, models } = {}, isServer) {
  const app = dva(opts);
  const _models = Object.keys(models).map(k => models[k]);
  console.log({_models});
  _models.map(m => {
    app.model(m);
  });
  if (isServer) {
    app.router(({ history, renderProps}) => {
      return (
        <RouterContext { ...renderProps } />
      );
    });
  } else {
    app.router(router);
  }
  return app;
}