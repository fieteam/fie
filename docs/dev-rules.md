# FIE 开发规范

## 代码贡献规范

有任何疑问，欢迎提交 [issue](https://github.com/fieteam/fie/issues)，或者直接修改提交 [PR](https://github.com/fieteam/fie/pulls)!


### 1. 拉分支

**所有代码不允许直接提交到 master，而必须通过其他分支进行合并。** 若有新需求，或者bug fix，需要拉一个新的分支进行修改。

为了简化流程，分支名没有硬性规定。只有几点建议：

0. 分支名最好具有语义化、能区分、不重复即可。如：bugfix-fiestart、feature-updatetime 等。
1. 建议一个需求一个分支，这样方便其他同学进行code review。

```bash
// 先创建开发分支开发，分支名尽量语义化，避免使用 update、tmp 之类的
$ git checkout -b branch-name

// 开发完成后跑下测试是否通过，必要时需要新增或修改测试用例
$ npm test

// 测试通过后，提交代码，message 见下面的规范
$ git add . // git add -u 删除文件
$ git commit -m "fix: 修复fie start 时提示不正确的问题"
$ git push origin branch-name
```

### 2. 提交 Pull Request

需求提交后就可以在 [fie](https://github.com/fieteam/fie/pulls) 创建 PR 了。

创建MR时，在『Assignee』项里选择 code review 的成员。

<!-- todo 添加图片 -->

为了方便其他同学进行review，请在提交 PR 时确保提供了以下信息。

1. 需求点（一般关联 issue 或者注释都算）
2. 升级原因（不同于 issue，可以简要描述下为什么要处理）


### 3. code review

提交 PR 后，需要由其他同学进行 code review。对有疑问的部分，可直接在文件上进行注释。

提交分支的同学，可继续在当前分支上进行修改，直至review完成。

<!-- todo 添加图片 -->


### 4. 合并分支

review 完成后，将当前分支合并至需要发布的 master 分支。同时删除当前分支（避免太多分支看着眼花）

<!-- todo 添加图片 -->

## 发布管理

fie 基于 [semver] 语义化版本号进行发布。


### 发布规范

fie 发布周期一般为2周，每个大版本都有一个 PM，由 PM 分配当前版本的issues。

发布前，需要确认issues的完成情况，并跑一遍单元测试。

```bash
// 运行单元测试
$ npm run test
```

fie 使用 lerna 进行包管理, 所有准备工作完成后，则进行发布。

```bash
// 将 fie 发布至 npm
$ lerna publish
```


