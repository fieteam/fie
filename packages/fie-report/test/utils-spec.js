'use strict';

const utils = require('../lib/utils');

describe('# getCommand', () => {

	it('获取mac下的执行命令', () => {
		const result = utils.getCommand(['/Users/hugo/gitlab/nvm/versions/node/v6.2.1/bin/node','fie','build']);
		expect(result).to.be.equals('fie build');
	});

	it('获取window下的执行命令', () => {
		const result = utils.getCommand(['D:\\Program Files\\Node\\bin\\node.exe','fie','build']);
		expect(result).to.be.equals('fie build');
	});

	it('获取window下的执行命令', () => {
		const result = utils.getCommand(['D:\\Program Files\\Node\\node.exe','fie','build']);
		expect(result).to.be.equals('fie build');
	});

});

