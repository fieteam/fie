# fie-module

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-module.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-module
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-module
[snyk-image]: https://snyk.io/test/npm/fie-module/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-module
[download-image]: https://img.shields.io/npm/dm/fie-module.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-module

fie 数据缓存模块, 可以用来存储用户常用数据,支持有效期设置

## 安装

```
npm install fie-module --save
```

## API

### get(name)

> `异步方法`, 获取 fie 模块, 需要运行插件和套件都用这个方法来先获取, 如果本地尚示安装, 会自动进行安装,然后返回模块

- name `{string}` 模块名
- return: `{object}` modInfo 模块对象, modInfo.mod 模块对象, modInfo.options 模块的设置项.

```
// 名字会自动补齐
const modInfo = yield fieModule.get('toolkit-blue');
// fieObj 为向下兼容的 
// modInfo.mod 获取插件时是一个函数 ，获取套件时是一个对象，下面挂载几个命令对应的函数
yield modInfo.mod.build(fieObj, {
  clientArgs: ['index']
});
```

### localList([type])

> 获取本地已安装的 fie 插件和套件列表

- type `{string}` 类型，可以是 plugin 或 toolkit， 不传获取全部列表
- return: `{array}` 模块列表



### onlineList([type])

> `异步方法`, 获取线上的 fie 插件和套件列表

- type `{string}` 类型，可以是 plugin 或 toolkit， 不传获取全部列表
- return: `{array}` 模块列表


## 支持

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## 证书

[GNU GPLv3](LICENSE)
