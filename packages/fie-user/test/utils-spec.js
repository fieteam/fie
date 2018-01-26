'use strict';

const proxyquire = require('proxyquire');
const path = require('path');
const fs = require('fs-extra');

const mockPath = path.resolve(__dirname, 'fixtures');

const fieUser1 = proxyquire('../lib/utils', {
  'cross-spawn': {
    sync: () => ({ stdout: null }),
  },
});

const fieUser2 = proxyquire('../lib/utils', {
  'cross-spawn': {
    sync: () => {
      throw Error('控制台抛出导异常');
    },
  },
});

const fieUser3 = proxyquire('../lib/utils', {
  'cross-spawn': {
    sync: () => ({ stdout: 'has git but not config email and name' }),
  },
});

const fieUser4 = proxyquire('../lib/utils', {
  'cross-spawn': {
    sync: () => ({
      stdout: `
        core.trustctime=false
        credential.helper=osxkeychain\nuse.name=fie.test.user\nuse.email=fie.test.user@alibaba-inc.com\nuser.name=fie.test.user\nuser.email=fie.test.user@alibaba-inc.com
        core.excludesfile=/Users/alexyu/.gitignore
      `,
    }),
  },
});

const fieUser5 = proxyquire('../lib/utils', {
  'fie-home': {
    getHomePath() {
      return mockPath;
    },
  },
});

const fieUser6 = proxyquire('../lib/utils', {
  'fie-home': {
    getHomePath() {
      return path.resolve(__dirname);
    },
  },
});

describe('# fie-use/lib/utils', () => {
  describe('# getUserFromGit 获取用户信息', () => {
    it('用户没有安装git,返回用户信息为空', () => {
      const userInfo = fieUser1.getUserFromGit();

      expect(userInfo).to.be.an('object');
      expect(userInfo.name).to.be.equals('');
      expect(userInfo.email).to.be.equals('');
    });

    it('用户控制台抛出异常,返回用户信息为空', () => {
      try {
        fieUser2.getUserFromGit();
      } catch (ex) {
        expect(ex).to.be.an.instanceof(Error);
        expect(ex.message).to.be.equal('控制台抛出导异常');
      }
    });

    it('用户安装git了,没有配置用户信息,返回用户信息为空', () => {
      const userInfo = fieUser3.getUserFromGit();
      expect(userInfo).to.be.an('object');
      expect(userInfo.name).to.be.equals('');
      expect(userInfo.email).to.be.equals('');
    });

    it('正常获得user获取用户信息', () => {
      const userInfo = fieUser4.getUserFromGit();
      expect(userInfo).to.be.an('object');
      expect(userInfo.name).to.be.equal('fie.test.user');
      expect(userInfo.email).to.be.equal('fie.test.user@alibaba-inc.com');
    });
  });

  describe('# getUserFromFile 获取用户信息', () => {
    const user = {
      email: 'fie-test@alibaba-inc.com',
      name: 'fie-user',
    };
    // 测试前先准备一下环境
    before(() => {
      fs.mkdirsSync(mockPath);
      fs.outputJsonSync(path.join(mockPath, 'fie.user.json'), user);
    });

    after(() => {
      fs.removeSync(mockPath);
    });

    it('有fie.user.json文件，返回用户信息', () => {
      const userInfo = fieUser5.getUserFromFile();
      expect(userInfo).to.be.an('object');
      expect(userInfo.name).to.be.equals(user.name);
      expect(userInfo.email).to.be.equals(user.email);
    });

    it('没有fie.user.json文件,返回用户信息为空', () => {
      const userInfo = fieUser6.getUserFromFile();
      expect(userInfo).to.be.an('object');
      expect(userInfo.name).to.be.equals('');
      expect(userInfo.email).to.be.equals('');
    });
  });
});
