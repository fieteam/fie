'use strict';

const fieReport = require('../lib/index');

describe('# fie-report 上报recode/ fieFlow 信息', () => {
  it('根据核心命令发送日志', () => {
    const result = fieReport.coreCommand('fie start --mocha --test');
    expect(result.success).to.be.equals(true);
    expect(result.logMsg).to.be.a('string');
  });

  it('根据模块名称发送retcode日志', () => {
    const result = fieReport.moduleUsage('fie moduleUsage --mocha --test');
    expect(result.success).to.be.equals(true);
    expect(result.logMsg).to.be.a('string');
  });

  it('自定义retcode发送日志-字符串错误信息', () => {
    const result = fieReport.error('fie mocha --test', 'test error');
    expect(result.success).to.be.equals(true);
    expect(result.logMsg).to.be.a('string');
  });

  it('自定义retcode发送日志-object错误信息', () => {
    const result2 = fieReport.error('fie mocha --test', { code: 909, msg: '自定义错误' });
    expect(result2.success).to.be.equals(true);
    expect(result2.logMsg).to.be.a('string');
  });

  it('自定义retcode发送日志-数组错误信息', () => {
    const result3 = fieReport.error('fie mocha --test', ['909', '自定义错误']);
    expect(result3.success).to.be.equals(true);
    expect(result3.logMsg).to.be.a('string');
  });
});

