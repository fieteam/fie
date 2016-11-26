'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs-extra');


describe('# fie-config', () => {
  const mockCwd = path.resolve(__dirname, 'fixtures');
  const source = path.resolve(mockCwd, 'source.fie.config.js');
  const mock = path.resolve(mockCwd, 'fie.config.js');
  const config = proxyquire('../lib/index', {});

  before(() => {
    fs.copySync(source, mock);
  });
  after(() => {
    if (fs.existsSync(mock)) {
      fs.unlinkSync(mock);
    }
  });

  it('# get 获取数据', () => {
    expect(config.get('abc', mockCwd)).to.be.deep.equals({
      xyz: 22
    });
  });

  it('# set 设置数据', () => {
    config.set('abc', {
      xyz: 23
    }, mockCwd);
    expect(config.get('abc', mockCwd)).to.be.deep.equals({
      xyz: 23
    });
  });
});
