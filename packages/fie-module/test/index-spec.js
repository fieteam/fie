const path = require('path');
const fs = require('fs-extra');
const home = require('fie-home');
const fieModule = require('../lib/index');

const mockCwd = path.resolve(__dirname, 'fixtures');

const testObject = {
  FIE_MODULE_PREFIX: 'hugo',
  FIE_HOME: mockCwd,
  FIE_HOME_FOLDER: 'fie',
  FIE_ENV: 'extranet',
};

function createPackage(name) {
  const pkg = {
    name,
    version: '1.0.0',
    description: name,
    main: 'index.js',
  };
  const homeModulePath = home.getModulesPath();
  const modulePath = path.join(homeModulePath, name);
  fs.ensureDirSync(modulePath);
  fs.outputJsonSync(path.join(modulePath, 'package.json'), pkg);
  fs.copySync(path.join(mockCwd, 'fie', 'index.js'), path.join(modulePath, 'index.js'));
}

function clearPackage() {
  fs.removeSync(path.join(home.getHomePath(), 'fie.cache.json'));
  fs.removeSync(home.getModulesPath());
}

function initConfig(obj) {
  Object.keys(obj).forEach(item => {
    process.env[item] = obj[item];
  });
  createPackage('hugo-toolkit-abc');
  createPackage('hugo-plugin-defg');
}

function clearConfig(obj) {
  clearPackage();
  Object.keys(obj).forEach(item => {
    delete process.env[item];
  });
}

describe('# fie-module', () => {
  beforeEach(() => {
    initConfig(testObject);
  });

  afterEach(() => {
    clearConfig(testObject);
  });

  describe('# get()', () => {
    it('# 从线上 获取 fie 插件或套件', function*() {
      // 从线上获取
      const data = yield fieModule.get('hugo-toolkit-empty-module');
      expect(data)
        .to.be.an('object')
        .to.have.property('start');
    });

    it('# 获取本地mock fie 插件或套件', function*() {
      // 从线上获取
      const data = yield fieModule.get('hugo-toolkit-abc');
      expect(data)
        .to.be.an('object')
        .to.have.property('start');
    });
  });

  describe('# localList()', () => {
    it('# 获取 fie 插件和套件', function*() {
      const data = yield fieModule.localList();
      expect(data)
        .to.be.an('array')
        .to.have.lengthOf(2);
      expect(data[0]).to.be.an('object');
      expect(data[0]).to.have.property('name');
    });

    it('# 只获取 fie 插件', function*() {
      const data = yield fieModule.localList({
        type: 'plugin',
      });
      expect(data)
        .to.be.an('array')
        .to.have.lengthOf(1);
      expect(data[0]).to.be.an('object');
      expect(data[0]).to.have.property('name', 'hugo-plugin-defg');
    });

    it('# 只获取 fie 套件', function*() {
      const data = yield fieModule.localList({
        type: 'toolkit',
      });
      expect(data)
        .to.be.an('array')
        .to.have.lengthOf(1);
      expect(data[0]).to.be.an('object');
      expect(data[0]).to.have.property('name', 'hugo-toolkit-abc');
    });
  });

  describe.skip('# onlineList()', () => {
    it('# 获取 线上 fie 插件和套件', function*() {
      // 注意：npm.taobao.org 在travis上调用不通
      const data = yield fieModule.onlineList();
      /* eslint-disable no-unused-expressions */
      expect(data).to.be.an('array').to.not.be.empty;
      expect(data[0]).to.be.an('object');
      expect(data[0]).to.have.property('name');
    });
  });
});
