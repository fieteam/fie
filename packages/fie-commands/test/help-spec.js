/**
 * Created by hugo on 2017/7/21.
 */
const path = require('path');
const fs = require('fs-extra');
const proxyquire = require('proxyquire');

let spy;

const testObject = {
  FIE_MODULE_PREFIX: 'hugo',
  FIE_ENV: 'extranet'
};


function initConfig(obj) {
  Object.keys(obj).forEach( item => {
    process.env[item] = obj[item];
  } );
}

function clearConfig(obj) {
  Object.keys(obj).forEach( item => {
    delete process.env[item];
  } );
}

describe('# fie-commands/lib/help', () => {

  let mockCwd;
  let source;
  let mock;

  before(() => {
    initConfig(testObject);
    mockCwd = path.resolve(__dirname, 'fixtures');
    source = path.resolve(mockCwd, 'source.fie.config.js');
    mock = path.resolve(mockCwd, 'fie.config.js');
    fs.copySync(source, mock);
    spy = sinon.spy(console, 'log');
  });

  after(() => {
    if (fs.existsSync(mock)) {
      fs.unlinkSync(mock);
    }
    spy.restore();
    clearConfig(testObject);
  });


  it('# 非fie项目下，只输出fie帮助信息', function* () {
    yield require('../lib/help')();
    /* eslint-disable no-unused-expressions */
    expect(console.log).to.have.been.called;
    // 调用了5次console
    expect(spy.callCount).to.be.at.most(5);
  });

  it('# fie项目下，同时输出套件信息和fie帮助信息', function* () {

    const help = proxyquire('../lib/help', {
      'fie-config': {
        getToolkitName() {
          return 'hugo-toolkit-empty-module';
        }
      }
    });
    yield help();

    /* eslint-disable no-unused-expressions */
    expect(console.log).to.have.been.called;
    // 调用了11次console
    expect(spy.callCount).to.be.at.most(20);

    const hasHelp = spy.args.some(val => val[0].indexOf('以下是 fie 自身的命令') !== -1);
    /* eslint-disable no-unused-expressions */
    expect(hasHelp).to.be.true;

  });
});
