export default (model = {}) => {
  let _model = { ... model };
  if (!checkEffect(model)) {
    return {};
  }
  if (typeof model.initData === 'object') {
    _model.effects = Object.assign({}, _model.effects || {}, model.initData);
  }
  return _model;
}

const checkEffect = (model = {}) => {
  const effectKeys = Object.keys(model.effects || {});
  const initDataKeys = Object.keys(model.initData || {});
  if (effectKeys.filter(e => initDataKeys.some(i => i === e)).length != 0) {
    console.error('WARNING: effects and initData has same key!');
    return false;
  }
  return true;
};