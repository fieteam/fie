# fie-config

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-config.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-config
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-config
[snyk-image]: https://snyk.io/test/npm/fie-config/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-config
[download-image]: https://img.shields.io/npm/dm/fie-config.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-config

fie.config.js 文件操作模块, 可以对 fie.config.js 文件进行读写等操作


## Installation

```
npm install fie-config --save
```

## API

### get(key, cwd)

> 获取缓存内容,如果不存在或已过期则返回 null

- key `{string}` 配置的键
- cwd `{string}` 配置文件所在的路径, 默认为 process.cwd()
- return: `{mix}` 配置内容

### set(key, value, cwd)

> 设置缓存

- key `{string}` 配置的键
- value `{mix}` 配置的值,可以为字符串,数字或json对象
- cwd `{string}` 配置文件所在的路径,默认为 process.cwd()

### exist(cwd)

> 判断 fie.config.js 文件是否存在

- cwd `{string}` 配置文件所在的路径,默认为 process.cwd()
- return: `{boolean}` 是否存在

### getToolkitName(cwd)

> 获取配置文件里面配置的 toolkit 的名字

- cwd `{string}` 配置文件所在的路径,默认为 process.cwd()
- return: `{string}` toolkit 的名字, 若不存在返回 null


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
