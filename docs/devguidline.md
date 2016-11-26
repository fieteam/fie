FIE 代码规范

> 基本遵循
	> [集团前端规范](http://guide.taobao.net/)
	> [阿里巴巴集团开发规约（正式版）](http://www.atatech.org/articles/50331?flag_data_from=active)

针对fie及重构，以及考虑到js文档代码自动生成, 另外提出约定
必须按[jsdoc 的规约](http://usejsdoc.org/about-getting-started.html) 进行注释

### 注释 

0. 文件头部注释 

    * 如果是模块入口文件，以packages/fie-fs/lib/index.js 为例

        ```
        /**
        * @desc (必填)这文件是做什么的?
        * @see (可选)http://fie.alibaba.net/doc?package=fie-home
        * @requires (有就填)@ali/fie-log
        * @author (必填)擎空 <qingkong@alibaba-inc.com>
        * @namespace (必填)fie-fs
        */
        ```

   * 如果是非入口文件，则是子模块，要加 @memberOf 以以packages/fie-fs/lib/copy-directory.js 为例

        ```
        /**
        * @desc (必填)这文件是做什么的?
        * @see (可选)http://fie.alibaba.net/doc?package=fie-home
        * @requires (有就填)@ali/fie-log
        * @author (必填)擎空 <qingkong@alibaba-inc.com>
        * @namespace (必填)copy-directory
        * @memberOf (是子模块必填)fie-fs
        * @exports (是子模块必填) copy-directory
        */
        ```

0. 方法体注释
    * 需要爆露出来的方法有出参与入参必须写上注释。 如下：

        ```
        /**
        * @desc hook a string
        * @param {string} content string to be hook
        * @param {object} hookOptions
        * @param {string} hookOptions.hook  判断需要插入行的标记
        * @param {array}  hookOptions.insertLines 数组类型, 每一项为新行
        * @param {string} hookOptions.place   before / after(默认)
        * @param {string} hookOptions.noMatchActive   top / bottom / null(默认)
        * @return {string} 
        */
        const hookMatchStr = (content, hookOptions) => {
            //... 
        }

        ```
        
### 其他

0. 一个方法体加上注释不能超过80行
    * 超过80行考虑重构成两个或多个方法。
0. 尽量用es6 面向未来的方式组织代码