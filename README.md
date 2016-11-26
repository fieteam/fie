# FIE


[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie
[download-image]: https://img.shields.io/npm/dm/fie.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie

> FIE 是由国际UED体验技术部开发的一款前端工程化工具，提供类似于yeoman的脚手架功能及插件体系。全方位覆盖前端开发过程中各个环节，让你开发更简单，过程更流畅,项目更可持续维护。


## 安装

```bash
$ npm install fie -g --registry=https://registry.npm.taobao.org
```

等待片刻，待安装完成之后在终端执行 `$ fie -v`，正常返回版本信息，表示安装成功。

注意：fie依赖 nodejs > 4.x 、 npm 环境，在安装fie时，请确保本机已安装了nodejs和npm

## 使用

可在终端输入`$ fie -h` 查看fie使用帮助

```bash
fie 使用帮助:  $ fie [command] [options]

  $  fie                     # 显示fie帮助信息,若目录下有使用的套件,则会同时显示套件的帮助信息
  $  fie init [toolkitName]  # 初始化套件
  $  fie update [name]       # 更新插件
  $  fie install [name]      # 安装插件
  $  fie list [type]         # 插件列表
  $  fie uninstall [name]    # 安装删除插件
  $  fie clear               # 清空 fie 的本地缓存
  $  fie switch              # 切换 fie 的开发环境
  $  fie help                # 显示套件帮助信息
  $  fie [name]              # 其他调用插件命令

 Options:

   -h, --help                显示fie帮助信息
   -v, --version             显示fie版本
```

### 快速开始

以[fie-toolkit-blue](https://www.npmjs.com/package/fie-toolkit-blue)套件为例，讲解开发流程。

1. 安装fie到npm全局环境中

	```bash
	$ npm install fie -g --registry=https://registry.npm.taobao.org
	```

2. 初始化项目

	```bash
	# 创建并进入项目文件夹
	$ mkdir my-project && cd $_
	
	# 初始化blue的开发环境
	$ fie init blue
	```
	
3. 开启本地环境

	```bash
	# 开启blue的开发环境
	$ fie start
	```
4. 项目编译及打包

	```bash
	# 打包blue项目的到指定的目录
	$ fie build
	```	

## 技术支持
1. 使用过程中遇到的相关问题，可在github上提相关的issues : https://github.com/fieteam/fie/issues/new
2. 也可通过钉钉或旺旺联系：@擎空、@宇果




