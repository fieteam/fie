'use strict';

const fs = require('fs-extra');
const path = require('path');

let fieEnv;
let envFile;

describe('# fie-env', () => {
  before(() => {
    // 先设置FIE的home目录为test/helpers;
    process.env.FIE_HOME = path.join(__dirname, 'helpers');
    fs.mkdirsSync(process.env.FIE_HOME);
    fieEnv = require('../lib/index');

    envFile = path.join(process.env.FIE_HOME, '.fie/fie.env.json');
  });

  after(() => {
    fs.removeSync(path.join(process.env.FIE_HOME));
    delete process.env.FIE_HOME;
  });


  describe('# setEnv', () => {
    it('# setEnv 设置内网环境', () => {
      fieEnv.setEnv('intranet');

      const file = fs.existsSync(envFile);
      const fileData = fs.readJsonSync(envFile);
      // 判断文件是否存在
      expect(file).to.be.equals(true);
      // 判断文件内容
      expect(fileData).to.be.an('object');
      expect(fileData).to.deep.equal({ env: 'intranet' });
    });

    it('# setIntranetEnv 设置内网环境', () => {
      fieEnv.setIntranetEnv();

      const file = fs.existsSync(envFile);
      const fileData = fs.readJsonSync(envFile);

      // 判断文件是否存在
      expect(file).to.be.equals(true);
      // 判断文件内容
      expect(fileData).to.be.an('object');
      expect(fileData).to.deep.equal({ env: 'intranet' });
    });

    it('# setExtranetEnv 设置外网环境', () => {
      fieEnv.setExtranetEnv();
      const file = fs.existsSync(envFile);
      const fileData = fs.readJsonSync(envFile);
      // 判断文件是否存在
      expect(file).to.be.equals(true);
      // 判断文件内容
      expect(fileData).to.be.an('object');
      expect(fileData).to.deep.equal({ env: 'extranet' });
    });
  });


  describe('# isIntranet', () => {
    it('# 判断是否是内网', () => {
      fieEnv.setIntranetEnv();
      const result = fieEnv.isIntranet();
      expect(result).to.be.equals(true);
    });

    it('# 判断是否是外网', () => {
      fieEnv.setExtranetEnv();
      expect(fieEnv.isIntranet()).to.be.equals(false);
    });

    it('# 通过env环境变量判断是否是内网', () => {
      process.env.FIE_ENV = 'intranet';
      const result = fieEnv.isIntranet();
      expect(result).to.be.equals(true);

      delete process.env.FIE_ENV;
    });

    it('# 通过env环境变量判断是否是外网', () => {
      process.env.FIE_ENV = 'extranet';
      const result = fieEnv.isIntranet();
      expect(result).to.be.equals(false);
      delete process.env.FIE_ENV;
    });

    it('# 多次调用可读取缓存', () => {
      // 设置为内网
      fieEnv.setIntranetEnv();
      const result = fieEnv.isIntranet();
      expect(result).to.be.equals(true);
      // 第二次调用时应该走的是cache
      // 先手动改一下文件内容,再判断是否为true
      fs.outputJsonSync(envFile, { env: 'extranet' });
      const result2 = fieEnv.isIntranet();
      expect(result2).to.be.equals(true);
    });
  });

  describe('# hasConfigFile', () => {
    beforeEach(() => {
      fs.removeSync(envFile);
    });

    it('# 初始化后则存在配置文件', () => {
      fieEnv.setIntranetEnv();
      const result = fieEnv.hasConfigFile();
      expect(result).to.be.equals(true);
    });

    it('# 尚未初始化则不存在配置文件', () => {
      const result = fieEnv.hasConfigFile();
      expect(result).to.be.equals(false);
    });
  });

  describe('# removeConfigFile', () => {
    beforeEach(() => {
      fs.removeSync(envFile);
    });

    it('# 不存在配置文件', () => {
      fieEnv.setIntranetEnv();
      fieEnv.removeConfigFile();
      const result = fs.existsSync(envFile);
      expect(result).to.be.equals(false);
    });
  });
});
