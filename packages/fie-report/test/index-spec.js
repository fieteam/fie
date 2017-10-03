'use strict';


const proxyquire = require('proxyquire');

describe('# fie-report/lib/index', () => {
  describe('# fie-report 外网上报recode， 外网上报 fieFlow 信息', () => {
    const fieReport = proxyquire('../lib/index', {
      'fie-env': {
        isIntranet() {
          return false;
        }
      }
    });

    it('根据核心命令发送日志', () => {
      const result = fieReport.coreCommand();
      expect(result.success).to.be.equals(true);
      expect(result.data).to.be.an('object');
    });

    it('根据模块名称发送retcode日志', () => {
      const result = fieReport.moduleUsage('fie-plugin-retco');
      expect(result.success).to.be.equals(true);
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('fiePluginName').and.equal('fie-plugin-retco');
    });

    it('自定义retcode发送日志-字符串错误信息', () => {
      const result = fieReport.error('fie-test', 'test error');
      expect(result.success).to.be.equals(true);
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('errorType').and.equal('fie-test');
      expect(result.data).to.have.property('error').and.equal('test error');
    });
  });

  describe('# fie-report 内网上报recode， 内网上报 fieFlow 信息', () => {
    const fieReport = proxyquire('../lib/index', {
      'fie-env': {
        isIntranet() {
          return true;
        }
      }
    });

    it('根据核心命令发送日志', () => {
      const result = fieReport.coreCommand();
      expect(result.success).to.be.equals(true);
      expect(result.data).to.be.an('object');
    });

    it('根据模块名称发送retcode日志', () => {
      const result = fieReport.moduleUsage('fie-plugin-retco');
      expect(result.success).to.be.equals(true);
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('fiePluginName').and.equal('fie-plugin-retco');
    });

    it('自定义retcode发送日志-字符串错误信息', () => {
      const result = fieReport.error('fie-test', 'test error');
      expect(result.success).to.be.equals(true);
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('errorType').and.equal('fie-test');
      expect(result.data).to.have.property('error').and.equal('test error');
    });
  });
});
