/**
 * 语言文件
 */

module.exports = {
  zh_CN: {
    autoUpdate: '{name} 设置了自动更新,正在执行更新操作...',
    autoUpdateZ: '检查到您本地版本为 {localVersion} , 自动为您升级到兼容版本 {autoZVersion} 中...',
    autoInstall: '本地尚未安装 {name} ,正在执行自动安装...',
    // install-one.js
    importPkgError: '您传入的包名有误，请输入正确的包名，如： toolkit-blue，plugin-git',
    installSuccess: '{name} 安装成功',
    updateSuccess: '{name} 更新成功',
    // utils.js
    updateNone: '本地暂无可更新的模块',
    updateTo: '从 {localVersion} 升级至 {lastVersion}',
    updateVersion: '{lastVersion} 版本',
    localVersion: ' , 本地版本是 {localVersion} ',
    updateTips: '升级提示',
    recommendVersion: '{name} 推荐的版本是 {version}',
    recommendInstall: '请执行 {icon}  {installTip} 来升级模块',
    includeUpdate: '包含以下更新:'

  },
  en_US: {
    autoUpdate: '{name} has set an automatic update and is performing an update operation...',
    autoUpdateZ: 'Check your local version for {localVersion} to automatically upgrade to compatible version {autoZVersion} for you...',
    autoInstall: 'Local has not been installed {name} and is performing an automatic installation...',
    // install-one.js
    importPkgError: 'Your incoming package name is incorrect. Please enter the correct package name，eg: toolkit-blue，plugin-git',
    installSuccess: '{name} install completed',
    updateSuccess: '{name} update completed',
    // utils.js
    updateNone: 'There are no updates to the module',
    updateTo: 'Upgrade from {localVersion} to {lastVersion}',
    updateVersion: '{lastVersion} version',
    localVersion: ' , The local version is {localVersion} ',
    updateTips: 'Upgrade tips',
    recommendVersion: '{name} recommended version is {version}',
    recommendInstall: 'Please execute {icon} {installTip} to upgrade the module',
    includeUpdate: 'Include the following updates:'
  },
};
