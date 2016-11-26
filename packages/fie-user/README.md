###  模块名
fie-user
### 模块作用
获取git 用户名和邮箱地址
$ git config --list 
### api
user = require('fie-user');
user.getUser()

### api example

```
user = require('fie-user');
user.getUser()

return {
    name: '',
    email: ''
}
```