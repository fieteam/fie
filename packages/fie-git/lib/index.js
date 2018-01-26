'use strict';

const git = require('git-rev-sync');
const shelljs = require('shelljs');

const root = process.cwd();

const parseStatus = function (str) {
  let branch_line;
  const status = {
    local_branch: null,
    remote_branch: null,
    remote_diff: null,
    clean: true,
    files: []
  };
  let result;
  const initial_commit_rx = /^## Initial commit on ([^\n]+)\s?$/;
  const lines = str.trim().split('\n');
  branch_line = lines.shift();

  result = branch_line.match(initial_commit_rx);
  if (result) {
    status.local_branch = result[1];
    return status;
  }

  branch_line = branch_line.replace(/##\s+/, '');

  const branches = branch_line.split('...');
  status.local_branch = branches[0];
  status.remote_diff = null;
  if (branches[1]) {
    result = branches[1].match(/^([^\s]+)/);
    status.remote_branch = result[1];
    result = branches[1].match(/\[([^\]]+)\]/);
    status.remote_diff = result ? result[1] : null;
  }
  lines.forEach((s) => {
    if (s.match(/\S/)) {
      status.files.push(s);
    }
  });
  status.clean = status.files.length === 0;
  return status;
};

/**
 * 获取git的提交状态
 * return
 * { local_branch: 'xxx',
     remote_branch: null,
     remote_diff: null,
     clean: true/false,
     files: []
   }
 */
git.status = function (cwd) {
  cwd = cwd || root;
  const result = (shelljs.exec('git status --porcelain -b', { silent: true, cwd }).stdout.toString() || '').trim();
  return parseStatus(result);
};


/**
 * 获取项目URL
 * @returns {*}
 */
git.repository = function (cwd) {
  cwd = cwd || root;
  let repository;
  try {
    repository = (shelljs.exec('git config --get remote.origin.url', { silent: true, cwd }).stdout.toString() || '').trim();
    // 有些git的url是http开头的，需要格式化为git@格式，方便统一处理
    const match = repository.match(/^(http|https):\/\/gitlab.alibaba-inc.com\/(.*)/);
    if (match && match[2]) {
      repository = `git@gitlab.alibaba-inc.com:${match[2]}`;
    }
  } catch (err) {
    console.error('git config 错误：', err.message);
  }
  return repository;
};

/**
 * 获取项目的project name 和 group name
 */
git.project = function (cwd) {
  cwd = cwd || root;
  const repository = git.repository(cwd);
  const match = repository.match(/git@(.*):(.*)/);
  if (match && match[2]) {
    return match[2].replace('.git', '');
  }
};

/**
 * @exports fie-git
 */
module.exports = git;
