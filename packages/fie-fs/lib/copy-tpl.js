/**
 * @desc 复制文件
 * @author 擎空 <qingkong@alibaba-inc.com>
 * @memberOf fie-fs
 * @namespace copy-tpl
 * @exports copy-tpl
 */


'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const utils = require('./utils');
const log = require('fie-log')('fie-fs');

_.templateSettings = utils.templateSettings;

/**
 * 复制文件
 * 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
 * @param {object} options
 * @exmaple
 * options.src 绝对路径
 * options.dist 绝对路径
 * options.stringReplace 数组 , 将文件里面匹配到的字符串替换掉,如 [ { placeholder: 'PLACEHOLDER', value: 'theReplaceValue' } ]
 * options.data
 *
 */
function copyTpl(options) {
  options.data = options.data || {};
  options.stringReplace = options.stringReplace || [];
  options.encoding = options.encoding || 'utf-8';


  if (!fs.existsSync(options.src)) {
    log.error(`${options.src} 文件不存在`);
    return;
  }

  if (fs.statSync(options.src).isDirectory()) {
    fs.mkdirsSync(options.dist);
    log.success(`${options.dist} 写入成功`);
    return;
  }

  // 数据模板转换
  let content = fs.readFileSync(options.src, { encoding: options.encoding });
  try {
    content = _.template(content)(options.data);
  } catch (err) {
    log.error(`${options.src} template 失败请检查模板及数据是否正确`);
  }
  for (let j = 0; j < options.stringReplace.length; j += 1) {
    content = content.replace(new RegExp(options.stringReplace[j].placeholder, 'g'), options.stringReplace[j].value);
  }

  // 若没有目录文件需要创建,最终创建文件
  fs.mkdirsSync(path.dirname(options.dist));
  fs.writeFileSync(options.dist, content);
  log.success(`${options.dist} 写入成功`);
}

module.exports = copyTpl;

