'use strict';

const proxyquire = require('proxyquire');
const fs = require('fs-extra');
const path = require('path');
const emptyLog = require('../../../test/fixtures/empty-log');

const cwd = process.cwd();
const install = sinon.spy();
const installDependencies = sinon.spy();

const handleModuleNotFound = proxyquire('../lib/handle-module-not-found', {
  'fie-log': emptyLog,
  'fie-npm': {
    * install() {
      install.apply(this, [].slice.call(arguments));
    },
    * installDependencies() {
      installDependencies.apply(this, [].slice.call(arguments));
    }
  }
});


describe('# 处理 MODULE_NOT_FOUND 异常', () => {
  before(() => {
    // 清除一下相关的模块
    fs.removeSync(path.join(cwd, 'node_modules/classnames'));
    fs.removeSync(path.join(cwd, 'node_modules/@ali'));
  });

  after(() => {
    // 清除一下相关的模块
    fs.removeSync(path.join(cwd, 'node_modules/classnames'));
    fs.removeSync(path.join(cwd, 'node_modules/@ali'));
  });

  it('# 发现模块不存在时, 执行 install', function* () {
    const notExist = 'this-is-non-exist-module';
    try {
      require(notExist);
    } catch (e) {
      yield handleModuleNotFound(e);
      install.should.calledWithExactly(notExist, { cwd });
    }
  });

  /* it('# 修复失败', function* () {
    try {
      require('classnames2222');
    } catch (e) {
      yield handleModuleNotFound(e);
      expect(fieError).to.be.contain('自动修复失败');
    }
  });

  it('# 修复@ali的模块', function* () {
    try {
      require('@ali/fie-plugin-cloud');
    } catch (e) {
      yield handleModuleNotFound(e);
      expect(fieSuccess).to.be.contain('自动修复成功');
    }
  });

  it('# 不处理相对路径模块', function* () {
    try {
      require('../fie-plugin-cloud');
    } catch (e) {
      yield handleModuleNotFound(e);
      expect(fieDefaultError).to.be.equals(true);
    }
  });*/
});
