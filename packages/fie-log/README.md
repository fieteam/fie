# fie-log

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-log
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-log
[snyk-image]: https://snyk.io/test/npm/fie-log/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-log
[download-image]: https://img.shields.io/npm/dm/fie-log.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-log

fie.config.js 文件操作模块, 可以对 fie.config.js 文件进行读写等操作


## Installation

```
npm install fie-log --save
```

## API

fie-log 返回的是一个方法, 调用该方法可以直接返回一个对象, 并进行调用, 大概操作如下:

```
const log = require('fie-log')('test');

// 普通字符串
log.info('啦啦啦'); // 将以品红色打印:  [test] 啦啦啦
log.cli.info('啦啦啦'); // 仅当前插件或套件做为入口模块时,才以品红色打印:  [test] 啦啦啦
log.func.info('啦啦啦'); // 仅当前插件或套件不是入口模块时,才以品红色打印:  [test] 啦啦啦

// 使用占位符
log.info('字符串:%s 数字:%d ', 'ssss', 33); // 会打印: [test] 字符串:ssss 数字:33
log.info('对象:%o', {a: 1}); // 打打印: [test] 对象:{a: 1}
```

以下提供的 `info` `success` `warn` `error` `debug` 方法均支持了 [printf-style](https://wikipedia.org/wiki/Printf_format_string) 格式化. 支持的格式化方式有: 

| Formatter | Representation |
|-----------|----------------|
| `%O`      | 多行打印对象 |
| `%o`      | 单行打印对象 |
| `%s`      | 字符串 |
| `%d`      | 数字 |
| `%j`      | JSON |
| `%%`      | 打印 ('%'). 并不代表任何占位符 |


### info(msg)

> 以品红色打印

- msg `{string}` 需要打印的内容

### success(msg)

> 以品绿色打印

- msg `{string}` 需要打印的内容


### warn(msg)

> 以品黄色打印

- msg `{string}` 需要打印的内容

### error(msg)

> 以品红色打印

- msg `{string}` 需要打印的内容


### debug(msg)

> 只有在环境变量 DEBUG 匹配到传入 fie-log 函数时的那个参数时才打印出来, 可参见 [debug](https://www.npmjs.com/package/debug)

- msg `{string}` 需要打印的内容


### cli

> cli 为一个对象, 该对象具用跟上面声明的 `info` `success` `warn` `error` 用法一样的方法
> 唯一不同的就是 cli 下面的方法调用后只有当前插件或套件`做为入口模块时` , 才打印对应的内容

```
const log = require('fie-log')('test');

log.cli.info('啦啦啦');
log.cli.error('啦啦啦');
log.cli.warn('啦啦啦');
log.cli.success('啦啦啦');
```

### func

> func 为一个对象, 该对象具用跟上面声明的 `info` `success` `warn` `error` 用法一样的方法
> 唯一不同的就是 func 下面的方法调用后只有当前插件或套件`不是入口模块时` , 才打印对应的内容

```
const log = require('fie-log')('test');

log.func.info('啦啦啦');
log.func.error('啦啦啦');
log.func.warn('啦啦啦');
log.func.success('啦啦啦');
```


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
