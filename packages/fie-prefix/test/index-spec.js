const path = require('path');
const fs = require('fs-extra');
const fieModule = require('../lib/index');

const mockCwd = path.resolve(__dirname, 'fixtures');

const testObject = {
  FIE_MODULE_PREFIX: 'fie',
  FIE_HOME: mockCwd,
  FIE_HOME_FOLDER: 'fie',
  FIE_ENV: 'extranet'
};

function initConfig(obj) {
  Object.keys(obj).forEach( item => {
    process.env[item] = obj[item];
  } )
}

function clearConfig(obj) {
  Object.keys(obj).forEach( item => {
    delete process.env[item];
  } )
}


describe('# get()', () => {

  before( () => {

    // fs.ensureDirSync(mockCwd);

    initConfig(testObject);

  });

  after( () => {
    clearConfig(testObject);
  } );

  it('# 获取 fie 插件或套件', function* () {
    const data = yield fieModule.get('@ali/lzd-toolkit-next');
    console.log(data);

  });
});

describe('# localList()', () => {

  before( () => {
    initConfig(testObject);
  });

  after( () => {
    clearConfig(testObject);
  } );

  it('# 获取 fie 插件和套件', function* () {
    const data = yield fieModule.localList();
    expect(data).to.be.an('array').to.have.lengthOf(2);
    expect(data[0]).to.be.an('object');
    expect(data[0]).to.have.property('name');
  });

  it('# 只获取 fie 插件', function* () {
    const data = yield fieModule.localList({
      type : 'plugin'
    });
    expect(data).to.be.an('array').to.have.lengthOf(1);
    expect(data[0]).to.be.an('object');
    expect(data[0]).to.have.property('name','lzd-plugin-def');
  });

  it('# 只获取 fie 套件', function* () {
    const data = yield fieModule.localList({
      type : 'toolkit'
    });
    expect(data).to.be.an('array').to.have.lengthOf(1);
    expect(data[0]).to.be.an('object');
    expect(data[0]).to.have.property('name','lzd-toolkit-abc');
  });

});

describe('# onlineList()', () => {

  before( () => {
    initConfig(testObject);
  });

  after( () => {
    clearConfig(testObject);
  } );

  it.only('# 获取 线上 fie 插件和套件', function* () {
    const data = yield fieModule.onlineList({
      cache : false
    });
    console.log(data);

    // expect(data).to.be.an('array').to.have.lengthOf(2);
    // expect(data[0]).to.be.an('object');
    // expect(data[0]).to.have.property('name');
  });


});