'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs-extra');
const emptyLog = require('../../../test/fixtures/empty-log');

describe('# copy-directory 复制目录', () => {
  const dirSrc = path.resolve(__dirname, 'fixtures', 'dir-src');
  const dirDist = path.resolve(__dirname, 'fixtures', 'dir-dist');
  const copyDirectory = proxyquire('../lib/copy-directory', {
    'fie-log': emptyLog,
  });

  before(() => {
    if (fs.existsSync(dirDist)) {
      fs.removeSync(dirDist);
    }

    // 复制文件
    copyDirectory({
      src: dirSrc,
      dist: dirDist,
      data: {
        name: 'test',
      },
      ignore: ['zzz.js'],
      filenameTransformer(filename) {
        if (filename === 'xxx.js') {
          return 'yyy.js';
        }
        return filename;
      },
      stringReplace: [
        {
          placeholder: 'PLACEHOLDER',
          value: 'theReplaceValue',
        },
      ],
    });
  });

  after(() => {
    if (fs.existsSync(dirDist)) {
      fs.removeSync(dirDist);
    }
  });

  it('# 创建目标目录', () => {
    expect(fs.existsSync(dirDist)).to.be.equals(true);
  });

  it('# 创建目标目录下需要复制过来的文件', () => {
    const abc = path.resolve(dirDist, 'abc.js');
    expect(fs.existsSync(abc)).to.be.equals(true);
  });

  it('# 正常进行变量替换', () => {
    const abc = path.resolve(dirDist, 'abc.js');
    const abcDist = path.resolve(dirSrc, '../dir-dist-abc.js');
    expect(fs.existsSync(abc)).to.be.equals(fs.existsSync(abcDist));
  });

  it('# 不在目标目录下面创建需要忽略的文件', () => {
    expect(fs.existsSync(path.resolve(dirDist, 'zzz.js'))).to.be.equals(false);
  });

  it('# 对文件名进行替换', () => {
    const yyy = path.resolve(dirDist, 'yyy.js');
    const xxx = path.resolve(dirSrc, 'xxx.js');
    expect(fs.existsSync(yyy)).to.be.equals(true);
    expect(fs.readFileSync(yyy)).to.be.deep.equals(fs.readFileSync(xxx));
  });
});
