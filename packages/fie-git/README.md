# fie-git

[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/fie-utils.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fie-utils
[david-image]: https://img.shields.io/david/cnpm/npminstall.svg?style=flat-square
[david-url]: https://david-dm.org/fieteam/fie-utils
[snyk-image]: https://snyk.io/test/npm/fie-utils/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/fie-utils
[download-image]: https://img.shields.io/npm/dm/fie-utils.svg?style=flat-square
[download-url]: https://npmjs.org/package/fie-utils

FIE git tools ， base on [git-rev-sync](https://www.npmjs.com/package/git-rev-sync)

## Installation

```
npm install fie-git --save
```

## API

``` js
const git = require('fie-git');
```

####  `git.status([filePath])` &rarr; &lt;Object&gt;

return the result of `git status --porcelain -b`;

```
{ local_branch: 'xxx',
remote_branch: null,
remote_diff: null,
clean: true/false,
files: []
}
```

#### `git.repository` &rarr; &lt;Object&gt;

return the result of `git config --get remote.origin.url`

#### `git.project` &rarr; &lt;Object&gt;

return group/name

#### `git.short([filePath])` &rarr; &lt;String&gt;

return the result of `git rev-parse --short HEAD`; optional `filePath` parameter can be used to run the command against a repo outside the current working directory

#### `git.long([filePath])` &rarr; &lt;String&gt;

return the result of `git rev-parse HEAD`; optional `filePath` parameter can be used to run the command against a repo outside the current working directory

#### `git.branch([filePath])` &rarr; &lt;String&gt;

return the current branch; optional `filePath` parameter can be used to run the command against a repo outside the current working directory

#### `git.count()` &rarr; &lt;Number&gt;

return the count of commits across all branches; this method will fail if the `git` command is not found in `PATH`

#### `git.date()` &rarr; &lt;Date&gt;

returns the date of the current commit; this method will fail if the `git` command is not found in `PATH`

#### `git.isTagDirty()` &rarr; &lt;Boolean&gt;

returns true if the current tag is dirty; this method will fail if the `git` command is not found in `PATH`

#### `git.message()` &rarr; &lt;String&gt;

return the current commit message; this method will fail if the `git` command is not found in `PATH`

#### `git.tag([markDirty])` &rarr; &lt;String&gt;

return the current tag and mark as dirty if markDirty is truthful; this method will fail if the `git` command is not found in `PATH`





## Support

使用过程中遇到的相关问题，及BUG反馈，可联系: hugohua <baofen14787@gmail.com> ，也可直接提[issues](https://github.com/fieteam/fie/issues/new)

## License

[GNU GPLv3](LICENSE)


