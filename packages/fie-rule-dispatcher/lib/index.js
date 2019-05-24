
'use strict';

const request = require('axios');
const fieModule = require('fie-module');
const fieCache = require('fie-cache');
const fieConfig = require('fie-config');
const { exec } = require('child_process');
const vm = require('vm');

const co = require('co');
const log = require('fie-log')('fie-rule-dispatcher');

// 先从环境变量里获取fie配置文件的目录，这样方便做调试
const cwd = process.cwd();
const ruleDataCacheKey = 'dynamic-rules';
const ruleDataCacheExpire = 3600000; // 1小时
const publisherUrl = 'https://mocks.alibaba-inc.com/mock/fie-config-platform/config?_tag=%E6%B5%8B%E8%AF%95%E5%8B%BF%E8%BD%BB%E6%98%93%E5%8A%A8';

// fie.config.js中的插件配置
// forceUpdateRules: 强制更新数据
// disableDynamicRules: 允许用户关闭动态规则执行

const {
  forceUpdateRules,
  disableDynamicRules // 用于用
} = fieConfig.get('rule-dispatcher') || {};
let fieAllRules = {};

async function fetchRulesOnline() {
  const resp = await request(publisherUrl);
  const _data = resp.data;
  const { data } = _data; // {code,data}

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

async function syncRules() {
  log.debug('syncRules');
  let data = readRuleDataFromCache();
  if (!data || forceUpdateRules) {
    try {
      data = await fetchRulesOnline();
      saveRuleDataToCache(data);
    } catch (e) {
      log.error('fie同步规则出错', e);
    }
  }
  fieAllRules = data ? data.rules : [];

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
  const module = await (new Promise((resolve) => {
    co(function* () {
      const mod = yield fieModule.get(plugin);
      resolve(mod);
    });
  }));
  return module;
}

// 执行一段sh命令
async function execShell({ script, async = false, silent = true }) {
  log.debug(`execShell: ${script}`, `. async=${async}, silent=${silent}`);  // silent暂不实现.

  let process = null;
  if (async) {  // 异步
    return new Promise(() => {
      log.debug(`execShell, will spawn:  ${script}`);
      process = exec(script, { cwd }, (err, stdout, stderr) => {
        if (err) {
          log.debug(`execShell执行命令出错, ${script}, ${err}`);
        }
        if (stdout) { log.debug(`execShell执行命令成功, ${script}, ${stdout}`); }
        if (stderr) { log.debug(`execShell执行命令成功, ${script}, ${stderr}`); }
      });

      log.debug('exec script in child process:', process.pid);
    });
  }
  // 同步
  process = exec(script, { cwd }); // {silent,}
  log.debug('exec script in child process:', process);
  const { code, stdout } = process;
  const success = code === 0;
  if (!success) {
    log.debug(`execShell执行命令出错, ${script}`);
  }
  return {
    code,
    success,
    message: stdout.toString() || ''
  };
}

function execJS({ script, async = false, silent = true, plugin }) {
  const vmscript = new vm.Script(script);
  const sandbox = {
    curFiePlugin: plugin
  };
  const result = vmscript.runInNewContext(sandbox);
  log.debug(`execJS: script =${script} ,result = ${result}`);
  return result;
}

function execRules({ toolkit, command, preriod }) {
  if (disableDynamicRules) {
    return;
  }
  log.debug(`execRules: toolkit=${toolkit}, command=${command}, preriod=${preriod} `);
  const rules = getRules({ toolkit, command, preriod });
  log.debug(`and rules = : ${rules}`);
  if (!rules) return;
  rules.forEach(async (rule) => {
    const { plugin, script, async, type = 'shell', silent } = rule;
    let fiePlugin;
    if (plugin) {
      fiePlugin = await installPluginsIfNeed(plugin);
      log.debug('plugin existed or installed:', fiePlugin);
    }
    switch (type) {
      case 'shell': {
        execShell({ script, async, silent }); break;
      }
      case 'node': {
        execJS({ script, async, silent, plugin: fiePlugin }); break;
      }
      default: {
        execShell({ script, async, silent });
      }
    }
    return true;
  });
}


const dispatcher = {
  async init() {
    log.debug('fie-rule-dispatcher init');
    return await syncRules();
  },
  syncRules,
  execRules
};


module.exports = dispatcher;
