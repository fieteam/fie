// 清空所有node_modules 目录

'use strict';

const fs = require('fs-extra');
const globby = require('globby');

globby(['node_modules', 'packages/*/node_modules']).then(paths => {
  paths.forEach(item => {
    fs.removeSync(item);
    console.log(`remove ${item} success`);
  });
});
