# fie-env

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-env.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-env
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-env
[snyk-image]: https://snyk.io/test/npm/fie-env/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-env
[download-image]: https://img.shields.io/npm/dm/fie-env.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-env

fie内外网环境设置及判断

## Installation

```bash
$ npm install fie-env -g --registry=https://registry.npm.taobao.org
```

## API

### setExtranetEnv()

设置FIE的运行环境为外网环境

```javascript
const fieEnv = require('fie-env');
fieEnv.setExtranetEnv();
```

### setIntranetEnv()

设置FIE的运行环境为内网环境

```javascript
const fieEnv = require('fie-env');
fieEnv.setIntranetEnv();
```

### isIntranet()

是否是内网环境
优先判断**process.env.FIE_ENV**变量,值为intranet,则返回true
process.env.FIE_ENV 为枚举类型，取值为: intranet / extranet

```javascript

const fieEnv = require('fie-env');
fieEnv.setIntranetEnv();

const resultEnv = fieEnv.isIntranet();
console(resultEnv);  //==> true

fieEnv.setExtranetEnv();
const resultEnv2 = fieEnv.isIntranet();
console(resultEnv2);  //==> false

process.env.FIE_ENV = 'intranet';
const resultEnv3 = fieEnv.isIntranet();
console(resultEnv3);  //==> true

```

### hasConfigFile()

判断FIE环境配置文件(fie.env.json)是否存在，可用做FIE环境是否已初始化的判断

```javascript
const fieEnv = require('fie-env');
fieEnv.setExtranetEnv();
fieEnv.hasConfigFile();  //=> true
```

### removeConfigFile()

删除FIE环境配置文件(fie.env.json)

```javascript
const fieEnv = require('fie-env');
fieEnv.removeConfigFile();
fieEnv.hasConfigFile();  //=> false
```

## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 宇果 <baofen14787@gmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)

