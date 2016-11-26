'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const proxyquire = require('proxyquire');
const fs = require('fs');
const emptyLog = require('../../../test/fixtures/empty-log');


describe('# move 移动文件', () => {
  const beforeMove = path.resolve(__dirname, 'fixtures', 'before-move');
  const afterMove = path.resolve(__dirname, 'fixtures', 'before-move');
  const tmpData = { a: Math.random() };
  const move = proxyquire('../lib/move', {
    'fie-log': emptyLog
  });

  before(() => {
    jsonfile.writeFileSync(beforeMove, tmpData);
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
    expect(jsonfile.readFileSync(afterMove)).to.be.deep.equals(tmpData);
  });
});
