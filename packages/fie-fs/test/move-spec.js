'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs-extra');
const emptyLog = require('../../../test/fixtures/empty-log');

describe('# move 移动文件', () => {
  const beforeMove = path.resolve(__dirname, 'fixtures', 'before-move');
  const afterMove = path.resolve(__dirname, 'fixtures', 'before-move');
  const tmpData = { a: Math.random() };
  const move = proxyquire('../lib/move', {
    'fie-log': emptyLog,
  });

  before(() => {
    fs.outputJsonSync(beforeMove, tmpData);
  });
  after(() => {
    if (fs.existsSync(beforeMove)) {
      fs.unlinkSync(beforeMove);
    }
    if (fs.existsSync(afterMove)) {
      fs.unlinkSync(afterMove);
    }
  });

  it('# 执行移动', () => {
    move(beforeMove, afterMove);
    expect(fs.readJsonSync(afterMove)).to.be.deep.equals(tmpData);
  });
});
