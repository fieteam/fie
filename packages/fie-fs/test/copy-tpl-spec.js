'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs');
const emptyLog = require('../../../test/fixtures/empty-log');

describe('# copy-tpl 复制文件', () => {
  const copySrc = path.resolve(__dirname, 'fixtures', 'copy-src.js');
  const copyDist = path.resolve(__dirname, 'fixtures', 'copy-dist.js');
  const dist = path.resolve(__dirname, 'fixtures', 'copy-dist-result.js');
  const copyTpl = proxyquire('../lib/copy-tpl', {
    'fie-log': emptyLog,
  });

  after(() => {
    if (fs.existsSync(dist)) {
      fs.unlinkSync(dist);
    }
  });

  it('# 执行复制及变量替换', () => {
    // 复制文件
    copyTpl({
      src: copySrc,
      dist,
      data: {
        name: 'test',
      },
      stringReplace: [
        {
          placeholder: 'PLACEHOLDER',
          value: 'theReplaceValue',
        },
      ],
    });

    const content = fs.readFileSync(dist);
    const copyDistContent = fs.readFileSync(copyDist);
    expect(content).to.be.deep.equals(copyDistContent);
  });
});
