# fie-argv

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

fie运行时，格式化fie在控制台输入的参数，fie内部核心库，一般不建议直接使用。

## Installation

```
npm install fie-argv --save
```

## 例子

```js

const argv = require('fie-argv');
const fieArgv = argv();
const command = fieArgv.command;
const newArgv = fieArgv.argv;

```


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: hugohua <baofen14787@gmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
