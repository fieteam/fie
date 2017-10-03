'use strict';

const path = require('path');
const fs = require('fs-extra');
const fieUser = require('../lib/index');

const mockPath = path.resolve(__dirname, 'fixtures');


describe('# fie-user/lib/index 获取用户信息', () => {
  const user = {
    email: 'fie-test@alibaba-inc.com',
    name: 'fie-user'
  };
  // 测试前先准备一下环境
  before(() => {
    process.env.FIE_HOME = mockPath;
    fs.mkdirsSync(path.join(mockPath, '.fie'));
    fs.outputJsonSync(path.join(mockPath, '.fie', 'fie.user.json'), user);
  });

  after(() => {
    delete process.env.FIE_HOME;
    fs.removeSync(mockPath);
  });

  it('正常获得user获取用户信息，读取fie.user.json文件', () => {
    const userInfo = fieUser.getUser();
    expect(userInfo).to.be.an('object');
    expect(userInfo.name).to.be.equals(user.name);
    expect(userInfo.email).to.be.equals(user.email);
  });

  it('正常获得email信息', () => {
    const email = fieUser.getEmail();
    expect(email).to.be.a('string');
    expect(email).to.be.equals(user.email);
  });

  it('正常获得name信息', () => {
    const name = fieUser.getName();
    expect(name).to.be.an('string');
    expect(name).to.be.equal(user.name);
  });
});

