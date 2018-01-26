'use strict';

const fieGit = require('../lib/index');

describe('# fie-git', () => {

  it('status 获取git提交状态', () => {
    const status = fieGit.status();
    expect(status).to.be.an('object').to.have.a.property('local_branch');
  });

  it('repository 获取仓库地址', () => {
    const repository = fieGit.repository();
    expect(repository).to.be.eq('git@github.com:fieteam/fie.git');
  });

  it('repository 获取仓库名称', () => {
    const project = fieGit.project();
    expect(project).to.be.eq('fieteam/fie');
  });


});
