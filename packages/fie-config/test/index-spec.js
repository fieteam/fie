'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs-extra');


describe('# fie-config', () => {
  const mockCwd = path.resolve(__dirname, 'fixtures');
  const source = path.resolve(mockCwd, 'source.fie.config.js');
  const mock = path.resolve(mockCwd, 'fie.config.js');
  const config = proxyquire('../lib/index', {});

  before(() => {
    fs.copySync(source, mock);
  });
  after(() => {
    if (fs.existsSync(mock)) {
      fs.unlinkSync(mock);
    }
  });

  it('# get 获取数据', () => {
    expect(config.get('abc', mockCwd)).to.be.deep.equals({
      xyz: 22
    });
  });

  it('# set 设置数据', () => {
    config.set('abc', {
      xyz: 23
    }, mockCwd);
    expect(config.get('abc', mockCwd)).to.be.deep.equals({
      xyz: 23
    });
  });

  it('# set value是一个字符串对象', () => {
    config.set('gg',
`
//这是一行注释
{
  "good" : "yes"
}
      `
, mockCwd);
    expect(config.get('gg', mockCwd)).to.be.deep.equals({
      good: 'yes'
    });
  });

  it('# set value是一个带.的字符串', () => {
    config.set('xx.yy', '123', mockCwd);
    expect(config.get('xx', mockCwd)).to.be.deep.equals({
      yy: 123
    });
  });

  it('# set value是一个带.的字符串', () => {
    config.set('tasks.build', [{
      command: 'echo 44'
    }], mockCwd);
    expect(config.get('tasks', mockCwd)).to.have.property('build');
    expect(config.get('tasks', mockCwd)).to.have.deep.property('build[0].command', 'echo 44');
  });

  it('# getToolkitName 获取套件的名字', () => {
    const toolkit = config.getToolkitName(mockCwd);
    expect(toolkit).to.be.equal('fie-toolkit-dev');
  });

  it('# getConfigName 获取配置文件的名称' , () => {
  	const name = config.getConfigName();
		expect(name).to.be.equal('fie.config.js');
	})
});


describe('# other-config', () => {
  //设置config文件未其他类型的文件
	process.env.FIE_CONFIG_FILE = 'qn.config.js';
	const mockCwd = path.resolve(__dirname, 'fixtures');
	const source = path.resolve(mockCwd, 'source.fie.config.js');
	const mock = path.resolve(mockCwd, 'qn.config.js');
	const config = proxyquire('../lib/index', {});

	before(() => {
		fs.copySync(source, mock);
	});
	after(() => {
		process.env.FIE_CONFIG_FILE = 'qn.config.js';
		if (fs.existsSync(mock)) {
			fs.unlinkSync(mock);
		}
	});

	it('# get 获取数据', () => {
		expect(config.get('abc', mockCwd)).to.be.deep.equals({
			xyz: 22
		});
	});


	it('# getToolkitName 获取套件的名字', () => {
		const toolkit = config.getToolkitName(mockCwd);
		expect(toolkit).to.be.equal('fie-toolkit-dev');
	});

	it('# getConfigName 获取配置文件的名称' , () => {
		const name = config.getConfigName();
		expect(name).to.be.equal('qn.config.js');
	})
});
