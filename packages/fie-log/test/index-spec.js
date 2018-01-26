'use strict';

const fieLog = require('../lib/index');
const fieHome = require('fie-home');

const originLog = console.log;
const ENTRY_MODULE_ENV_NAME = fieHome.getEntryModuleEnvName();
const originEnvModule = process.env[ENTRY_MODULE_ENV_NAME];
const testStringHook = '__fieLogTestHook__';
const setModuleEnv = moduleName => {
  process.env[ENTRY_MODULE_ENV_NAME] = moduleName;
};
const logSpy = sinon.spy();

function mockLog() {
  const args = Array.prototype.slice.call(arguments);
  if (args[0].indexOf(testStringHook) === -1) {
    originLog.apply(console, args);
  } else {
    logSpy.apply(this, args);
  }
}

describe('# fie-log', () => {
  beforeEach(() => {
    console.log = mockLog;
  });

  afterEach(() => {
    console.log = originLog;
    logSpy.reset();
    setModuleEnv(originEnvModule);
  });

  it('# entryType 不传时, 任何时候都打印', function*() {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const log2 = fieLog('xyz');
    const result1 = log1.info(testStringHook);
    const result2 = log2.info(testStringHook);
    expect(result1).to.be.equal(true);
    expect(result2).to.be.equal(true);
  });

  it('# entryType = 1, 只有当前模块做为入口模块时才打印', function*() {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const log2 = fieLog('xyz');
    const result1 = log1.cli.info(testStringHook);
    const result2 = log2.cli.info(testStringHook);
    expect(result1).to.be.equal(true);
    expect(result2).to.be.equal(false);
  });

  it('# entryType = 2, 只有当前模块不是入口模块时才打印', function*() {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const log2 = fieLog('xyz');
    const result1 = log1.func.info(testStringHook);
    const result2 = log2.func.info(testStringHook);
    expect(result1).to.be.equal(false);
    expect(result2).to.be.equal(true);
  });

  it('# 能正常打印占位符字符串', function*() {
    setModuleEnv('abc');
    const log1 = fieLog('abc');
    const result1 = log1.info(`${testStringHook} %o`, { a: 'b' });
    const matched = !!logSpy.getCall(0).args[0].match(/__fieLogTestHook__ { a: ['"]b['"] }/);
    expect(result1).to.be.equal(true);
    expect(matched).to.be.equal(true);
  });
});
