# fie-report

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-report.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-report
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-report
[snyk-image]: https://snyk.io/test/npm/fie-report/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-report
[download-image]: https://img.shields.io/npm/dm/fie-report.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-report

fie 上报模块, 一般只在 fie-core 里面使用, 其他模块不建议调用.


## Installation

```
npm install fie-report --save
```

## API

### coreCommand(command)

> 核心命令使用上报

- command `{string}` 命令名

### moduleUsage(name)

> 模块使用上报

- name `{string}` 模块名

### error(type, err)

> 错误上报

- type `{string}` 错误类型
- err `{object|string}` 错误内容


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
