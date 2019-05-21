
'use strict';

const path = require('path');
const fs = require('fs-extra');
const request = require('axios');
const report = require('fie-report');
const fieModule = require('fie-module');
const shelljs = require('shelljs');
const log = require('fie-log')('fie-rule-dispatcher');

// 先从环境变量里获取fie配置文件的目录，这样方便做调试
const CWD = process.cwd();

const publisherUrl = 'https://mocks.alibaba-inc.com/mock/fie-config-platform/config?_tag=%E6%B5%8B%E8%AF%95%E5%8B%BF%E8%BD%BB%E6%98%93%E5%8A%A8';

let fieAllRules = {};

async function fetchRulesOnline() {
  const resp = await request(publisherUrl);
  const _data = resp.data;
  const { code, data } = _data;
  return data;
}

function cacheRules() {}

async function syncRules() {
  log.debug('fetch rules from online');
  const data = await fetchRulesOnline();
  fieAllRules = data.rules || {};
  // cache rules
  // read rules
  return fieAllRules;
}


function getRules({ toolkit, command, preriod }) {
  const toolkitConfig = fieAllRules[toolkit] || {};
  const commandConfig = toolkitConfig[command] || {};
  const rules = commandConfig[preriod];
  return rules;
}

function installPluginsIfNeed(plugin) {
// 按需安装fie 插件
  fieModule.install(plugin);
}

// 执行一段sh命令
function execScript(script, async) {
  log.debug(`execScript: ${script}`, `. async=${async}`);
  const result = shelljs.exec(script, { silent: false, CWD });
  const { code, stdout } = result;
  const success = code === 0;
  if (!success) {
    log.debug(`execScript执行命令出错, ${script}`);
  }
  return {
    code,
    success,
    message: stdout.toString() || ''
  };
}

function execRules({ toolkit, command, preriod }) {
  const rules = getRules({ toolkit, command, preriod });
  if (!rules) return false;
  rules.forEach((rule) => {
    const { plugin, script, async, type = 'shell' } = rule;
    if (plugin) {
      installPluginsIfNeed(plugin);
    }
    switch (type) {
      case 'shell': {
        execScript(script, async); break;
      }
      case 'node':
        break;
      default:execScript(script, async); break;
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
