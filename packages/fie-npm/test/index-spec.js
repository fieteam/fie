/**
 * fie-npm 测试，本测试基于信任 cross-spawn 及 npminstall 的基础上，只对自身逻辑代码进行检测
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const proxyquire = require('proxyquire');

const testRoot = path.join(__dirname, 'helper');

let fieNpm;
let spawn;

describe('# fie-npm', () => {
  before(() => {
    spawn = sinon.stub();
    fieNpm = proxyquire('../lib/index', {
      'cross-spawn': function (iter, args, opts) {
        const evnMap = {};
        const retObj = {
          on(evn, fn) {
            evnMap[evn] = fn;
            return retObj;
          }
        };
        setTimeout(() => {
          spawn.apply(this, [iter, args, opts]);
          // 下面测试用例中存在的包都有 co 来测试
          if (args[0] === 'co' || args.filter(item => item.indexOf('-') !== 0).length === 0) {
            evnMap.exit && evnMap.exit();
          } else {
            evnMap.error && evnMap.error(new Error('testError'));
          }
        }, 10);
        return retObj;
      }
    });
  });

  after(() => {
    // 测试后就清空一下
    fs.removeSync(path.join(testRoot, 'node_modules'));
    fs.removeSync(path.join(testRoot, 'helper/package.json'));
  });
  afterEach(() => {
    spawn.reset();
  });

  describe('# install()', () => {
    it('# 安装一个存在的包', function* () {
      yield fieNpm.install('co');

      // 第0次调用的第一个参数的数组的第0个索引对应的值
      expect(spawn.args[0][1][0]).to.be.equals('co');
      expect(spawn.callCount).to.be.equals(1);
    });

    it('# 安装多个包', function* () {
      yield fieNpm.install(['co', 'co-thread']);
      expect(spawn.args[0][1][0]).to.be.equals('co');
      expect(spawn.args[0][1][1]).to.be.equals('co-thread');
      expect(spawn.callCount).to.be.equals(1);
    });

    it('# 成功安装一个存在的包到package', function* () {
      yield fieNpm.install('co', {
        save: true
      });
      let matchSave = false;
      spawn.args[0][1].forEach((item) => {
        if (item === '--save') {
          matchSave = true;
        }
      });
      expect(matchSave).to.be.equals(true);
    });
  });

  describe('# uninstall()', () => {
    // todo 这里没有完整测试
    it('# 成功删除一个存在的包', function* () {
      yield fieNpm.unInstall('co');
      expect(spawn.args[0][1][0]).to.be.equals('co');
      expect(spawn.callCount).to.be.equals(1);
    });
  });

  describe('# installDependencies()', () => {
    it('# 安装 package.json', function* () {
      yield fieNpm.installDependencies();
      // 判断到当前全部是选项，无模块名无报错即算通过
      let modCount = 0;
      spawn.args[0][1].forEach((item) => {
        if (item.indexOf('-') !== 0) {
          modCount += 1;
        }
      });
      expect(modCount).to.be.equals(0);
      expect(spawn.callCount).to.be.equals(1);
    });
  });

  // TODO citest跑不动
  // describe('# has()', () => {
  //  it('# 存在该模块', function* () {
  //    const result = yield fieNpm.has('co');
  //    expect(result).to.be.equals(true);
  //  });
  //
  //  it('# 不存在该模块', function* () {
  //    const result = yield fieNpm.has('this-is-a-not-exist-module');
  //    expect(result).to.be.equals(false);
  //  });
  // });
});
