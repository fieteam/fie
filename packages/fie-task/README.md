# fie-task

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-task.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-task
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-task
[snyk-image]: https://snyk.io/test/npm/fie-task/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-task
[download-image]: https://img.shields.io/npm/dm/fie-task.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-task

fie 数据缓存模块, 可以用来存储用户常用数据,支持有效期设置

## 安装

```
npm install fie-task --save
```

## API

### has(tasks, when)

> 是否存在当前时机的任务流

- tasks `{array}` 任务列表
- when `{string}` 时机

### run(options)

> `异步方法`,执行一串任务流, 直接传一对应指令的任务流,并指定进行时机

- options `{object}` 选项
- options.tasks `{array}` 任务流数组, 如果需要传入函数,仅支持 generator 函数
- options.when `{string}` 时机, before 或 after
- options.args `{array}` 如果任务流里面有函数,当组数为传给函数的参数
- options.command `{string}` 当前正在运行的 fie 指令, 用于在控制台提示及对 $$ 参数进行替换

使用案例

```
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

> `异步方法`,执行一个函数, 支持 generator 及普通函数

- options `{object}`
- options.method `{function}` 需要被执行的函数
- options.args `{array}` 需要传给 method 的参数 
- options.next `{function}` 下一步执行方法, 如果 method 是普通函数会自动拼到 args 里面,传给 method, 如果 method 是 generator 函数或 promise 可以不传, 里面会执行完该函数后才退出 runFunction函数

执行普通函数

```
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

```
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


## 支持

使用过程中遇到的相关问题，及BUG反馈，可联系: 擎空 <zernmal@foxmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## 证书

[GNU GPLv3](LICENSE)
