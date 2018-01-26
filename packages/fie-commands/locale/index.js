/**
 * 语言文件
 */

module.exports = {
  zh_CN: {
    // clear.js
    startClear: '开始清除缓存...',
    finishClear: '缓存清除完成!',
    // help.js
    help: `
 {tool} 使用帮助:  $ {tool} [command] [options]

    $  {tool}                     显示{tool}帮助信息,若目录下有使用的套件,则会同时显示套件的帮助信息
    $  {tool} init [toolkitName]  初始化套件
    $  {tool} install [name]      安装{tool}模块
    $  {tool} update [name]       更新{tool}模块
    $  {tool} list [type]         插件列表
    $  {tool} ii                  安装npm模块，功能等同于npm install，但安装速度更快更稳定
    $  {tool} clear               清空 {tool} 的本地缓存
    $  {tool} switch              切换 {tool} 的开发环境
    $  {tool} locale              切换 {tool} 的语言环境
    $  {tool} help                显示套件帮助信息
    $  {tool} [name]              其他调用插件命令

   Options:

     -h, --help                显示{tool}帮助信息
     -v, --version             显示{tool}版本

`,
    helpTips: ' 提示: ',
    helpToolkit: '   套件 - 若想查看项目中所使用的套件帮助信息,请在项目根目录执行该命令.',
    helpPlugin:
      '   插件 - 若想查看插件的帮助信息,请使用 {tool} [name] help 命令, eg : {tool} git help',
    helpEnv: '   环境 - 当前FIE开发环境为: {env} , 可使用 $ {tool} switch 进行切换',
    helpList: '\r\n ------- 以下是 {tool} 自身的命令 ------- ',
    // init.js
    toolkitNotFound: '{toolkit} 套件不存在',
    toolkitInit: '请选择一个适合您项目的套件进行初始化:',
    toolkitReportInit: '该项目已初始化过,无需再次进行init',
    toolkitInitTips: '若想重新初始化,请删除项目中的 {file} 文件',
    fileExist: '当前目录下已存在文件,继续执行初始化会覆盖已存在的同名文件',
    confirmInit: '确认需要继续执行初始化,请输入(y)',
    // install.js
    installTips: '请输入需要安装的模块名!',
    // list.js
    toolkit: 'toolkit',
    plugin: 'plugin',
    toolkitAndPlugin: 'toolkit/plugin',
    list: 'list',
    toolkitList: '- 套件列表 \r\n',
    pluginList: '\r\n- 插件列表 \r\n',
    // main.js
    pluginNotFound: '{plugin} 插件不存在',
    pluginCommandNotFound: '未找到 {module} 插件对应的命令 {pluginCmd}',
    moduleVersion: '\n {module} 对应版本为 {version}\n',
    localNotFound: '本地未安装 toolkit-{name} 或 plugin-{name} 模块',
    configFileNotFound: '未检测到 {file} 文件, 请确认当前命令是否在项目根目录下执行',
    runPlugin: '请输入您要运行的插件名',
    notRunTips: '未找到 {command} 对应的套件命令,后置任务无法执行',
    startNotRunTips:
      '该套件尚未实现 {command} 命令，请检查拼写是否正确或执行 {tool} -h 查看可用命令',
    configNotRunTips: '{file} 文件中尚不存在 {command} 命令，请检查拼写是否正确',
    // switch
    switchEnvTips: '请选择开发环境:',
    aliIntranet: '阿里内网环境',
    aliIntranetTips: '阿里员工/可使用VPN登录阿里内网的用户',
    aliExtranet: '阿里外网环境',
    aliExtranetTips: 'ISV/无法访问阿里内网的用户',
    initEnvSuccess: '成功初始化开发环境!',
    // locale
    switchLocaleTips: '初始化语言环境',
    initLocalSuccess: '成功初始化语言环境',
  },
  en_US: {
    startClear: 'Start clearing the app cache...',
    finishClear: 'The cache is cleared',
    help: `
 {tool} help tips:  $ {tool} [command] [options]

    $  {tool}                     display {tool} help info. If there are existing toolkits, it would display the help info of the toolkits
    $  {tool} init [toolkitName]  Initialize Toolkit 
    $  {tool} install [name]      Install {tool}
    $  {tool} update [name]       Update {tool}
    $  {tool} list [type]         List toolkits
    $  {tool} ii                  Install npm modules，an alias to npm install, faster and more stable
    $  {tool} clear               Clear {tool}'s local cache
    $  {tool} switch              Switch {tool}'s environment
    $  {tool} locale              switch fie language
    $  {tool} help                Display toolkits help info
    $  {tool} [name]              Other command for toolkit

   Options:

     -h, --help                display {tool} help info
     -v, --version             show {tool} version

`,
    helpTips: ' Tips: ',
    helpToolkit:
      '   Toolkit - Please run this command at root folder to get help info of toolkits in current project.',
    helpPlugin:
      '   Plugin - Please run {tool} [name] help to read the help info of the plugins, eg : {tool} git help',
    helpEnv:
      '   Environment - Current {tool} environment: {env} , use $ {tool} switch to switch environment',
    helpList: '\r\n ------- Below are {tool} useful command ------- ',
    // init.js
    toolkitNotFound: '{toolkit} toolkit not exist',
    toolkitInit: 'Please choose a toolkit to init the project:',
    toolkitReportInit: 'The project is already initialized, no need to init again',
    toolkitInitTips: 'Please remove {file}, if you need to re-initialize the project',
    fileExist:
      'Current folder is not empty, continuing the init procedure would replace existing files',
    confirmInit: 'Confirm if you need to continue init, type in (y)',
    // install.js
    installTips: 'Please input the module name that you need to install!',
    // list.js
    toolkit: 'Toolkit',
    plugin: 'Plugin',
    toolkitAndPlugin: 'Toolkit/Plugin',
    list: 'List',
    toolkitList: '- Toolkit List \r\n',
    pluginList: '\r\n- Plugin List \r\n',
    // main.js
    pluginNotFound: '{plugin} plugin no exist',
    pluginCommandNotFound: '{module} plugin {pluginCmd} command no exist',
    moduleVersion: '\n {module} version is {version}\n',
    localNotFound: 'No toolkit-{name} or  plugin-{name} installed',
    configFileNotFound: 'Cannot find {file}, Please make sure your are in root folder',
    runPlugin: 'Please input the toolkit name',
    notRunTips: 'Can not find {command} for toolkit, stop progressing',
    startNotRunTips:
      'No {command} exist for current toolkit，Please check your spell or run {tool} -h to list all usable command',
    configNotRunTips: '{file} does not have {command} command，Please check your spell',
    // switch
    switchEnvTips: 'Please choose the development environment:',
    aliIntranet: 'Alibaba Intranet',
    aliIntranetTips: 'Alibaba emplotyees/VPN users',
    aliExtranet: 'Alibaba Extranet',
    aliExtranetTips: 'ISV/No access to intranet users',
    initEnvSuccess: 'Init environment succeed!',
    // locale
    switchLocaleTips: 'Init language environment',
    initLocalSuccess: 'Init language environment succeed!',
  },
};
