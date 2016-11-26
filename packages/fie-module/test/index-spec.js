/*
'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const mockFieEnv = require('fie-env');
const emptyLog = require('../../../test/fixtures/empty-log');

const MODULE_CACHE_KEY = 'allModule';


describe('# fie 模块操作', () => {
  function mockList() {
    return [];
  }

  const mockFieHome = {
    getHomePath: () => path.resolve(__dirname, 'fixtures'),
    getModulesPath: () => path.resolve(__dirname, 'fixtures/node_modules')
  };

  const isIntranet = true;

  before(() => {
    mockFieEnv.isIntranet = () => isIntranet;
  });

  const mockFieCache = proxyquire('fie-cache', {
    'fie-home': mockFieHome
  });
  const fieModule = proxyquire('../lib/index', {
    'fie-log': emptyLog,
    'co-request': function* () {
      mockList.apply(this, [].slice.call(arguments));
    },
    'fie-home': mockFieHome,
    'fie-cache': mockFieCache
  });

  describe('# 内网环境', () => {
    const mockList2 = [];
    beforeEach(() => {
      mockFieCache.set(MODULE_CACHE_KEY, mockList2);
    });

    it('get 获取模块', function* () {
      // const modInfo = yield fieModule.get('@ali/fie-toolkit-next');
      // console.log(modInfo.options);
    });
  });

  describe('# 外网环境', () => {
  });


  describe('# 断网环境', () => {
  });
});
*/
