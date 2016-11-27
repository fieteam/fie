# FIE基础命令详解

FIE提供了三类命令：

0. FIE基础命令
1. FIE套件固定命令
2. FIE插件扩展命令

本文主要讲解FIE提供的基础命令，[FIE套件固定命令](#)及[FIE插件命令](#)请跳转至对应的文档查看。

## 基础命令一览

可在终端输入`$ fie -h` 查看fie使用帮助

```bash
$ fie -h

fie 使用帮助:  $ fie [command] [options]

  $  fie                     # 显示fie帮助信息,若目录下有使用的套件,则会同时显示套件的帮助信息
  $  fie install [name]      # 安装fie模块
  $  fie init [toolkitName]  # 初始化fie模块
  $  fie update [name]       # 更新fie模块
  $  fie uninstall [name]    # 安装删除fie模块
  $  fie list [type]         # fie模块列表
  $  fie ii                  # npm模块安装
  $  fie clear               # 清空 fie 的本地缓存
  $  fie switch              # 切换 fie 的开发环境
  $  fie help                # 显示套件帮助信息
  $  fie [name]              # 其他调用插件命令

 Options:

   -h, --help                显示fie帮助信息
   -v, --version             显示fie版本
```

## fie install [name]

安装fie模块(套件及插件)。

```bash
$ fie install [name]
```

其中`name`表示fie的模块名称。套件名称格式为：`fie-{toolkit-name}`，插件名称格式为：`fie-{plugin-name}`，输入对应的名字即可安装。

### 例子

```bash
# 安装聚星台套件
$ fie install toolkit-blue

# 安装git操作插件
$ fie install plugin-git
```

![](http://img3.tbcdn.cn/5476e8b07b923/TB19WHcOpXXXXbXaFXXXXXXXXXX)



## fie init [toolkitName]

初始化套件

```bash
$ fie init [toolkitName]
```

其中`toolkitName`表示套件的名字。一般的套件名格式为：`fie-toolkit-{toolkitName}`。如聚星台业务套件：[fie-toolkit-blue](https://github.com/fieteam/fie-toolkit-blue)，若要使用该套件可直接初始化：

```bash
$ fie init blue
```

执行该命令后，会自动判断本地是否已安装了该套件，若已安装则直接初始化；若未安装，则自动在电脑中进行安装，安装完后再进行初始化操作。

### 例子

```bash
# 创建一个叫toolkit-demo的空文件夹，并进入该文件夹
$ mkdir toolkit-demo && cd $_
# 初始化聚星台套件
$ fie init blue
```

[![](http://img3.tbcdn.cn/5476e8b07b923/TB1YRrIOpXXXXXIXVXXXXXXXXXX)](http://img3.tbcdn.cn/5476e8b07b923/TB1YRrIOpXXXXXIXVXXXXXXXXXX)

## fie update [name]

更新fie模块到最新版本。

### 例子

```bash
# 更新聚星台套件到最新版本
$ fie update toolkit-blue

# 更新git操作插件到最新版本
$ fie update plugin-git
```

## fie uninstall [name]

删除fie模块。

### 例子

```bash
# 删除聚星台套件
$ fie uninstall toolkit-blue

# 删除git操作插件
$ fie uninstall plugin-git
```

## fie list [type]

显示fie可用的模块列表。也可直接在npm上搜索 [fie-toolkit](https://www.npmjs.com/search?q=fie-toolkit) 和 [fie-plugin](https://www.npmjs.com/search?q=fie-plugin)

其中 `type` 值为 `toolkit` 和 `plugin`。

### 例子

```bash
# 显示fie所有模块
$ fie list

# 显示fie所有套件
$ fie list toolkit

# 显示fie所有插件
$ fie list plugin
```

## fie ii

npm模块安装，用于代替`npm install`命令，其用法与`npm install`一致。**强烈建议用`fie ii`代替`npm install`**。

ii命令实际调用的是[npminstall](https://www.npmjs.com/package/npminstall)模块，主要是为了解决 `npm install`在国内安装速度过慢的问题。

### 例子

```bash
# 在项目根目录执行，安装package.json中的模块依赖
$ fie ii

# 保存 co模块 到package.json中的dependencies字段
$ fie ii co --save

# 安装 4.2.0版本的 co模块
$ fie ii co@4.2.0
```

更多用法可参考：[https://github.com/cnpm/npminstall/blob/master/README.md#npminstall-1](https://github.com/cnpm/npminstall/blob/master/README.md#npminstall-1)

## fie clear

清空fie本地缓存。

当fie模块安装出现异常时，可使用该命令将fie的缓存目录进行初始化。初始化之后，**会清空fie安装过的所有fie模块，fie内外网配置文件**

### 例子

```bash
# 清空fie本地缓存
$ fie clear
```

## fie switch

fie内外网切换。

fie支持内网及外网两套开发环境。fie在外网环境下，只能安装开源且发布到npm上的模块；在内网环境下，只能安装和使用内网@ali 命名空间的fie模块。**两套环境相互隔离，无法相互调用。**

输入`fie switch`命令后，会让其选择对应的环境。其中

* **阿里内网环境**：阿里员工/可使用VPN登录阿里内网的用户
* **外网环境**：ISV/无法访问阿里内网的用户

```bash
# 切换fie内外网环境
$ fie switch
```

![](http://img3.tbcdn.cn/5476e8b07b923/TB154HrOpXXXXXKapXXXXXXXXXX)



