'use strict';

const proxyquire = require('proxyquire');


let fieError;
const handleEnoent = proxyquire('../lib/handle-eaddrinuse', {
  'fie-log': function () {
    return {
      error(e) {
        fieError = e;
      }
    };
  }
});


describe('#处理 EADDRINUSE 的异常', () => {
  it('#listen EADDRINUSE :::9000', function* () {
    yield handleEnoent({
      code: 'EADDRINUSE',
      message: `
Error: listen EADDRINUSE :::9000
    at Object.exports._errnoException (util.js:1007:11)
    at exports._exceptionWithHostPort (util.js:1030:20)
    at Server._listen2 (net.js:1253:14)
    at listen (net.js:1289:10)
    at Server.listen (net.js:1385:5)
    at Application.app.listen (/Users/hugo/.fie/node_modules/._koa@1.4.0@koa/lib/application.js:74:24)
    at Object.Commands.open (/Users/hugo/.fie/node_modules/._@ali_fie-plugin-server@1.2.3@@ali/fie-plugin-server/index.js:43:18)
    at Promise (/Users/hugo/.fie/node_modules/._@ali_fie-plugin-server@1.2.3@@ali/fie-plugin-server/index.js:140:30)
    at module.exports (/Users/hugo/.fie/node_modules/._@ali_fie-plugin-server@1.2.3@@ali/fie-plugin-server/index.js:134:10)
`
    });
    expect(fieError).to.be.contain('检测到当前端口号');
    expect(fieError).to.be.contain('9000');
  });

  it('#listen EADDRINUSE 127.0.0.1:3000', function* () {
    yield handleEnoent({
      code: 'EADDRINUSE',
      message: `
Error: listen EADDRINUSE 127.0.0.1:3000
    at Object.exports._errnoException (util.js:1007:11)
    at exports._exceptionWithHostPort (util.js:1030:20)
    at Server._listen2 (net.js:1253:14)
    at listen (net.js:1289:10)
    at Server.listen (net.js:1385:5)
    at Application.app.listen (/Users/hugo/.fie/node_modules/._koa@1.4.0@koa/lib/application.js:74:24)
    at Object.Commands.open (/Users/hugo/.fie/node_modules/._@ali_fie-plugin-server@1.2.3@@ali/fie-plugin-server/index.js:43:18)
    at Promise (/Users/hugo/.fie/node_modules/._@ali_fie-plugin-server@1.2.3@@ali/fie-plugin-server/index.js:140:30)
    at module.exports (/Users/hugo/.fie/node_modules/._@ali_fie-plugin-server@1.2.3@@ali/fie-plugin-server/index.js:134:10)
`
    });
    expect(fieError).to.be.contain('检测到当前端口号');
    expect(fieError).to.be.contain('3000');
  });
});

