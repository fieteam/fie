# 使用环境安装

fie依赖 nodejs 、 npm 环境，若你还未安装好前端开发的环境，请先参考本文档进行安装。

## 安装 nodejs 与 npm

进入 [Node.js官网](https://nodejs.org/en/) 下载 Node.js 安装包, 并安装。  

验证安装是否成功，可以在命令行中执行以下命令，查看 Node.js 版本及 NPM 版本：

```
$ node -v
v5.6.0
$ npm -v
3.6.0
```
> [NPM](https://www.npmjs.com/) 是 node.js 的包管理工具，用于管理包的依赖。类似于 Java 中的 Maven, Ruby 中的 Gem。

## 安装FIE

安装fie到npm全局环境中

```bash
$ npm install fie -g 
```	

若你是在国内，可以使用淘宝的镜像进行安装，安装速度会更快，国内用户推荐：

```bash
$ npm install fie -g --registry=https://registry.npmmirror.com
```

注意：如果提示没有权限，请在前面加上 `sudo` 命令。

验证是否安装成功，可以在命令行中执行以下命令，查看 FIE 的版本：

```bash
$ fie -v
[fie-core] current version is v1.1.1
```

