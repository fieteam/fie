'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const proxyquire = require('proxyquire');
const fs = require('fs');
const emptyLog = require('../../../test/fixtures/empty-log');


describe('# remove 删除文件', () => {
  const beforeDelete = path.resolve(__dirname, 'fixtures', 'before-delete');
  const remove = proxyquire('../lib/remove', {
    'fie-log': emptyLog
  });

  before(() => {
    jsonfile.writeFileSync(beforeDelete, { a: 1 });
  });
  after(() => {
    if (fs.existsSync(beforeDelete)) {
      fs.unlinkSync(beforeDelete);
    }
  });

  it('# 执行删除', () => {
    remove(beforeDelete);
    expect(fs.existsSync(beforeDelete)).to.be.equals(false);
  });
});
