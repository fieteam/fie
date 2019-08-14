/**
 * FIE 配置文件
 * 详细配置可查看: http://fie.alibaba-inc.com/doc?spm=a1zcv.8295895.0.0.34f812d3KNb4wD&name=use-config
 */

module.exports = {

  tasks: {
    // 顺序执行 commands 的命令,类似于 package.json 中 的 scripts 字段
    start: [
      {
        // 检测dependencies中的版本依赖
        command: 'fie check --update',
      },
      {
        // 将当前目录链接到fie 本地cdn目录
        command: 'fie link',
      },
    ],

    build: [
      {
        // console检测
        command: 'fie console detect --force',
      },
      {
        command: 'npm run build',
      },
    ],

    publish: [
      // 可以自定义发布流程
      // 默认发布到CDN, 则执行 fie publish -d 发布到日常; fie publish -o 发布到线上
    ],

    open: [
      {
        // 打开当前项目的gitlab地址
        command: 'fie git open',
      },
    ],
  },
};
