/**
 * @author 宇果 <baofen14787@gmail.com>
 * @desc fie 运行时的全局配置
 */

'use strict';

module.exports = {

  /**
   * 获取运行时的cli名称
   */
  getBinName() {
    return process.env.FIE_BIN || 'fie';
  }

};
