'use strict';

const path = require('path');
const fs = require('fs-extra');
const utils = require('../lib/utils');

describe('# fie-report/lib/utils', () => {
  describe('# getCommand', () => {
    it('获取mac下的执行命令', () => {
      const result = utils.getCommand([
        '/Users/hugo/gitlab/nvm/versions/node/v6.2.1/bin/node',
        'fie',
        'build',
      ]);
      expect(result).to.be.equals('fie build');
    });

    it('获取window下的执行命令', () => {
      const result = utils.getCommand(['D:\\Program Files\\Node\\bin\\node.exe', 'fie', 'build']);
      expect(result).to.be.equals('fie build');
    });

    it('获取window下的执行命令', () => {
      const result = utils.getCommand(['D:\\Program Files\\Node\\node.exe', 'fie', 'build']);
      expect(result).to.be.equals('fie build');
    });
  });

  describe('# getProjectInfo', () => {
    // mock一下环境
    let mockCwd;
    let source;
    let mock;
    let sourceHead;
    let distHead;

    before(() => {
      mockCwd = path.resolve(__dirname, 'fixtures');
      source = path.resolve(mockCwd, 'source.fie.config.js');
      mock = path.resolve(mockCwd, 'fie.config.js');
      sourceHead = path.join(mockCwd, 'HEAD');
      distHead = path.join(mockCwd, '.git/HEAD');
      // copy文件
      fs.copySync(source, mock);
      // 创建文件夹
      fs.copySync(sourceHead, distHead);
    });
    after(() => {
      fs.removeSync(mock);
      fs.removeSync(path.join(mockCwd, '.git'));
    });

    it('能获取全部信息', () => {
      const result = utils.getProjectInfo(mockCwd);
      expect(result).to.be.an('object');
      expect(result.fie).to.be.an('object');
      expect(result.branch).to.be.equal('master');
    });
  });
});
