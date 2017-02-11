# FIE 开发环境安装及代码组织

## 开发环境安装 

### clone 代码项目到本地

```
$ git clone git@github.com:fieteam/fie.git
```

### 依赖安装

依赖安装完后,会自动执行 `lerna bootstrap`

```
npm install
```

###  创建软链从fie项目根目录到全局的 npm 的 bin 目录

```
# 进入 git clone 下来的fie 项目根目录，执行npm link, 如要提示要权限，前面加sudo 
$ npm link
```

### 修改代码

执行完上面的步骤之后 ,现在你在本机任何目录运行的 fie xxx 命令都将执行你当前项目目录下的代码,你可以轻松的进行调试和修改.

### 调试代码

#### 安装调试工具

```
$ npm install node-inspector -g
```

#### 启动调试

```
$ node-debug /path/to/fie/bin/fie [commands]
```
 
#### 查看 debug 输出

通过调用命令时传入 DEBUG=fie 可以查看 fie 核心打印的一些调试信息,用于快速定位错误原因

```
$ DEBUG=fie node /path/to/fie/bin/fie [commands]
```

可以结合 node-debug 一起使用, 在调试套件,插件时也可以在 DEBUG 中传入多个值,使用英文逗号分隔, 具体可以查看debug模块

### 测试

执行单元测试

```
$ npm test
```

## 代码组织

