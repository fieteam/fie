'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs');
const emptyLog = require('../../../test/fixtures/empty-log');


describe('# rewrite 重写文件', () => {
  const src = path.resolve(__dirname, 'fixtures', 'src.js');
  const beforeDist = path.resolve(__dirname, 'fixtures', 'before-dist.js');
  const afterDist = path.resolve(__dirname, 'fixtures', 'after-dist.js');
  const topDist = path.resolve(__dirname, 'fixtures', 'top-dist.js');
  const bottomDist = path.resolve(__dirname, 'fixtures', 'bottom-dist.js');
  const dist = path.resolve(__dirname, 'fixtures', 'dist.js');
  const rewriteFile = proxyquire('../lib/rewrite-file', {
    'fie-log': emptyLog
  });

  before(() => {
    if (fs.existsSync(dist)) {
      fs.unlinkSync(dist);
    }
  });

  after(() => {
    if (fs.existsSync(dist)) {
      fs.unlinkSync(dist);
    }
  });

  it('# 不传入 src 的情况下返回空字符串', () => {
    const content = rewriteFile({});
    expect(content).to.be.equals('');
  });


  it('# 传入 src 的情况返回转换过后的字符串及创建目标文件(place 默认为 after, srcMod 默认为 0, noMatchActive 默认为 null)', () => {
    const content = rewriteFile({
      src,
      dist,
      hook: 'hook',
      insertLines: [`  attr1: 'value1',`, `  attr2: 'value2',`]
    });
    const afterDistContent = fs.readFileSync(afterDist).toString();
    const distContent = fs.readFileSync(dist).toString();

    expect(content).to.be.equals(afterDistContent);
    expect(distContent).to.be.equals(afterDistContent);
  });


  it('# place 为 before 时需要将新行插入 hook 前面', () => {
    const content = rewriteFile({
      src,
      hook: 'hook',
      insertLines: [`  attr1: 'value1',`, `  attr2: 'value2',`],
      place: 'before'
    });

    expect(content).to.be.equals(fs.readFileSync(beforeDist).toString());
  });


  it('# scrMod 为 1 时传入文件内容可以正常解析', () => {
    const content = rewriteFile({
      src: fs.readFileSync(src),
      hook: 'hook',
      insertLines: [`  attr1: 'value1',`, `  attr2: 'value2',`],
      srcMode: 1
    });

    expect(content).to.be.equals(fs.readFileSync(afterDist).toString());
  });


  it('# noMatchActive 为 top, 没有找到 hook 时新行添加到顶部', () => {
    const content = rewriteFile({
      src,
      hook: 'noHookOfThis',
      insertLines: ['// yiii'],
      noMatchActive: 'top'
    });

    expect(content).to.be.equals(fs.readFileSync(topDist).toString());
  });


  it('# noMatchActive 为 bottom,没有找到 hook 时新行添加到底部', () => {
    const content = rewriteFile({
      src,
      hook: 'noHookOfThis',
      insertLines: ['// yiii'],
      noMatchActive: 'bottom'
    });

    expect(content).to.be.equals(fs.readFileSync(bottomDist).toString());
  });
});
