
'use strict';

const request = require('axios');
const { env } = require('fie-api');
const fieModule = require('fie-module');
const fieCache = require('fie-cache');
const fieConfig = require('fie-config');
const Intl = require('fie-intl');
const { spawn, spawnSync } = require('child_process');
const vm = require('vm');
const fieLog = require('fie-log');
const co = require('co');
const message = require('../locale/index');

const log = fieLog('fie-rule-dispatcher');
const isIntranet = env.isIntranet();
const intl = new Intl(message);

// 先从环境变量里获取fie配置文件的目录，这样方便做调试
const ruleDataCacheKey = 'dynamic-rules';
const ruleDataCacheExpire = 3600000; // 1小时
const ENV_CONFIG = {
  dynamicRuleApi: 'http://fiecfg.alibaba-inc.com/openapi/toolkit-configs/online'
};

// fie.config.js中的插件配置
// forceUpdateRules: 强制更新数据
// disableDynamicRules: 允许用户关闭动态规则执行

const {
  forceUpdateRules,
  disableDynamicRules // 用于用
} = fieConfig.get('rule-dispatcher') || {};

let fieAllRules = {};

async function fetchRulesOnline() {
  let data = null;
  try {
    const resp = await request(ENV_CONFIG.dynamicRuleApi);
    const body = resp.data;
    const _data = body.data;
    data = _data.constructor.name === 'Array' ? _data[0] : _data; // {code,data}
  } catch (e) {
    log.error(`FIE配置数据接口 ${ENV_CONFIG.dynamicRuleApi} 无法访问:`, e);
  }
  return data;
}

function saveRuleDataToCache(data) {
  fieCache.set(ruleDataCacheKey, data, { expires: ruleDataCacheExpire });
  log.debug('saveRuleDataToCache', data);
  return true;
}

function readRuleDataFromCache() {
  const cache = fieCache.get(ruleDataCacheKey);
  log.debug('readRuleDataFromCache: ', cache);
  return cache;
}

/** 同步线上规则到本地 */
async function syncRules() {
  log.debug('syncRules');
  if (!isIntranet) return []; // 外网环境无需同步规则
  let data = readRuleDataFromCache();
  if (!data || forceUpdateRules) {
    try {
      data = await fetchRulesOnline();
      saveRuleDataToCache(data);
      log.info(intl.get('ruleSyncEnd'));
    } catch (e) {
      log.error(intl.get('ruleSyncError'), e);
    }
  }
  fieAllRules = data || {};

  return fieAllRules;
}


function getRules({ toolkit, command, preriod }) {
  const toolkitConfig = fieAllRules[toolkit] || {};
  const commandConfig = toolkitConfig[command] || {};
  const rules = commandConfig[preriod];
  return rules;
}

async function installPluginsIfNeed(plugin) {
// 按需安装fie 插件
  const module = await (new Promise((resolve, reject) => {
    co(function* () {
      try {
        const mod = yield fieModule.get(plugin);
        resolve(mod);
      } catch (e) {
        reject(e);
      }
    });
  }));
  return module;
}

// 执行一段sh命令
async function execShell({ script, async = true }) {
  log.debug(`execShell: ${script}`, `. async=${async}`);  // silent暂不实现.
  const words = script.split(' ');
  const [command, ...args] = words;
  let childProcess = null;
  if (async) {  // 异步
    // return new Promise((resolve, reject) => {
    log.debug(`execShell异步执行:  ${script}`);
    childProcess = spawn(command, args, { encoding: 'utf8', stdio: 'inherit' });

    childProcess.stdout && childProcess.stdout.on('data', (data) => { // process.stdout is null when spawn option have : stdio: 'inherit'
      const msg = String(data);
      log.info(`shell run end, ${script}`);
      log.debug(msg);
    });

    childProcess.stderr && childProcess.stderr.on('data', (data) => {
      const msg = String(data);
      log.error(`execShell 失败, ${script}`);
      log.debug(msg);
    });

    childProcess.on('exit', (code) => {
      log.debug('rule dispatcher exit:', code);
      // resolve(code);
    });

    process.on('exit', () => {
      log.debug('主进程退出, execShell 子进程也退出.');
      process.kill(childProcess.pid);
    });
    return true;
   // });
  }
  // 同步
  const result = {
    success: true,
    message: ''
  };

  try {
    log.debug('run script in child process:');
    childProcess = spawnSync(command, args, { encoding: 'utf8', stdio: 'inherit' }); // {silent,}
    result.message = childProcess.stdout;
    log.debug('execShell同步执行成功', childProcess);
    process.on('exit', () => {
      log.debug('主进程退出, execShell 子进程也退出.');
      process.kill(childProcess.pid);
    });
  } catch (e) {
    result.success = false;
    result.message = e;
    log.debug('execShell同步执行出错', e);
  }

  return result;
}

function execJS({ script, async = false, plugin }) {
  const scriptWrapper = `(function(){${script}})();`; // 兼容vm默认加return的行为
  const vmscript = new vm.Script(scriptWrapper);
  // const sandbox = {  // for runInNewContext
  //   myPlugin: plugin,
  //   cwd: process.cwd(),
  //   fieLog,
  // };
  global.$myPlugin = plugin;
  global.$cwd = process.cwd();
  global.$fieLog = fieLog;
  let result = null;

  if (async) {
    Promise.resolve(true).then(() => {
      vmscript.runInThisContext();
    });
  } else {
    result = vmscript.runInThisContext(); // runInNewContext不支持显示自定义脚本中log, 因此使用runInThisContext. 副作用是污染global
  }

  log.debug(`execJS: script =${script}, async = ${async} ,result = ${result}`);
  return result;
}

/** * 执行一个套件的指定规则 */
async function execRules({ toolkit, command, preriod }) {
  if (disableDynamicRules || !isIntranet) {
    return null;
  }
  log.info(`exec rules: toolkit=${toolkit}, command=${command}, preriod=${preriod} `);
  const rules = getRules({ toolkit, command, preriod });
  log.debug('rules: ', rules);
  if (!rules) return null;
  log.info(`rules count: ${rules.length}`);
  try {
    const promises = rules.map(async (rule) => {
      const { plugin, script, async, type = 'shell', silent } = rule;
      let fiePlugin;
      if (plugin) {
        fiePlugin = await installPluginsIfNeed(plugin);
        log.debug('plugin existed or installed:', fiePlugin);
      }
      switch (type) {
        case 'node': {
          return execJS({ script, async, silent, plugin: fiePlugin });
        }
        case 'shell':
        default: {
          return await execShell({ script, async, silent });
        }
      }
    });

    const result = await Promise.all(promises);
    return result;
  } catch (e) {
    log.error('规则有误,跳过执行');
    return null;
  }
}

function fieArgsReducer(args = []) {
  const argsmap = {};
  args.forEach((item) => {
    const [key, value] = item.split('=');
    key && (argsmap[key] = value);
  });
  if (argsmap['dynamic-rule-api']) {
    ENV_CONFIG.dynamicRuleApi = argsmap['dynamic-rule-api'];
  }
}


/** 初始化 规则管理插件 */
async function init(args) {
  fieArgsReducer(args);

  log.info(intl.get('init'));
  return await syncRules();
}

// 内网转
const dispatcher = {
  init,
  syncRules,
  execRules
};


module.exports = dispatcher;
