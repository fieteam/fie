/**
 * 空log, 用于测试的时候 proxyquire 引用 ,避免 log 信息影响测试结果查看
 * @returns {{success: (function()), error: (function()), warn: (function()), info: (function()), debug: (function())}}
 */
function log() {
  return {
    success() {},
    error() {},
    warn() {},
    info() {},
    debug() {}
  };
}

module.exports = log;
