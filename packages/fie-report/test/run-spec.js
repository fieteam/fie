'use strict';

const fieReport = require('../lib/index');

describe('# fie-report 外网上报recode， 外网上报 fieFlow 信息', () => {
  it('根据核心命令发送日志', () => {
    const result = fieReport.coreCommand('fie start --mocha --test');
    expect(result.success).to.be.equals(true);
    expect(result.msg).to.be.a('string');
  });

  it('根据模块名称发送retcode日志', () => {
    const result = fieReport.moduleUsage('fie moduleUsage --mocha --test');
    expect(result.success).to.be.equals(true);
    expect(result.msg).to.be.a('string');
  });

  it('自定义retcode发送日志-字符串错误信息', () => {
    const result = fieReport.error('fie mocha --test', 'test error');
    expect(result.success).to.be.equals(true);
    expect(result.msg).to.be.a('string');
  });

  it('自定义retcode发送日志-object错误信息', () => {
    const result2 = fieReport.error('fie mocha --test', { code: 909, msg: '自定义错误' });
    expect(result2.success).to.be.equals(true);
    expect(result2.msg).to.be.a('string');
  });

  it('自定义retcode发送日志-数组错误信息', () => {
    const result3 = fieReport.error('fie mocha --test', ['909', '自定义错误']);
    expect(result3.success).to.be.equals(true);
    expect(result3.msg).to.be.a('string');
  });
});

describe('# 外网测试-fie-report ,不上报fieFlow 信息', () => {
  before(() => {
    process.env.FIE_ENV = 'extranet';
  });
  after(() => {
    delete process.env.FIE_ENV;
  });

  it('外网测试提交fieReport.flowLog.log,不上报日志', () => {
    const result4 = fieReport.flowLog.log({ command: 'fie test case', message: '测试用例代码' });
    expect(result4.success).to.be.equals(false);
    expect(result4.msg).to.be.a('string');
  });
});


describe('# 内网测试-fie-report,上报fieFlow 信息', () => {
  before(() => {
    process.env.FIE_ENV = 'intranet';
  });
  after(() => {
    delete process.env.FIE_ENV;
  });

  it('内网测试提交:fieReport.flowLog.log', () => {
    const result = fieReport.flowLog.log({ command: 'fietest', message: '测试用例代码' });
    expect(result.success).to.be.equals(true);
    expect(result.msg).to.be.a('string');
  });

  it('内网测试提交:fieReport.flowLog.log-不传参数, 不上报日志!', () => {
    const result = fieReport.flowLog.log();
    expect(result.success).to.be.equals(false);
    expect(result.msg).to.be.a('string');
  });

  it('内网测试提交:fieReport.flowLog.log-不传{command} 不上报日志!', () => {
    const result = fieReport.flowLog.log({ message: '不传command' });
    expect(result.success).to.be.equals(false);
    expect(result.msg).to.be.a('string');
  });

  it('内网测试提交:fieReport.flowLog.warn', () => {
    const result = fieReport.flowLog.warn({ command: 'fietest', message: '测试用例代码' });
    expect(result.success).to.be.equals(true);
    expect(result.msg).to.be.a('string');
  });

  it('内网测试提交:fieReport.flowLog.error', () => {
    const result = fieReport.flowLog.error({ command: 'fietest', message: '异常处理' });
    expect(result.success).to.be.equals(true);
    expect(result.msg).to.be.a('string');
  });
});

