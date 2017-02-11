# 开发 FIE 套件

> 如果您有一套不错的开发模式想推荐给身边的同事使用,开发一个 fie 套件是一个很不错的方式.
> 在您开发 fie 套件前,请务必先查看目前是否已经有跟您的开发模式相似的套件,若已经有了,您可以考虑加入该套件的开发,一起优化现有的套件.

## 基本约定

### 命名

- 在 github 的 [fieteam 项目组](https://github.com/fieteam)下建的套件仓库必须以 fie-toolkit-xxx 的格式命名
- package.json 里面的 name 字段命名方式必须以 fie-toolkit-xxx 格式书写

### 版本号

- 遵守 [semver](http://semver.org/lang/zh-CN/) 版本规范

## 开发流程


###  新建 git 仓库

新建 在 fieteam 项目组下新建项目,项目命名规范如上.

### 复制项目到本地

执行 git clone, 将项目复制到本地.

### 初始化套件模板

进入项目目录, 执行 fie init dev,  操作 [dev套件](https://github.com/fieteam/fie-toolkit-dev) 会做几件事：

- 根据当前目录名识别是套件还是插件
- 在当前目录下添加套件的基础模板
- 将当前目录链到 fie 模块目录下

### 套件件配置

在生成 的模板 的 package.json 里面会有一个 fieOption 的配置，这些配置是fie 核心调用套件的时候会读取的, 配置主要意义如下：

```
{
  "thumb": "xxxx.jpg", //套件 logo 图片地址
  "type": "plugin", //套件还是插件,此项不要修改
  "update": false, //是否自动更新
  "chName": "中文名"
}
```

###  接口实现

各套件根据自己的实际需求，自身的命令，最终只对外暴露一个函数（可以参考 fie-plugin-git的实现）。

###  使用 fie.config.js 配置

在项目里面必须会有一个 fie.config.js的配置文件，所有的套件都要实现并按照这套规范来做，对于套件来说，需要实现以下几个配置 ，更多的配置是尽量用套件具体使用的打包工具对应的配置文件 来设置的，推置使用 webpack ：

```
module.exports = {
  //指定当前项目使用的套件
  toolkit: "blue",
  
  //以下是套件的基本配置，所有的套件都只会有这几个参数 
  //以下配置是非必填项目，默认配置就是下面这样
  toolkitConfig: {
    //fie start时打开本地服务器的端口号
    port: 9000,
    //fie start时，是否自动打开浏览器
    open: true,
    //fie start打开浏览器时的默认页面（只有open为true时有效）
    openTarget: "src/index.html",
    //文件改变时是否自动刷新页面
    liveload: false
  }
};

```

### 套件发布

套件发布前需要注意以下几项:

- 必须按规范填写项目名
- 描述信息尽量明确且简短,在 fie list 时可以被用户查看到
- 必须要有 maintainers 列表
- changeLog 里面必须要有当前版本号的更新信息

最后执行发布:

```
fie publish
```

### 调用模式

- 所有的套件的入口（即 package.json中的main指向的文件）必须返回一个Object类型，该类型需要包含对应命令的函数,如： init start add build 等.
- 当执行 fie init 、fie start 等命令时，便会执行以上的函数
- 执行以上函数的时候 fie 会将 fie对象（带有fie核心提供的所有接口） 作为第一个参数传进去，并将用户的在命令行的其他参数作为第二个参数传进去
- 执行 fie start 时，如果由 fie 开服务器的话，可以通过 fie.app 获取到已经开启了的koa服务器，可以直接在其上面写中间件
- fie 接口请查看 接口文档
