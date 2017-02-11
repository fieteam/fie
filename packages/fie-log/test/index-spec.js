'use strict';

const fieLog = require('../lib/index');
const fieHome = require('fie-home');

const originLog = console.log;
const ENTRY_MODULE_ENV_NAME = fieHome.getEntryModuleEnvName();
const originEnvModule = process.env[ENTRY_MODULE_ENV_NAME];
const testStringHook = '__fieLogTestHook__';
const setModuleEnv = (moduleName) => {
  process.env[ENTRY_MODULE_ENV_NAME] = moduleName;
};


function mockLog() {
  const args = Array.prototype.slice.call(arguments);
  if (args[0].indexOf(testStringHook) === -1) {
    originLog.apply(console, args);
  }
}

describe('# fie-log 日志打印', () => {
  beforeEach(() => {
    console.log = mockLog;
  });

  afterEach(() => {
    console.log = originLog;
    setModuleEnv(originEnvModule);
  });


  it('# entryType 不传时, 任何时候都打印', function* () {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const log2 = fieLog('xyz');
    const result1 = log1.info(testStringHook);
    const result2 = log2.info(testStringHook);
    expect(result1).to.be.equal(true);
    expect(result2).to.be.equal(true);
  });


  it('# entryType = 1, 只有当前模块做为入口模块时才打印', function* () {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const log2 = fieLog('xyz');
    const result1 = log1.info(testStringHook, 1);
    const result2 = log2.info(testStringHook, 1);
    expect(result1).to.be.equal(true);
    expect(result2).to.be.equal(false);
  });


  it('# entryType = 2, 只有当前模块不是入口模块时才打印', function* () {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const log2 = fieLog('xyz');
    const result1 = log1.info(testStringHook, 2);
    const result2 = log2.info(testStringHook, 2);
    expect(result1).to.be.equal(false);
    expect(result2).to.be.equal(true);
  });
});
