# fie-fs

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-fs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-fs
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-fs
[snyk-image]: https://snyk.io/test/npm/fie-fs/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-fs
[download-image]: https://img.shields.io/npm/dm/fie-fs.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-fs

fie 数据缓存模块, 可以用来存储用户常用数据,支持有效期设置

## 安装

```
npm install fie-fs --save
```

## API

### copyDirectory(options)

> 复制目录, 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
- options `object` 
- options.src `string` 绝对路径
- options.dist `string` 绝对路径
- options.data `string` 需要替换变量的数据
- options.ignore `array` 数组, 类似 gitignore 的写法
- options.templateSettings `object`, 默认是 { evaluate: /<{%([\s\S]+?)%}>/g,
                                             interpolate: /<{%=([\s\S]+?)%}>/g,
                                             escape: /<{%-([\s\S]+?)%}>/g
                                            }

### copyTpl(options)

> 复制文件, 支持 underscore 模板引擎, 标签开始和结束符是: <{% %}>
- options `object`
- options.src `string` 绝对路径
- options.dist `string` 绝对路径
- options.data `object` 需要替换变量的数据
- options.stringReplace 数组 , 将文件里面匹配到的字符串替换掉,如
	[{ placeholder: 'PLACEHOLDER', value: 'theReplaceValue' }]


### rewriteFile(options)
> 重写文件内容, 本文件不提供读写文件能力,
- options `object`
- options.hook `string` 判断需要插入行的标记
- options.insertLines `array` 数组类型, 每一项为新行
- options.place `string`  before / after(默认)
- options.noMatchActive `string` top / bottom / null(默认)


### move(srcPath, distPath)

> 移动文件
- srcPath `string` 源文件,绝对路径
- distPath `string` 目标文件,绝对路径

### remove(file)

> 删除文件或目录
- file `string` 需要删除的文件路径



## 支持

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## 证书

[GNU GPLv3](LICENSE)
