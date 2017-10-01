const fieModuleName = require('../lib/index');



describe('# fie-module-name', () => {

  before( ()=>{
    process.env.FIE_MODULE_PREFIX = 'abc';
    process.env.FIE_ENV = 'intranet';
  } );

  after( ()=> {
    delete process.env.FIE_MODULE_PREFIX;
  });

  it('# 获取模块的前缀', function () {
    const prefix = fieModuleName.prefix();
    expect(prefix).to.equal('abc')
  });

  it('# 获取套件的前缀', function () {
    const prefix = fieModuleName.toolkitPrefix();
    expect(prefix).to.equal('abc-toolkit-')
  });

  it('# 获取插件的前缀', function () {
    const prefix = fieModuleName.pluginPrefix();
    expect(prefix).to.equal('abc-plugin-')
  });

  it('# 只传名字，成功获取模块的全称', function () {
    const prefix = fieModuleName.toolkitFullName('test');
    expect(prefix).to.equal('@ali/abc-toolkit-test')
  });

  it('# 传套件+名字成功获取模块的全称', function () {
    const prefix = fieModuleName.toolkitFullName('toolkit-test');
    expect(prefix).to.equal('@ali/abc-toolkit-test')
  });

  it('# 传全称获取模块的全称', function () {
    const prefix = fieModuleName.toolkitFullName('@ali/abc-toolkit-test');
    expect(prefix).to.equal('@ali/abc-toolkit-test')
  });

  it('# 只传名字，成功获取插件的全称', function () {
    const prefix = fieModuleName.pluginFullName('test');
    expect(prefix).to.equal('@ali/abc-plugin-test')
  });

  it('# 传套件+名字成功获取插件的全称', function () {
    const prefix = fieModuleName.pluginFullName('plugin-test');
    expect(prefix).to.equal('@ali/abc-plugin-test')
  });

  it('# 传全称获取插件的全称', function () {
    const prefix = fieModuleName.pluginFullName('@ali/abc-plugin-test');
    expect(prefix).to.equal('@ali/abc-plugin-test')
  });

  it('# 获取套件模块全称', function () {
    const prefix = fieModuleName.fullName('toolkit-test');
    expect(prefix).to.equal('@ali/abc-toolkit-test')
  });

  it('# 获取插件模块全称', function () {
    const prefix = fieModuleName.fullName('plugin-test');
    expect(prefix).to.equal('@ali/abc-plugin-test')
  });

  it('# 获取不标准的名称出错', function () {
    const prefix = fieModuleName.fullName('how-are-you');
    expect(prefix).to.equal('how-are-you')
  });




});
