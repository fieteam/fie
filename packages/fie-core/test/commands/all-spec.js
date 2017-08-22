/**
 * Created by hugo on 2017/7/21.
 */
const path = require('path');
const fs = require('fs-extra');

let spy;
let spyError;


describe('# 执行help命令', () => {
  const mockCwd = path.resolve(__dirname, '../fixtures');
  const source = path.resolve(mockCwd, 'notoolkit.fie.config.js');
  const mock = path.resolve(mockCwd, 'fie.config.js');

  before(() => {
    process.env.FIE_CONFIG_PATH = mockCwd;
    fs.copySync(source, mock);
    spy = sinon.spy(console, 'log');
    spyError = sinon.spy(console, 'error');
  });

  after(() => {
    delete process.env.FIE_CONFIG_PATH;
    if (fs.existsSync(mock)) {
      fs.unlinkSync(mock);
    }
    spy.restore();
    spyError.restore();
  });

  it('# 存在fie.confie.js，无套件且存在start任务流时', function* () {
    yield require('../../commands/all')('start', []);
    /* eslint-disable no-unused-expressions */
    expect(console.log).to.have.been.called;
    expect(console.error).to.not.have.been.called;
    // 调用了5次console
    expect(spy.callCount).to.equal(2);
  });
});
