# fie-cache

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

fie 数据缓存模块, 可以用来存储用户常用数据,支持有效期设置

## Installation

```
npm install fie-cache --save
```

## API

### get(key)

> 获取缓存内容,如果不存在或已过期则返回 null

- key `{string}` 缓存的键值
- return: `{mix}` 缓存内容

### set(key, value, options)

> 设置缓存

- key `{string}` 缓存键值
- value `{mix}` 缓存内容,可以为字符串,数字或json对象
- options `{object}`
- options.expires `{number}` 缓存时间,毫秒为单位,如: 1小时 => 3600000

### clear

> 清除所有缓存


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
