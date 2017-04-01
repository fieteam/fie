# fie-api

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-api.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-api
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-api
[snyk-image]: https://snyk.io/test/npm/fie-api/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-api
[download-image]: https://img.shields.io/npm/dm/fie-api.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-api

> fie 对外 api 集合
## Installation

```
npm install fie-api --save
```

## 使用

fie-api 是一个 object 对象集合，集成了所有FIE的依赖包，其下面挂截着多个对象, 每个对象都包含着一类操作:

```
const fieApi = require('fie-api');
const { log, cache } = fieApi;

log.info('啦啦啦');
cache.set('ff', 'ee');
cache.get('ff');
```

## API 列表

[fie-api](https://www.npmjs.com/package/fie-api)

* [cache](#cache) - fie 数据缓存模块
	* [get(key)](#get(key)) - 获取缓存内容
	* [set(key, value, options)](#set(key, value, options)) - 设置缓存
	* [clear](#clear) - 清除所有缓存
* [config](#config) fie配置文件读写模块
	* [get(key,cwd)](#get(key, cwd)) - 获取缓存内容,如果不存在或已过期则返回 null
	* [set(key, value, cwd)](#set(key, value, cwd)) - 修改fie配置文件内容
	* [exist(cwd)](#exist(cwd)) - 判断 fie.config.js 文件是否存在
* [env](#env) - fie内外网环境设置及判断
	* [setExtranetEnv()](#setExtranetEnv()) - 设置FIE的运行环境为外网环境
	* [setIntranetEnv()](#setIntranetEnv()) - 设置FIE的运行环境为内网环境
	* [isIntranet()](#isIntranet()) - 是否是内网环境
	* [hasConfigFile()](#hasConfigFile()) - 判断FIE环境配置文件是否存在
	* [removeConfigFile()](#removeConfigFile()) - 删除FIE环境配置文件
* [fs](#fs) - fie 文件及文件夹操作模块
	* [copyDirectory(options)](#copyDirectory(options)) - 复制目录
	* [copyTpl(options)](#copyTpl(options)) - 复制文件
	* [rewriteFile(options)](#rewriteFile(options)) - 重写文件内容
	* [move(srcPath, distPath)](#move(srcPath, distPath)) - 移动文件
	* [remove(file)](#remove(file)) - 删除文件或目录
* [home](#home) - 获取FIE及模块的相关路径
	* [getHomePath()](#getHomePath()) - 获取 FIE 的 home 目录
	* [getModulesPath()](#getModulesPath()) - 获取 FIE 的模块安装目录
	* [initHomeDir()](#initHomeDir()) - 初始化 FIE 的 home 目录
	* [cleanHomeDir()](#cleanHomeDir()) - 清空 FIE 的 home 目录内容
* [log](#log) - 以不同颜色在控制台上输出log
	* [info(msg)](#info(msg)) - 以紫色输出内容到控制台
	* [success(msg)](#success(msg)) - 以绿色输出内容到控制台
	* [error(msg)](#error(msg)) -  以红色输出内容到控制台
	* [debug(msg)](#debug(msg)) - 只有在环境变量 DEBUG 与传入的参数一致时才打印，参[debug](https://www.npmjs.com/package/debug)
	* [cli](#cli) - 只有当前插件或套件**做为入口模块时** , 才打印对应的内容
	* [func](#func) - 只有当前插件或套件**不是入口模块时** , 才打印对应的内容
* [module](#module) - fie 模块的获取、安装及卸载
	* [get(name)](#get(name)) - 获取 fie 模块
	* [install(name)](#install(name)) - 安装 FIE 模块
	* [unInstall(name)](#unInstall(name)) - 卸载 FIE 模块
	* [update(name)](#update(name)) - 更新 FIE 模块
	* [localList(options)](#localList(options)) - 获取本地已安装的 FIE 插件和套件列表
	* [onlineList(options)](#onlineList(options)) - 获取线上的 FIE 插件和套件列表
	* [fullName(name)](#fullName(name)) - 获取FIE模块全名
	* [pluginFullName(name)](#pluginFullName(name)) - 获取FIE插件全称
	* [toolkitFullName(name)](#toolkitFullName(name)) - 获取FIE套件全称
* [npm](#npm) - npm模块的安装及卸载
	* [install(pkg, options)](#install(pkg, options)) - 安装一个 npm 包
	* [uninstall(pkg, options)](#uninstall(pkg, options)) - 卸载一个 npm 包
	* [installDependencies(options)](#installDependencies(options)) - 安装package.json 对应的依赖包
	* [latest(pkg, options)](#latest(pkg, options)) - 获取最新的 npm 包信息
	* [has(pkg, options)](#has(pkg, options)) - 判断是否存在某个 npm 包
* [task](#task) - fie任务流
	* [has(tasks, when)](#has(tasks, when)) - 是否存在当前时机的任务流
	* [run(options)](#run(options)) - 执行一串任务流
	* [runFunction()](#runFunction()) - 执行一个函数
* [user](#user) - 当前项目信息
	* [getUser()](#getUser()) - 获取git 用户名和邮箱地址

## 一些推荐的utils包

* [git-rev-sync](https://www.npmjs.com/package/git-rev-sync) - 获取当前gitlab的相关信息。


## cache

> fie 数据缓存模块, 可以用来存储用户常用数据,支持有效期设置

### get(key)

> 获取缓存内容,如果不存在或已过期则返回 null

- key `{string}` 缓存的键值
- return: `{mix}` 缓存内容

### set(key, value, options)

> 修改fie配置文件内容

- key `{string}` 缓存键值
- value `{mix}` 缓存内容,可以为字符串,数字或json对象
- options `{object}`
- options.expires `{number}` 缓存时间,毫秒为单位,如: 1小时 => 3600000

### clear

> 清除所有缓存

```js

const api = require('fie-api');
const cache = api.cache;

// 将abc这个key的对象写入fie缓存文件。（该缓存文件一般在 ~/.fie/fie.cache.json 中）
cache.set('abc',{ data : 1 });

// 从fie缓存中获取 abc 这个key的内容。
cache.get('abc');
// => return { data : 1 }

//清空fie的缓存内容
cache.clear();

```

## config

> fie.config.js 文件操作模块, 可以对 fie.config.js 文件进行读写等操作

### get(key, cwd)

> 获取fie配置文件(fie.config.js)的内容,如果不存则返回 null

- key `{string}` 配置的键
- cwd `{string}` 配置文件所在的路径, 默认为 process.cwd()
- return: `{mix}` 配置内容


```js
//fie.config.js文件
module.exports = {
	toolkit: 'fie-toolkit-dev',
	go : {
	   projectId: 85932,
	   assetsId: 21443
	}
};
```

```js
const api = require('fie-api')
const config = api.config;
//获取配置文件中go字段的内容
config.get('go');
// => 返回 { projectId : 85932, assetsId : 21443 }

```



### set(key, value, cwd)

> 修改fie配置文件内容

- key `{string}` 配置的键
- value `{mix}` 配置的值,可以为字符串,数字或json对象
- cwd `{string}` 配置文件所在的路径,默认为 process.cwd()

```js
//原始fie.config.js文件
module.exports = {
  // abc 插件
  abc: {
    xyz: 22
  },
  // 任务列表
  tasks: {
    start: [{
      command: 'echo 33'
    }]
  }
};

```

```js
const api = require('fie-api')
const config = api.config;
//set 设置一个对象
config.set('abc', {xyz: 23});

//set 设置一个带注释的字符串对象
config.set('gg',
			`
//这是一行注释
{
  "good" : "yes"
}
      `);

//set 设置一个带.的字符串
config.set('xx.yy','123');
config.set('tasks.build',[{
			command: 'echo 44'
		}]);
```


```js
//最终修改输出后的fie.config.js文件
module.exports = {
    // abc 插件
    abc: { xyz: 23 },
    // 任务列表
    tasks: {
        start: [{ command: 'echo 33' }],
        build: [{ command: 'echo 44' }]
    },
    gg: //这是一行注释
    { 'good': 'yes' },
    xx: { yy: 123 }
};
```

### exist(cwd)

> 判断 fie.config.js 文件是否存在

- cwd `{string}` 配置文件所在的路径,默认为 process.cwd()
- return: `{boolean}` 是否存在

### getToolkitName(cwd)

> 获取配置文件里面配置的 toolkit 的名字

- cwd `{string}` 配置文件所在的路径,默认为 process.cwd()
- return: `{string}` toolkit 的名字, 若不存在返回 null

```js
//fie.config.js文件
module.exports = {
	toolkit: 'fie-toolkit-dev',
	go : {
	   projectId: 85932,
	   assetsId: 21443
	}
};
```

```js
const api = require('fie-api')
const config = api.config;
const toolkit = config.getToolkitName();
// =>  toolkit = fie-toolkit-dev
```


## env

> fie内外网环境设置及判断

### setExtranetEnv()

> 设置FIE的运行环境为外网环境

```javascript
const api = require('fie-api');
const fieEnv = api.env;
fieEnv.setExtranetEnv();
```

### setIntranetEnv()

> 设置FIE的运行环境为内网环境

```javascript
const api = require('fie-api');
const fieEnv = api.env;
fieEnv.setIntranetEnv();
```

### isIntranet()

> 是否是内网环境

优先判断**process.env.FIE_ENV**变量,值为intranet,则返回true
process.env.FIE_ENV 为枚举类型，取值为: intranet / extranet

```javascript

const api = require('fie-api');
const fieEnv = api.env;
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

> 判断FIE环境配置文件(fie.env.json)是否存在，可用做FIE环境是否已初始化的判断

```javascript
const api = require('fie-api');
const fieEnv = api.env;
fieEnv.setExtranetEnv();
fieEnv.hasConfigFile();  //=> true
```

### removeConfigFile()

> 删除FIE环境配置文件(fie.env.json)

```javascript
const api = require('fie-api');
const fieEnv = api.env;
fieEnv.removeConfigFile();
fieEnv.hasConfigFile();  //=> false
```


## fs

> fie 文件及文件夹操作模块，一般用于套件中的模板生成及变量替换

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

## home

> 获取 FIE 及模块的相关路径，不建议插件直接对 fie 家目录里面的内容直接进行操作

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



## log

> 以不同颜色在控制台上输出log

fie-log 返回的是一个方法, 调用该方法可以直接返回一个对象, 并进行调用, 大概操作如下:

```
const log = require('fie-log')('test');

// 普通字符串
log.info('啦啦啦'); // 将紫红色打印:  [test] 啦啦啦
log.cli.info('啦啦啦'); // 仅当前插件或套件做为入口模块时,才以紫色打印:  [test] 啦啦啦
log.func.info('啦啦啦'); // 仅当前插件或套件不是入口模块时,才以紫色打印:  [test] 啦啦啦

// 使用占位符
log.info('字符串:%s 数字:%d ', 'ssss', 33); // 会打印: [test] 字符串:ssss 数字:33
log.info('对象:%o', {a: 1}); // 打打印: [test] 对象:{a: 1}
```

以下提供的 `info` `success` `warn` `error` `debug` 方法均支持了 [printf-style](https://wikipedia.org/wiki/Printf_format_string) 格式化. 支持的格式化方式有:

| Formatter | Representation |
|-----------|----------------|
| `%O`      | 多行打印对象 |
| `%o`      | 单行打印对象 |
| `%s`      | 字符串 |
| `%d`      | 数字 |
| `%j`      | JSON |
| `%%`      | 打印 ('%'). 并不代表任何占位符 |


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


### cli

> cli 为一个对象, 该对象具用跟上面声明的 `info` `success` `warn` `error` 用法一样的方法
> 唯一不同的就是 cli 下面的方法调用后只有当前插件或套件`做为入口模块时` , 才打印对应的内容

```
const log = require('fie-log')('test');

log.cli.info('啦啦啦');
log.cli.error('啦啦啦');
log.cli.warn('啦啦啦');
log.cli.success('啦啦啦');
```

### func

> func 为一个对象, 该对象具用跟上面声明的 `info` `success` `warn` `error` 用法一样的方法
> 唯一不同的就是 func 下面的方法调用后只有当前插件或套件`不是入口模块时` , 才打印对应的内容

```
const log = require('fie-log')('test');

log.func.info('啦啦啦');
log.func.error('啦啦啦');
log.func.warn('啦啦啦');
log.func.success('啦啦啦');
```


## module

> fie 模块的获取、安装及卸载

### get(name)

> `Generator 函数`, 获取 fie 模块, 需要运行插件和套件都用这个方法来先获取, 如果本地尚示安装, 会自动进行安装,然后返回模块

- name `{string}` 模块名, 若需要获取 package.json 信息可以直接在模块名后面跟上  `/package.json`
- return: `{object}` modInfo 模块对象, modInfo.mod 模块对象, modInfo.options 模块的设置项.

```js
// 名字会自动补齐
const blue = yield fieModule.get('toolkit-blue');
// blue 为blue套件时是一个对象，下面挂载几个命令对应的函数
yield blue.build(fieObj, {
  clientArgs: ['index']
});

// 获取模块手 package.json 信息
const pkg = yield fieModule.get('toolkit-blue/package.json');
console.log(pkg.fieOptions);
```

### install(name)

> `Generator 函数`, 安装 FIE 模块

- name `{string}` 模块名, 若需要指定版本号直接在名字后面跟上即可,如: gulp@1.0.0

### unInstall(name)

> `Generator 函数`, 卸载 FIE 模块

- name `{string}` 模块名



### update(name)

> `Generator 函数`, 更新 FIE 模块

- name `{string}` 模块名



### localList(options)

> 获取本地已安装的 FIE 插件和套件列表

- options `{object}` 可选项
- options.type `{string}` 类型，可以是 plugin 或 toolkit， 不传获取全部列表
- return: `{array}` 模块列表



### onlineList(options)

> `Generator 函数`, 获取线上的 FIE 插件和套件列表

- options `{object}` 可选项
- options.type `{string}` 类型，可以是 plugin 或 toolkit， 不传获取全部列表
- return: `{array}` 模块列表



### localExist(name)

> 判断本地是否已安装对应的 FIE 模块了

- name `{string}` 模块名
- return: `{boolean}` 是否存在



### onlineExist([type])

> `Generator 函数`, 判断线上是否已存在对应的 FIE 模块了

- name `{string}` 模块名
- return: `{boolean}` 模块列表

### fullName(name)

> 根据传入的插件或套件名称缩写,生成对应的全称

- name `{string}` 缩写的名称
- return: `{string}` 全称


### pluginFullName(name)

> 根据传入插件名称缩写,生成对应的插件全称

- name `{string}` 缩写的名称
- return: `{string}` 全称


### toolkitFullName(name)

> 根据传入套件名称缩写,生成对应套件全称

- name `{string}` 缩写的名称
- return: `{string}` 全称


## npm

> npm 操作模块,用于安装,卸载,判断是否存在对应的 npm 模块, 会根据当前用户的配置来判断是要拉取阿里内网还是外网.

### install(pkg, options)

> `Generator 函数`,安装一个 npm 包

- pkg `{string}` 需要进行操作的包名
- options `{object}` 可选项
- options.registry `{string}` 包对应的源,默认会根据当前用户选择的网络切换
- options.stdio `{string}` 输入输出, 默认为 inherit
- options.cwd `{string}` 执行目录, 默认为 process.cwd()



### uninstall(pkg, options)

> `Generator 函数`,卸载一个 npm 包

- pkg `{string}` 需要进行操作的包名
- options `{object}` 可选项
- options.stdio `{string}` 输入输出, 默认为 inherit
- options.cwd `{string}` 执行目录, 默认为 process.cwd()



### installDependencies(options)

> `Generator 函数`,安装当前目录的 package.json 对应的依赖包

- options `{object}` 可选项
- options.registry `{string}` 包对应的源,默认会根据当前用户选择的网络切换
- options.stdio `{string}` 输入输出, 默认为 inherit
- options.cwd `{string}` 执行目录, 默认为 process.cwd()

### latest(pkg, options)

> `Generator 函数`,获取最新的 npm 包信息

- pkg `{string}` 需要进行操作的包名
- options `{object}` 可选项
- options.registry `{string}` 包对应的源,默认会根据当前用户选择的网络切换
- options.version `{string}` 需要获取信息的版本号或 tag ,默认为 latest
- return: `{object}` 如果存在则返回对应的 json 对象 , 否则为 null


### has(pkg, options)

> `Generator 函数`,判断是否存在某个 npm 包

- pkg `{string}` 需要进行操作的包名
- options `{object}` 可选项
- options.registry `{string}` 包对应的源,默认会根据当前用户选择的网络切换
- return: `{boolean}` 是否存在

## task

> fie 任务流模块，用于执行fie的任务流

### has(tasks, when)

> 是否存在当前时机的任务流

- tasks `{array}` 任务列表
- when `{string}` 时机

### run(options)

> `Generator 函数`,执行一串任务流, 直接传一对应指令的任务流,并指定进行时机

- options `{object}` 选项
- options.tasks `{array}` 任务流数组, 如果需要传入函数,仅支持 generator 函数
- options.when `{string}` 时机, before 或 after
- options.args `{array}` 如果任务流里面有函数,当组数为传给函数的参数
- options.command `{string}` 当前正在运行的 fie 指令, 用于在控制台提示及对 $$ 参数进行替换

使用案例

```js
const tasks = [{
  command: 'echo "$$"'
}, {
  * func(a, b) {
    console.log(a, b);
  }
}, {
  command: '__toolkitCommand__'
}, {
  comamnd: 'echo afterTask'
}];

// 调用前置任务
yield run({
  tasks,
  when: 'before',
  args: ['aaa', 'bbb'],
  command: 'test'
});

// 调用后置任务
yield run({
  tasks,
  when: 'after',
  command: 'test'
});

```

假设命令行里面输入的是 `fie test x -y z` , 那么上面的两次调用的输出结果分别是:

```
> x -y z
> aaa bbb
```

```
> afterTask
```


### runFunction();

> `Generator 函数`,执行一个函数, 支持 generator 及普通函数

- options `{object}`
- options.method `{function}` 需要被执行的函数
- options.args `{array}` 需要传给 method 的参数
- options.next `{function}` 下一步执行方法, 如果 method 是普通函数会自动拼到 args 里面,传给 method, 如果 method 是 generator 函数或 promise 可以不传, 里面会执行完该函数后才退出 runFunction函数

执行普通函数

```js
yield runFunction({
  method(a, b, next) {
    setTimeout(() => {
      console.log(a, b);
      next();
    }, 10);
  },
  args: ['aaa', 'bbb'],
  next() {
    console.log('ccc');
  }
});

// 执行结果
// > aaa bbb
// > ccc
```

执行 generator 函数

```js
yield runFunction({
  * method(a, b) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(a, b);
        resolve();
      }, 10);
    });
  },
  args: ['aaa', 'bbb']
});
console.log('ccc');

// 执行结果
// > aaa bbb
// > ccc
```

## user

> 根据用户当前 git 信息去获取用户相关信息

### getUser()

> 获取git 用户名和邮箱地址

- return: `{object}` 包含用户名和邮箱地址的对象

```
const fieUser = require('fie-user');
const user = fieUser.getUser();

console.log(user); // {name: 'xxx', email: 'xxx@xxx.xx'}
```


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)