/**
 * Created by hugo on 16/11/18.
 */

'use strict';

const handleList = [];

module.exports = {
  /**
   * 处理模块名,返回正确的名称
   * abc/abc.js
   * @ali/abc/a.js
   * @ali/abc
   * abc
   */
  pureModuleName(moduleName) {
    const modules = moduleName.split('/');
    let module = moduleName;

    // @ali/xxx,@alife/xxx的情况
    if (modules.length > 1) {
      if (modules[0].indexOf('@ali') !== -1) {
        module = `${modules[0]}/${modules[1]}`;
      } else {
        module = modules[0];
      }
    }
    return module;
  },
  register(handle) {
    if (typeof handle === 'function') {
      handleList.push(handle);
    }
  },
  getHandleList() {
    return handleList;
  }
};
