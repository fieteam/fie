'use strict';

/**
 * 判断当前对象是否为 generator 对象
 * @param obj
 * @returns {boolean}
 */
function isGenerator(obj) {
  return typeof obj.next === 'function' && typeof obj.throw === 'function';
}

/**
 * 判断当前对象是否为 generator 函数
 * @param obj
 * @returns {boolean}
 */
function isGeneratorFunction(obj) {
  const constructor = obj.constructor;
  if (!constructor) return false;
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') return true;
  return isGenerator(constructor.prototype);
}

/**
 * 执行某个函数
 *  如果是 generator 类型,则使用 yield执行, 并在其后执行 next(0\)
 *  否则普通调用, 并传入 next 函数
 * @param options {object}
 * @param options.method {function} 函数体
 * @param options.args {array} 参数
 * @param options.next {function} 下一步执行方法
 * @return {mix} 函数体内的返回值
 */
function* runFunction(options) {
  const noop = () => {};
  const method = options.method;
  const args = options.args || [];

  const next = options.next || noop;
  if (isGeneratorFunction(method) || isGenerator(method)) {
    const res = yield method.apply(null, args);
    next();
    return res;
  }
  const res = method.apply(null, args.concat(next));
  // return 为 promise 对象的情况
  if (res && typeof res.then === 'function') {
    const res2 = yield res;
    next();
    return res2;
  }
  return res;
}

module.exports = runFunction;
