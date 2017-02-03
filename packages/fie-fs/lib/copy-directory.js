/**
 * @desc copy file
 * @see http://fie.alibaba.net/doc?package=fie-home
 * @requires @ali/fie-logger
 * @requires underscore
 * @author 擎空 <qingkong@alibaba-inc.com>
 * @namespace copy-directory
 * @memberOf fie-fs
 * @exports copy-directory
 */


'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const utils = require('./utils');
const log = require('fie-log')('fie-fs');

_.templateSettings = utils.templateSettings;

/**
 * 复制目录
 * 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
 * @param {object} options
 * @param {string} options.src 绝对路径
 * @param {string} options.dist 绝对路径
 * @param {string} options.data
 * @param {array} options.ignore 数组, 类似 gitignore 的写法
 * @param {object} options.templateSettings, 默认是 { evaluate: /<{%([\s\S]+?)%}>/g,
 *                                                   interpolate: /<{%=([\s\S]+?)%}>/g,
 *                                                    escape: /<{%-([\s\S]+?)%}>/g
 *                                                  }
 */

function copyDirectory(options) {
  // 递归读取目录
  const recursiveDir = (curSrcPath, curDistPath) => {
    const stats = fs.statSync(curSrcPath);

    if (stats.isDirectory()) {
      // 若目标目录不存在, 会创建一个
      fs.mkdirsSync(curDistPath);

      const dirFiles = fs.readdirSync(curSrcPath);

      for (let i = 0; i < dirFiles.length; i += 1) {
        if (options.ignore.indexOf(dirFiles[i]) === -1) {
          recursiveDir(path.resolve(curSrcPath, dirFiles[i]), path.resolve(curDistPath, dirFiles[i]));
        }
      }
    } else {
      curDistPath = curDistPath.split(path.sep);

      // 文件名转换
      const newFilename = options.filenameTransformer(curDistPath.pop());
      if (!newFilename) {
        log.error(`${curDistPath.join(path.sep)} 文件名转换失败, 返回为空`);
        return;
      }
      curDistPath = path.resolve(curDistPath.join(path.sep), newFilename);

      // 文件内容变量替换
      let fileContent = fs.readFileSync(curSrcPath, { encoding: options.encoding }).toString();
      fileContent = _.template(fileContent)(options.data);

      for (let j = 0; j < options.stringReplace.length; j += 1) {
        fileContent = fileContent.replace(new RegExp(options.stringReplace[j].placeholder, 'g'), options.stringReplace[j].value);
      }

      const writeErr = fs.writeFileSync(curDistPath, fileContent);
      if (!writeErr) {
        log.success(`${curDistPath} 写入成功`);
      } else {
        log.error(`${curDistPath} 写入出错`);
      }
    }
  };

  options = options || {};

  if (!options.src || !options.dist) {
    log.error('请传入源文件目录路径(src) 和 目标目录路径(dist)');
    return;
  }

  if (!fs.existsSync(options.src)) {
    log.error(`源文件目录不存在， src = ${options.src} 不存在这个目录或文件`);
    return;
  }

  options.data = options.data || {};
  options.ignore = options.ignore || ['node_modules', '.DS_Store', '.idea'];
  options.stringReplace = options.stringReplace || [];
  options.filenameTransformer = options.filenameTransformer || (a => a);

  // 开发者可以自定义模板标签类型
  if (options.templateSettings) {
    _.templateSettings = Object.assign({}, _.templateSettings, options.templateSettings);
  }

  recursiveDir(options.src, options.dist);
}

module.exports = copyDirectory;
