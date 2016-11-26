# FIE 开发规范

## 代码贡献规范

有任何疑问，欢迎提交 [issue](http://gitlab.alibaba-inc.com/fie/fie/issues)，或者直接修改提交 [MR](http://gitlab.alibaba-inc.com/fie/fie/merge_requests)!




### 1. 拉分支

**所有代码不允许直接提交到master，而必须通过其他分支进行合并。**，若有新需求，或者bug fix，需要拉一个新的分支进行修改。

为了简化流程，分支名没有硬性规定。只有几点建议：

0. 分支名最好具有语义化、能区分、不重复即可。如：bugfix-fiestart、feature-updatetime 等。
1. 建议一个需求一个分支，这样方便其他同学进行code review。

```bash
// 先创建开发分支开发，分支名尽量语义化，避免使用 update、tmp 之类的
$ git checkout -b branch-name

// 开发完成后跑下测试是否通过，必要时需要新增或修改测试用例
$ tnpm test

// 测试通过后，提交代码，message 见下面的规范

$ git add . // git add -u 删除文件
$ git commit -m "修复fie start 时提示不正确的问题"
$ git push origin branch-name
```

### 2. 提交Merge Request

需求提交后就可以在 [fie](http://gitlab.alibaba-inc.com/fie/fie/merge_requests) 创建 MR 了。

创建MR时，在『Assignee』项里选择 code review 的同学。

![](http://img3.tbcdn.cn/5476e8b07b923/TB1s9wnKFXXXXcKaXXXXXXXXXXX)

为了方便其他同学进行review，请在提交 MR 时确保提供了以下信息。

1. 需求点（一般关联 issue 或者注释都算）
2. 升级原因（不同于 issue，可以简要描述下为什么要处理）

**注意：Target branch 一般是下个需要发布的版本 release-x.y.z，而不是master**


### 3. code review

提交MR后，需要由其他同学进行code review。对有疑问的部分，可直接在文件上进行注释。

提交分支的同学，可继续在当前分支上进行修改，直至review完成。

![](http://img3.tbcdn.cn/5476e8b07b923/TB1CZgDKFXXXXawXFXXXXXXXXXX)


### 4. 合并分支

review完成后，将当前分支合并至需要发布的 release-x.y.z 分支。同时删除当前分支（避免太多分支看着眼花）

![](http://img3.tbcdn.cn/5476e8b07b923/TB1ft7nKFXXXXXmapXXXXXXXXXX)



## 发布管理

fie 基于 [semver] 语义化版本号进行发布。

### 分支规范

`master` 分支为当前稳定发布的版本，`release-x.y.z` 分支为下一个开发中的版本。

发布前确定需要发布的issues，并从master上拉取分支。以2.3.0版本为例。

```bash
// 从master上新建发布的分支
$ git checkout -b release-2.3.0

// 将分支提交到gitlab，方便其他开发者发起MR
$ git commit -m "新建2.3.0版本"
$ git push origin release-2.3.0 

```

### 发布规范

fie发布周期一般为2周，每个大版本都有一个PM，由PM分配当前版本的issues。

发布前，需要确认issues的完成情况，并跑一遍单元测试。

```bash
// 运行单元测试
$ tnpm run test
```

所有准备工作完成后，则进行发布。**注意修改package.json中的版本号**

```bash
// 将fie发布至tnpm
$ tnpm publish

//打tag 方便版本记录
$ git tag release-2.3.0

//将当前tag 发布至gitlab
$ git push --tag

```


