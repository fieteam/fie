/**
 * @desc 抽样算法
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 * @memberOf fie-report
 * @exports sampling
 */

'use strict';

/**
 * @desc 随机抽样算法
 * @param {Object} 对象
 * @returns {Object} 对象原型附上sampling 方法
 */
const sampling = function (wpo) {
  const map = {};
  wpo.sampling = function (mod) {
    if (mod == 1) {
      // 100%
      return 1;
    } else if (typeof map[mod] === 'number') {
      // 直接返回缓存的计算结果
      return map[mod];
    }

    // 抽样算法改为Math.random
    map[mod] = Math.floor(Math.random() * mod);
    return map[mod];
  };
};

module.exports = sampling;
