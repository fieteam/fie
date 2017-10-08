
const sudoBlock = require('sudo-block');
const fiePkg = require('../package.json');

// 禁止 sudo 执行 fie 命令
sudoBlock();
/**
 * 初始化开发环境
 * 需要在require其他包之前先进行初始化
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
  FIE_MODULE_PREFIX: 'fie',
  FIE_CONFIG_FILE: 'fie.config.js',
  FIE_HOME_FOLDER: '.fie'
});
