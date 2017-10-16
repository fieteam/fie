'use strict';

const proxyquire = require('proxyquire');
const emptyLog = require('../../../test/fixtures/empty-log');


describe('# runFunction 执行函数', () => {
  let runFunction;
  let tempString;
  let fun1;
  let fun2;
  let funcSpy;

  before(() => {
    runFunction = proxyquire('../lib/run-function', {
      'fie-log': emptyLog
    });

    tempString = '';
    fun1 = () => { tempString += 'a'; };
    fun2 = () => { tempString += 'c'; };
    funcSpy = sinon.spy();
  });

  beforeEach(() => {
    tempString = '';
    funcSpy.reset();
  });

  it('# generator 会以同步形式调用', function* () {
    const mockFunc = function* () {
      funcSpy.apply(this, [].slice.call(arguments));
      fun1();
      yield new Promise((resolve) => {
        setTimeout(() => {
          tempString += 'b';
          resolve();
        }, 10);
      });
    };
    yield runFunction({
      method: mockFunc,
      args: [3, 4],
      next: fun2
    });
    tempString += 'd';
    funcSpy.should.calledWithExactly(3, 4);
    expect(tempString).to.be.equals('abcd');
  });


  it('# 返回 promise 对象的函数会以同步形式调用', function* () {
    const mockFunc = function () {
      funcSpy.apply(this, [].slice.call(arguments));
      fun1();
      return new Promise((resolve) => {
        setTimeout(() => {
          tempString += 'b';
          resolve();
        }, 10);
      });
    };
    yield runFunction({
      method: mockFunc,
      args: [3, 4],
      next: fun2
    });
    tempString += 'd';
    funcSpy.should.calledWithExactly(3, 4, fun2);
    expect(tempString).to.be.equals('abcd');
  });

  it('# 普通函数会以异步形式调用', function* () {
    const mockFunc = function (arg1, arg2, next) {
      funcSpy.apply(this, [].slice.call(arguments));
      fun1();
      tempString += 'b';
      next();
    };
    yield runFunction({
      method: mockFunc,
      args: [3, 4],
      next: fun2
    });
    tempString += 'd';
    funcSpy.should.calledWithExactly(3, 4, fun2);
    expect(tempString).to.be.equals('abcd');
  });


  it('# 报了错，在上层能 catch 到', function* () {
    const mockFunc = function () {
      throw new Error('testErrorMsg');
    };
    const mockFunc2 = function () {
      return new Promise((resolve, reject) => {
        reject(new Error('testErrorMsg2'));
      });
    };
    const mockFunc3 = function* () {
      throw new Error('testErrorMsg3');
    };

    try {
      yield runFunction({
        method: mockFunc
      });
    } catch (e) {
      expect(e.message).to.be.equals('testErrorMsg');
    }

    try {
      yield runFunction({
        method: mockFunc2
      });
    } catch (e) {
      expect(e.message).to.be.equals('testErrorMsg2');
    }

    try {
      yield runFunction({
        method: mockFunc3
      });
    } catch (e) {
      expect(e.message).to.be.equals('testErrorMsg3');
    }
  });
});
