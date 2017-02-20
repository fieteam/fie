'use strict';

const path = require('path');
const proxyquire = require('proxyquire');
const fs = require('fs-extra');

const mockPath = path.resolve(__dirname, 'fixtures');
const cacheFile = path.resolve(mockPath, 'fie.cache.json');
const cache = proxyquire('../lib/index', {
  'fie-home': {
    getHomePath() {
      return mockPath;
    }
  }
});

describe('# fie-cache', () => {
  describe('# cache.json 不存在的情况下', () => {
    before(() => {
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
      }
    });
    after(() => {
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
      }
    });

    it('# get 获取缓存', () => {
      expect(cache.get('testKey1')).to.be.equal(null);
    });
    it('# set 设置缓存', () => {
      const key = 'testKey2';
      const value = Math.random();

      cache.set(key, value);

      const data = fs.readJsonSync(cacheFile);
      expect(data[key]).to.be.equals(value);
    });
  });

  describe('# cache.json 存在的情况下', () => {
    const testObj = {};
    const testKey = 'test';
    const testValue = Math.random();

    before(() => {
      testObj[testKey] = testValue;
      fs.outputJsonSync(cacheFile, testObj);
    });

    after(() => {
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
      }
    });
    it('# get 获取缓存', () => {
      expect(cache.get(testKey)).to.be.equal(testValue);
      expect(cache.get('notExistKey')).to.be.equals(undefined);
    });
    it('# set 设置缓存', () => {
      const key = 'testKey2';
      const value = Math.random();

      cache.set(key, value);

      const data = fs.readJsonSync(cacheFile);
      expect(data[key]).to.be.equals(value);
    });
  });


  describe('# 缓存有效期检测', () => {
    after(() => {
      if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
      }
    });

    it('# 过了有效期后获取到的值为null', () => {
      const key = 'testKey2';
      const value = Math.random();

      cache.set(key, value, {
        expries: 20
      });

      expect(cache.get('testKey2')).to.be.equal(value);

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(cache.get('testKey2')).to.be.equal(null);
          resolve();
        }, 21);
      });
    });
  });
});
