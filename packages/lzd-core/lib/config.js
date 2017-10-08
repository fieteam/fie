/**
 * 初始化开发环境
 */

const sudoBlock = require('sudo-block');
const fiePkg = require('../package.json');

sudoBlock();


/**
 * 初始化开发环境
 * @param obj
 */
function initConfig(obj) {
  Object.keys(obj).forEach((item) => {
    if (!process.env[item]) {
      process.env[item] = obj[item];
    }
  });
}

// 运行前的一些初始化配置工作，这些内容将存于fie的运行时
initConfig({
  FIE_VERSION: fiePkg.version,
  FIE_PACKAGE: fiePkg.name,
  FIE_BIN: Object.keys(fiePkg.bin)[0], // 获取cli的名称
  FIE_MODULE_PREFIX: 'lzd',
  FIE_CONFIG_FILE: 'lzd.config.js',
  FIE_HOME_FOLDER: '.lzd',
  FIE_ENV: 'intranet',
  FIE_LOCALE : 'en-us'      //默认语言
});
