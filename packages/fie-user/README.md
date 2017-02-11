# fie-user

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-user.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-user
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-user
[snyk-image]: https://snyk.io/test/npm/fie-user/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-user
[download-image]: https://img.shields.io/npm/dm/fie-user.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-user

根据用户当前 git 信息去获取用户相关信息

## 安装

```
npm install fie-user --save
```

## API

### getUser()

> 获取git 用户名和邮箱地址

- return: `{object}` 包含用户名和邮箱地址的对象

```
const fieUser = require('fie-user');
const user = fieUser.getUser();

console.log(user); // {name: 'xxx', email: 'xxx@xxx.xx'}
```

## 支持

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## 证书

[GNU GPLv3](LICENSE)
