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

> fie.config.js 文件操作模块, 可以对 fie.config.js 文件进行读写等操作


## Installation

```
npm install fie-config --save
```

## API

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
const config = require('fie-config')
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
const config = require('fie-config')
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
const config = require('fie-config')
const toolkit = config.getToolkitName();
// =>  toolkit = fie-toolkit-dev
```


## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)
