'use strict';

const spawn = require('cross-spawn');
const proxyquire = require('proxyquire');


let fieError;
const handleEnoent = proxyquire('../lib/handle-enoent', {
  'fie-log': function () {
    return {
      error(e) {
        fieError = e;
      }
    };
  }
});


describe('#处理 ENOENT 的异常', () => {
  it('#全局命令 fieoo 不存在', function*() {
    const result = spawn.sync('fieoo', ['eee']);
    yield handleEnoent(result.error);
    expect(fieError).to.be.contain('tnpm install -g fieoo');

  });

  it('# ENOENT 本地文件相对路径', function* () {
    yield handleEnoent({
      code: 'ENOENT',
      message: 'spawn node_modules/module/add.js ENOENT'
    });

    expect(fieError).to.be.contain('tnpm install module');
  });

  it('# ENOENT 本地文件带点相对路径', function* () {
    yield handleEnoent({
      code: 'ENOENT',
      message: 'spawn ./node_modules/module/add.js ENOENT'
    });
    expect(fieError).to.be.contain('tnpm install module');
  });

  it('# ENOENT 本地@ali文件 ', function* () {
    yield handleEnoent({
      code: 'ENOENT',
      message: 'spawn node_modules/@ali/module/cccccc.js ENOENT'
    });
    expect(fieError).to.be.contain('tnpm install @ali/module');
  });

  it('# ENOENT 本地带点@ali文件 ', function* () {
    yield handleEnoent({
      code: 'ENOENT',
      message: 'spawn ./node_modules/@ali/module/cccccc.js ENOENT'
    });
    expect(fieError).to.be.contain('tnpm install @ali/module');
  });

  it('# ENOENT 本地@alife文件 ', function* () {
    yield handleEnoent({
      code: 'ENOENT',
      message: 'spawn ./node_modules/@alife/module/cccccc.js ENOENT'
    });
    expect(fieError).to.be.contain('tnpm install @alife/module');
  });

  it('# ENOENT 全局文件 ', function* () {
    yield handleEnoent({
      code: 'ENOENT',
      message: 'spawn module ENOENT'
    });

    expect(fieError).to.be.contain('tnpm install -g module');
  });
});

