'use strict';

const proxyquire = require('proxyquire');

const fieUser1 = proxyquire('../lib/index', {
  'cross-spawn': {
    sync: () => ({ stdout: null })
  }
});

const fieUser2 = proxyquire('../lib/index', {
  'cross-spawn': {
    sync: () => { throw Error('控制台抛出导异常'); }
  }
});

const fieUser3 = proxyquire('../lib/index', {
  'cross-spawn': {
    sync: () => ({ stdout: 'has git but not config email and name' })
  }
});

const fieUser4 = proxyquire('../lib/index', {
  'cross-spawn': {
    sync: () => ({ stdout: `
        core.trustctime=false
        credential.helper=osxkeychain\nuse.name=fie.test.user\nuse.email=fie.test.user@alibaba-inc.com\nuser.name=fie.test.user\nuser.email=fie.test.user@alibaba-inc.com
        core.excludesfile=/Users/alexyu/.gitignore
      `
    })
  }
});


describe('fie-user获取用户信息', () => {
  it('用户没有安装git,返回用户信息为空', () => {
    const userInfo = fieUser1.getUser();

    expect(userInfo).to.be.an('object');
    expect(userInfo.name).to.be.equals('');
    expect(userInfo.email).to.be.equals('');
  });

  it('用户控制台抛出异常,返回用户信息为空', () => {
    try {
      fieUser2.getUser();
    } catch (ex) {
      expect(ex).to.be.an.instanceof(Error);
      expect(ex.message).to.be.equal('控制台抛出导异常');
    }
  });

  it('用户安装git了,没有配置用户信息,返回用户信息为空', () => {
    const userInfo = fieUser3.getUser();
    expect(userInfo).to.be.an('object');
    expect(userInfo.name).to.be.equals('');
    expect(userInfo.email).to.be.equals('');
  });

  it('正常获得user获取用户信息:', () => {
    const userInfo = fieUser4.getUser();
    expect(userInfo).to.be.an('object');
    expect(userInfo.name).to.be.equal('fie.test.user');
    expect(userInfo.email).to.be.equal('fie.test.user@alibaba-inc.com');
  });
});

