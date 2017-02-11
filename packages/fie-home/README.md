# fie-home

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-home.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-home
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-home
[snyk-image]: https://snyk.io/test/npm/fie-home/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-home
[download-image]: https://img.shields.io/npm/dm/fie-home.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-home

获取 FIE 及模块的相关路径，不建议插件直接对 fie 家目录里面的内容直接进行操作


## Installation

```
npm install fie-home --save
```

## API

### getHomePath()

> 获取 FIE 的 home 路径

- return: `{string}` 路径字符串

### getModulesPath()

> 获取 FIE 的模块安装路径

- return: `{string}` 路径字符串


### initHomeDir()

> 初始化 FIE 的 home 路径


### cleanHomeDir()

> 清空 FIE 的 home 路径


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
