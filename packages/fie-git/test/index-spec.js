'use strict';

const fieGit = require('../lib/index');

describe('# fie-git', () => {
  it('branch() returns a string with non-zero length', () => {
    const branch = fieGit.branch();
    expect(branch).to.be.a('string');
  });

  it('long() returns string of length 39+', () => {
    const result = fieGit.long();
    expect(result.length > 38).to.be.true;
  });

  it('status() 获取git提交状态', () => {
    const status = fieGit.status();
    expect(status)
      .to.be.an('object')
      .to.have.a.property('local_branch');
  });

  it('repository() 获取仓库地址', () => {
    const repository = fieGit.repository();
    expect(repository).to.be.eq('git@github.com:fieteam/fie.git');
  });

  it('repository() 获取仓库名称', () => {
    const project = fieGit.project();
    expect(project).to.be.eq('fieteam/fie');
  });

  it('tag() 获取远程最新的一个tag', () => {
    const tag = fieGit.tag();
    expect(tag).to.be.a('string');
  });
});
