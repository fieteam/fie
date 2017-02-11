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

log.info('啦啦啦'); // 将以品红色打印:  [test]啦啦啦

```

该对象具体有以下方法:

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


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
