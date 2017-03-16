import express from 'express';
import path from 'path';
import webpack from 'webpack';
import color from 'cli-color';
import config from '../webpack.config.babel';
import stateServe from './state_serve';

const app = express();

// 拉取初始化states
app.use('/states/(:key).js', stateServe);

if (process.env.NODE_ENV !== 'production') {
  // webpack compile
  const compiler = webpack(config);
  const options = {
    publicPath: config.output.publicPath,
    noInfo: true,
    stats: {colors: true},
  };
  app.use(require('webpack-dev-middleware')(compiler, options));
  app.use(require('webpack-hot-middleware')(compiler));

  // mock
  app.use(require('./mock_middleware'));
}

app.use(express.static(path.join(__dirname, '../public'), {maxAge: 86400000 * 30}));
app.use(require('./ssr_middleware'));
app.disable('x-powered-by');

const server = app.listen(3200, () => {
  const { port } = server.address();
  console.info(`${color.green('Listened at port: ')}${color.cyan(port)}`);
});