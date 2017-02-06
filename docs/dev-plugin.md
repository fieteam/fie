# 开发 FIE 插件

> 如果您有一套不错的 nodejs 小工具推荐给身边的同事使用,开发一个 fie 插件是一个很不错的方式. 
> 在您开发 fie 插件前,请务必先查看目前是否已经有跟您的 nodejs 小工具功能相似的插件,若已经有了,您可以考虑加入该插件的开发,一起优化现有的插件.

## 基本约定

### 命名

- 在 github 的 [fieteam 项目组](https://github.com/fieteam)下建的套件仓库必须以 fie-plugin-xxx 的格式命名
- package.json 里面的 name 字段命名方式必须以 fie-plugin-xxx 格式书写

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
- 在当前目录下添加插件的基础模板
- 将当前目录链到 fie 模块目录下

### 插件件配置

在生成 的模板 的 package.json 里面会有一个 fieOption 的配置，这些配置是fie 核心调用套件的时候会读取的, 配置主要意义如下：

```
{
  "thumb": "xxxx.jpg", //插件 logo 图片地址
  "type": "plugin", //套件还是插件,此项不要修改
  "update": false, //是否自动更新
  "chName": "中文名"
}
```

###  接口实现

各插件根据自己的实际需求，自身的命令，最终只对外暴露一个函数（可以参考 fie-plugin-git的实现）。

###  使用 fie.config.js 配置

在项目里面必须会有一个 fie.config.js的配置文件，所有的插件配置都是在下面以插件名另起一个字段，假设现在有一个插件名为 fie-plugin-awp，则其配置如下：

```
{
  awp: {
    //些处填插件需要使用的配置项目
  }
}
```

### 插件发布

插件发布前需要注意以下几项:

- 必须按规范填写项目名
- 描述信息尽量明确且简短,在 fie list 时可以被用户查看到
- 必须要有 maintainers 列表
- changeLog 里面必须要有当前版本号的更新信息

最后执行发布:

```
fie publish
```

### 调用模式

- 所有的插件件的入口（即 package.json中的main指向的文件）函数
- 当执行 fie xx yy时（xx为插件名，yy为参数）时，便会调用这个函数
- 执行以上函数的时候 fie 会将 fie提供接口作为第一个参数传进去，并将用户的在命令行的其他参数作为第二个参数传进去
- fie 接口请查看 接口文档
