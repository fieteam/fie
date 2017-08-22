/**
 * Created by hugo on 2017/7/21.
 */
const path = require('path');
const fs = require('fs-extra');
const proxyquire = require('proxyquire');

let spy;


describe('# 执行help命令', () => {
  const mockCwd = path.resolve(__dirname, '../fixtures');
  const source = path.resolve(mockCwd, 'source.fie.config.js');
  const mock = path.resolve(mockCwd, 'fie.config.js');

  before(() => {
    fs.copySync(source, mock);
    spy = sinon.spy(console, 'log');
  });

  after(() => {
    if (fs.existsSync(mock)) {
      fs.unlinkSync(mock);
    }
    spy.restore();
  });


  it('# 非fie项目下，只输出fie帮助信息', function* () {
    yield require('../../commands/help')();
    /* eslint-disable no-unused-expressions */
    expect(console.log).to.have.been.called;
    // 调用了5次console
    expect(spy.callCount).to.be.at.most(5);
  });

  it('# fie项目下，同时输出套件信息和fie帮助信息', function* () {
    const help = proxyquire('../../commands/help', {
      'fie-config': {
        getToolkitName() {
          return 'fie-toolkit-dev';
        }
      }
    });
    yield help();

    /* eslint-disable no-unused-expressions */
    expect(console.log).to.have.been.called;
    // 调用了11次console
    expect(spy.callCount).to.be.at.most(11);

    const hasHelp = spy.args.some(val => val[0].indexOf('以下是 fie 自身的命令') !== -1);
    /* eslint-disable no-unused-expressions */
    expect(hasHelp).to.be.true;
  });
});
