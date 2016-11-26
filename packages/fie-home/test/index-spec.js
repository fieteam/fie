'use strict';

const path = require('path');
const fs = require('fs-extra');
const fieHome = require('../lib/index');

let home;
describe('fie-home获取fie及模块的相关路径', () => {
  before(() => {
    process.env.FIE_HOME = path.join(__dirname, 'helpers');
    fs.mkdirsSync(process.env.FIE_HOME);
    home = path.join(process.env.FIE_HOME, '.fie');
  });

  after(() => {
    fs.removeSync(path.join(__dirname, 'helpers'));
    delete process.env.FIE_HOME;
  });

  it('initHomeDir 初始化创建全局 .fie 目录', () => {
    fieHome.initHomeDir();
    const result = fs.existsSync(home);
    expect(result).to.be.equals(true);
  });

  it('cleanHomeDir 删除 ~/.fie/node_modules 目录', () => {
    const modulePath = path.join(home, 'node_modules');
    fs.mkdirsSync(modulePath);
    const result = fs.existsSync(modulePath);
    expect(result).to.be.equals(true);

    fieHome.cleanHomeDir();
    const result2 = fs.existsSync(modulePath);
    expect(result2).to.be.equals(false);
  });

  it('getHomePath 获取 ~/.fie/ 绝对路径', () => {
    const homePath = fieHome.getHomePath();
    expect(homePath).to.be.a('string');
    expect(homePath).to.be.not.equals('');
  });

  it('getModulesPath 获取~/.fie/node_modules 绝对路径  ', () => {
    const modulePath = fieHome.getModulesPath();
    expect(modulePath).to.be.a('string');
    expect(modulePath).to.be.not.equals('');
  });

  it('initHomeDir 初始化创建 ~/.fie ', () => {
    delete process.env.FIE_HOME;
    fieHome.initHomeDir();
    const homePath = fieHome.getHomePath();
    expect(homePath).to.be.a('string');
    expect(homePath).to.be.not.equals('');
  });
});
