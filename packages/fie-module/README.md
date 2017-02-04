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

- name `{string}` 模块名, 若需要获取 package.json 信息可以直接在模块名后面跟上  `/package.json`
- return: `{object}` modInfo 模块对象, modInfo.mod 模块对象, modInfo.options 模块的设置项.

```
// 名字会自动补齐
const blue = yield fieModule.get('toolkit-blue');
// blue 为blue套件时是一个对象，下面挂载几个命令对应的函数
yield blue.build(fieObj, {
  clientArgs: ['index']
});

// 获取模块手 package.json 信息
const pkg = yield fieModule.get('toolkit-blue/package.json');
console.log(pkg.fieOptions);
```

### install(name)

> `异步方法`, 安装 FIE 模块

- name `{string}` 模块名, 若需要指定版本号直接在名字后面跟上即可,如: gulp@1.0.0

### unInstall(name)

> `异步方法`, 卸载 FIE 模块

- name `{string}` 模块名



### update(name)

> `异步方法`, 更新 FIE 模块

- name `{string}` 模块名



### localList(options)

> 获取本地已安装的 FIE 插件和套件列表

- options `{object}` 可选项
- options.type `{string}` 类型，可以是 plugin 或 toolkit， 不传获取全部列表
- return: `{array}` 模块列表



### onlineList(options)

> `异步方法`, 获取线上的 FIE 插件和套件列表

- options `{object}` 可选项
- options.type `{string}` 类型，可以是 plugin 或 toolkit， 不传获取全部列表
- return: `{array}` 模块列表



### localExist(name)

> 判断本地是否已安装对应的 FIE 模块了

- name `{string}` 模块名
- return: `{boolean}` 是否存在



### onlineExist([type])

> `异步方法`, 判断线上是否已存在对应的 FIE 模块了

- name `{string}` 模块名
- return: `{boolean}` 模块列表

### fullName(name)

> 根据传入的插件或套件名称缩写,生成对应的全称

- name `{string}` 缩写的名称
- return: `{string}` 全称


### pluginFullName(name)

> 根据传入插件名称缩写,生成对应的插件全称

- name `{string}` 缩写的名称
- return: `{string}` 全称


### toolkitFullName(name)

> 根据传入套件名称缩写,生成对应套件全称

- name `{string}` 缩写的名称
- return: `{string}` 全称



## 支持

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## 证书

[GNU GPLv3](LICENSE)
