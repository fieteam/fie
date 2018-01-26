/**
 * Created by hugo on 2017/7/21.
 */

'use strict';

const message = require('../locale/index');

describe('# fie-commands/locale/index', () => {
  it('# 判断语言文件是否有遗漏key', function*() {
    const lang = Object.keys(message);
    // 两个语言
    expect(lang)
      .to.be.an('array')
      .and.to.have.lengthOf(2);
    const zh = Object.keys(lang[0]);
    const en = Object.keys(lang[1]);
    expect(zh).to.deep.equal(en);
  });
});
