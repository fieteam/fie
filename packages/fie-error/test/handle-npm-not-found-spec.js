'use strict';

const proxyquire = require('proxyquire');
const emptyLog = require('../../../test/fixtures/empty-log');

const install = sinon.spy();

const handleNpmNotFound = proxyquire('../lib/handle-npm-not-found', {
  'fie-log': emptyLog
});


describe('# 处理 npm 安装异常', () => {
  it('# 发现 error 时, catch 并返回 true', function* () {
    const result = yield handleNpmNotFound(new Error('install @ali/fie-toolkit-xxxx@latest error'));
    expect(result).to.be.equals(true);
  });
});
