'use strict';

const fieNpm = require('../lib/index');
const path = require('path');
const fs = require('fs-extra');

const testRoot = path.join(__dirname, 'helper');
require('mocha-generators').install();


describe('# fie-npm', () => {
  after(() => {
    // 测试后就清空一下
    fs.removeSync(path.join(testRoot, 'node_modules'));
    fs.removeSync(path.join(testRoot, 'helper/package.json'));
  });

  describe('# install()', () => {
    it('# 安装一个存在的包', function* () {
      yield fieNpm.install('co', {
        cwd: testRoot
      });
      const module = fs.existsSync(path.join(testRoot, 'node_modules/co'));
      expect(module).to.be.equals(true);
    });

    it('# 安装多个包', function* () {
      yield fieNpm.install(['concat-map', 'co-thread'], {
        cwd: testRoot
      });
      expect(fs.existsSync(path.join(testRoot, 'node_modules/concat-map'))).to.be.equals(true);
      expect(fs.existsSync(path.join(testRoot, 'node_modules/co-thread'))).to.be.equals(true);
    });

    it('# 成功安装一个存在的包到package', function* () {
      yield fieNpm.install('fs-extra', {
        cwd: testRoot,
        save: true
      });
      const module = fs.existsSync(path.join(testRoot, 'node_modules/fs-extra'));
      const hasPackage = fs.existsSync(path.join(testRoot, 'package.json'));
      expect(module).to.be.equals(true);
      expect(hasPackage).to.be.equals(true);

      const pkgData = fs.readJsonSync(path.join(testRoot, 'package.json'));
      expect(pkgData).to.be.an('object');
      expect(pkgData).to.have.any.keys('dependencies');
      expect(pkgData.dependencies).to.have.any.keys('fs-extra');
    });
  });

  describe('# uninstall()', () => {
    it('# 成功删除一个存在的包', function* () {
      yield fieNpm.unInstall('co', {
        cwd: testRoot
      });
      const module = fs.existsSync(path.join(testRoot, 'node_modules/co'));
      expect(module).to.be.equals(false);
    });
  });

  describe('# installDependencies()', () => {
    before(() => {
      fs.copy(path.join(testRoot, '_package.json'), path.join(testRoot, 'package.json'));
    });

    it('# 安装package.json', function* () {
      yield fieNpm.installDependencies({
        cwd: testRoot
      });

      expect(fs.existsSync(path.join(testRoot, 'node_modules/mm'))).to.be.equals(true);
      expect(fs.existsSync(path.join(testRoot, 'node_modules/debug'))).to.be.equals(true);
    });
  });
});
