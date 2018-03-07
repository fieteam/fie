# fie-commands

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-cache.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-cache
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-cache
[snyk-image]: https://snyk.io/test/npm/fie-cache/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-cache
[download-image]: https://img.shields.io/npm/dm/fie-cache.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-cache

fie 核心命令工具，用于以fie核心库为基础创建cli工具时使用。

## Installation

```
npm install fie-commands --save
```

## 例子

```js

const fieCommands = require('fie-commands');

//fie 核心运行命令
const coreCommands = Object.keys(fieCommands).filter( (item) =>{
return item !== 'main';
});

  
const fieArgv = argv();
const command = fieArgv.command;
const newArgv = fieArgv.argv;


if (coreCommands.indexOf(command) === -1) {
log.debug('进入套件,插件分支');
yield fieCommands.main.apply(this, [command, newArgv]);
} else {
log.debug('进入核心命令分支');
// init, install, install, uninstall, update ,version 等命令
// 对 fie.config.js 没有依赖, 也不考虑兼容旧版, 也不执行自定义命令流
yield fieCommands[command].apply(null, [newArgv]);
}

```

## API

### main()

> 所有的套件/插件都走这个命令进行处理。

自定义prefix 本地套件/插件 -> FIE本地套件/插件 -> 自定义线上套件/插件 -> FIE线上套件/插件

### clear()

> 清除fie缓存

### help()

> 查看FIE 及 套件的 帮助信息

### ii()

> 快速安装npm包

### install()

> 套件 generate 初始化模板操作

### list()

> 列出所有的fie套件,插件

### switch()

> 切换阿里内外网环境

### update()

> 更新fie所有套件及插件

### version()

> 显示fie版本号 

### locale()

> 切换多语言


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: hugohua <baofen14787@gmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
