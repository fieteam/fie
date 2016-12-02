'use strict';

const proxyquire = require('proxyquire');
const emptyLog = require('../../../test/fixtures/empty-log');

let tmpString = '';
let envYyy = '';
const spy1 = sinon.spy((arg1, next) => {
  tmpString += 'a';
  next();
});
const spy2 = sinon.spy();
const spy3 = sinon.spy((next) => {
  tmpString += 'c';
  next();
});
const spawnStub = function () {
  envYyy = process.env.yyy;
  return {
    on(event, cb) {
      if (event === 'close') {
        cb(0);
      }
    }
  };
};
const spawn = sinon.spy(spawnStub);
const run = proxyquire('../lib/run', {
  'fie-log': emptyLog,
  'cross-spawn': spawn
});

describe('# run 执行任务', () => {
  afterEach(() => {
    spy1.reset();
    spy2.reset();
    spy3.reset();
    spawn.reset();
    tmpString = '';
  });

  it('# 执行前置任务, 支持普通函数和generator函数', function* () {
    yield run({
      tasks: [{
        func: spy1
      }, {
        * func() {
          yield new Promise((resolve) => {
            spy2.apply(this, [].slice.call(arguments));
            setTimeout(() => {
              tmpString += 'b';
              resolve();
            }, 10);
          });
        }
      }, {
        command: 'testCommand1'
      }, {
        command: '__toolkitCommand__'
      }, {
        func: spy3
      }, {
        command: 'testCommand2'
      }],
      args: ['testArg']
    });
    tmpString += 'c';

    expect(spy1.callCount).to.be.equal(1);
    spy1.should.calledWith('testArg');
    expect(spy2.callCount).to.be.equal(1);
    spy2.should.calledWithExactly('testArg');
    expect(spy3.callCount).to.be.equal(0);
    expect(spawn.callCount).to.be.equal(1);
    expect(spawn.getCall(0).args[0]).to.be.equal('testCommand1');
    expect(tmpString).to.be.equal('abc');
  });


  it('# 执行后置任务, 支持普通函数和generator函数', function* () {
    yield run({
      tasks: [{
        func: spy3
      }, {
        command: 'testCommand2'
      }, {
        command: '__toolkitCommand__'
      }, {
        func: spy1
      }, {
        * func() {
          yield new Promise((resolve) => {
            spy2.apply(this, [].slice.call(arguments));
            setTimeout(() => {
              tmpString += 'b';
              resolve();
            }, 10);
          });
        }
      }, {
        command: 'testCommand1'
      }],
      args: ['testArg'],
      when: 'after'
    });
    tmpString += 'c';

    expect(spy1.callCount).to.be.equal(1);
    expect(spy1.calledWith('testArg')).to.be.equal(true);
    expect(spy2.callCount).to.be.equal(1);
    expect(spy2.calledWithExactly('testArg')).to.be.equal(true);
    expect(spy3.callCount).to.be.equal(0);
    expect(spawn.callCount).to.be.equal(1);
    expect(spawn.getCall(0).args[0]).to.be.equal('testCommand1');
    expect(tmpString).to.be.equal('abc');
  });


  it('# 没有 __toolkitCommand__ 的情况下都是前置任务', function* () {
    yield run({
      tasks: [{
        func: spy1
      }, {
        command: 'testCommand1'
      }],
      args: ['testArg']
    });
    tmpString += 'c';

    expect(spy1.callCount).to.be.equal(1);
    expect(spy1.calledWith('testArg')).to.be.equal(true);
    expect(spawn.callCount).to.be.equal(1);
    expect(spawn.getCall(0).args[0]).to.be.equal('testCommand1');
    expect(tmpString).to.be.equal('ac');
  });


  it('# async 为 true 的话，无须等待直接执行后面的任务', function* () {
    yield run({
      tasks: [{
        func() {
          return new Promise((resolve) => {
            setTimeout(() => {
              tmpString += 'a';
              resolve();
            }, 10);
          });
        },
        async: true
      }, {
        func(next) {
          tmpString += 'b';
          next();
        }
      }]
    });
    tmpString += 'c';

    // 异步测试写法
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(tmpString).to.be.equal('bca');
        resolve();
      }, 10);
    });
  });

  it('# 错误能被上层 catch 到, 且后面的任务被中断(异步任务无法被catch)', function* () {
    let errorMsg = '';
    try {
      yield run({
        tasks: [{
          * func() {
            yield new Promise((resolve, reject) => {
              setTimeout(() => {
                reject(new Error('testError'));
              }, 10);
            });
          }
        }, {
          command: 'testCommand1'
        }]
      });
    } catch (e) {
      errorMsg = e.message;
    }

    expect(errorMsg).to.be.equal('testError');
    expect(spawn.callCount).to.be.equal(0);
  });


  it('# 会将 $$ 替换成 fie 命令后面的参数', function* () {
    process.argv = ['fie', 'start', '--port', '8888'];
    yield run({
      tasks: [{
        command: 'yoo sss $$'
      }],
      command: 'start'
    });

    spawn.should.calledWith('yoo', ['sss', '--port', '8888']);
  });

  it('# 运行命令行时环境变量可以正常设置且正常 restore', function* () {
    const beforeEnv = 'beforeEnv';
    const testEnv = 'testEnv';
    process.env.yyy = beforeEnv;
    yield run({
      tasks: [{
        command: `yyy=${testEnv} echo xxx`
      }],
      command: 'start'
    });

    expect(envYyy).to.be.equals(testEnv);
    expect(process.env.yyy).to.be.equals(beforeEnv);
  });
});
