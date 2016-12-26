/**
 * @desc 重写文件内容, 本文件不提供读写文件能力,使用者自己读写文件(主要考虑一个文件需要多次被重写)
 * @see http://fie.alibaba.net/doc?package=fie-home
 * @requires @ali/fie-logger
 * @author 擎空 <qingkong@alibaba-inc.com>
 * @memberOf fie-fs
 * @namespace rewrite-file
 * @exports rewrite-file
 */

'use strict';

const fs = require('fs-extra');
const log = require('fie-log')('fie-fs');

/**
 * @desc Hook a string
 * @param {string} content string to be hook
 * @param {object} hookOptions
 * @param {string} hookOptions.hook  判断需要插入行的标记
 * @param {array}  hookOptions.insertLines 数组类型, 每一项为新行
 * @param {string} hookOptions.place   before / after(默认)
 * @param {string} hookOptions.noMatchActive   top / bottom / null(默认)
 * @return {string}
 */
const hookMatchStr = (content, hookOptions) => {
  if (!content) {
    throw Error('parama content and options ');
  }
  const options = hookOptions || {};
  let matchLineIndex = -1;
  const lines = content.split('\n');
  // 找到 match 的行号
  if (options.hook) {
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].indexOf(options.hook) !== -1) {
        matchLineIndex = i;
        break;
      }
    }
  }

  if (matchLineIndex === -1 && options.noMatchActive) {
    // 没有 match 处理
    matchLineIndex = options.noMatchActive === 'top' ? 0 : lines.length - 1;
  } else {
    // 前后位置处理
    options.place === 'after' && (matchLineIndex += 1);
  }

  // 插入内容
  if (matchLineIndex !== -1) {
    lines.splice(matchLineIndex, 0, options.insertLines.join('\n'));
  }

  content = lines.join('\n');
  return content;
};

/**
 * @desc rewriteFile每次调用只能 match 一个hook
 * @param {object} options
 * @param {string} options.src 文件路径或内容
 * @param {string} options.hook  判断需要插入行的标记
 * @param {array}  options.insertLines 数组类型, 每一项为新行
 * @param {string} options.place   before / after(默认)
 * @param {string} options.noMatchActive   top / bottom / null(默认)
 * @param {number} options.srcMode 0:src是文件路径(默认), 1:src 是文件内容
 * @param {number} options.dist 目标路径, 如果有目标路径的话,会自动将文件写入目标路径
 * @return {string}
 */
const rewriteFile = (options) => {
  let content = '';
  options = Object.assign({
    src: '',
    dist: '',
    hook: '',
    insertLines: [],
    place: 'after',
    noMatchActive: '',
    srcMode: 0 // 0 src是文件路径, 1 src 是文件内容
  }, options);

  log.debug('options = %o', options);

  if (options.src === '') {
    log.error('文件路径不能为空');
    return content;
  }

  if (options.srcMode === 0) {
    if (!fs.statSync(options.src).isFile()) {
      log.error('文件路径指向的不是文件');
      return content;
    }
    content = fs.readFileSync(options.src).toString();
  } else {
    content = options.src.toString();
  }

  content = hookMatchStr(content, options);

  if (options.dist) {
    fs.writeFileSync(options.dist, content);
    log.success(`${options.dist} 文件写入成功`);
  }

  return content;
};


module.exports = rewriteFile;

