/**
 * @desc 上报日志核心方法
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 * @memberOf fie-report
 * @exports core
 */

'use strict';

module.exports = function (wpo, root, conf) {
  let cookies = {},
    config = {
      imgUrl: '//retcode.taobao.com/r.png?',
      sample: 100,
      modVal: 1,
      // startTime: null, // 设置统计起始时间
      dynamic: false, // 是否开启动态配置功能
      retCode: {}
    },
    uid,
    guid = 0,
    timer;

  const sendRequest = conf.sendRequest;

  const _send = function () {
    let params,
      obj;

    while (params = core.dequeue()) {
      obj = core.extend({
        uid,
        spm: config.spmId || core.getSpmId(),
        times: params.times ? params.times : 1,
        _t: ~new Date() + (guid++).toString()
      }, params);

      if (!obj.spm) {
        break;
      }

      if (wpo.debug && window.console) {
        console.log(obj);
      }
      sendRequest(config.imgUrl + core.query.stringify(obj));
    }

    timer = null;
  };

  const _wait = function (_clear) {
    if (_clear && timer) {
      clearTimeout(timer);
      _send();
    }
    if (!timer) {
      timer = setTimeout(_send, 1000);
    }
  };

  let core = {
    ver: '0.1.3',
    _key: 'wpokey',
    getCookie(name) {
      let reg,
        matches,
        cookie;

      if (!cookies[name]) {
        reg = new RegExp(`${name}=([^;]+)`);

        //
        // to make it compatible with nodejs
        //
        try {
          cookie = conf.getCookie(this);
        } catch (e) {

        }

        matches = reg.exec(cookie);
        if (matches) {
          cookies[name] = matches[1];
        }
      }

      return cookies[name];
    },
    setCookie(key, value, expires, domain, path) {
      let str = `${key}=${value}`;
      if (domain) {
        str += (`; domain=${domain}`);
      }
      if (path) {
        str += (`; path=${path}`);
      }
      if (expires) {
        str += (`; expires=${expires}`);
      }
      document.cookie = str;
    },
    extend(target) {
      const args = Array.prototype.slice.call(arguments, 1);

      for (let i = 0, len = args.length, arg; i < len; i++) {
        arg = args[i];
        for (const name in arg) {
          if (arg.hasOwnProperty(name)) {
            target[name] = arg[name];
          }
        }
      }

      return target;
    },
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    send(params) {
      this.queue(params);
      // sendRequest(config.imgUrl + core.query.stringify(obj));
    },
    query: {
      stringify(params) {
        const arr = [];
        for (const name in params) {
          if (params.hasOwnProperty(name) && params[name] !== undefined) {
            arr.push(`${name}=${params[name]}`);
          }
        }

        return arr.join('&');
      },
      parse(str) {
        let pairs = str.split('&'),
          obj = {},
          pair;

        for (let i = 0, len = pairs.length; i < len; i++) {
          pair = pairs[i].split('=');
          obj[pair[0]] = pair[1];
        }

        return obj;
      }
    },
    getSpmId() {
      if (config.spmId) {
        return config.spmId;
      } else if (typeof conf.getSpmId === 'function') {
        return conf.getSpmId.call(this);
      }
      return 0;
    },
    on(el, type, func, isRemoving) {
      if (el.addEventListener) {
        el.addEventListener(type,
          isRemoving ? () => {
            el.removeEventListener(type, func, false);
            func();
          } : func,
          false);
      } else if (el.attachEvent) {
        el.attachEvent(`on${type}`, function () {
          if (isRemoving) {
            el.detachEvent(`on${type}`, arguments.callee);
          }
          func();
        });
      }
    },
    getNick() {
      let result;
      try {
        return TB.Global.util.getNick();
      } catch (e) {
        result = this.getCookie('_nk_') || this.getCookie('_w_tb_nick') || this.getCookie('lgc');

        return decodeURIComponent(result);
      }
    },
    setConfig(conf) {
      return core.extend(config, conf);
    },
    dynamicConfig(obj) {
      const config = this.stringifyData(obj);

      try {
        localStorage.setItem(this._key, config);
      } catch (e) {
        this.setCookie(this._key, config, new Date(obj.expTime));
      }
      this.setConfig({
        sample: parseInt(obj.sample, 10)
      });
      this.ready();
    },
    parseData(str) {
      let pairs = str.split('&'),
        pair,
        obj = {};

      for (let i = 0, len = pairs.length; i < len; i++) {
        pair = pairs[i].split('=');
        obj[pair[0]] = pair[1];
      }

      return obj;
    },
    stringifyData(obj) {
      const params = [];

      for (const name in obj) {
        if (obj.hasOwnProperty(name)) {
          params.push(`${name}=${obj[name]}`);
        }
      }

      if (params.length) {
        return params.join('&');
      }
      return '';
    },
    ready(_immediately) {
      this._ready = true;
      this._immediately = _immediately;
      _wait();
    },
    queue(obj) {
      let queue = this.requestQueue,
        compare;
      if (obj.type === 'jserror') {
        if (queue.length) {
          compare = queue[queue.length - 1];
          if (obj.msg === compare.msg) {
            compare.times++;
            return;
          }
        }
        if (!obj.times) {
          obj.times = 1;
        }
      }
      queue.push(obj);

      if (this._ready) {
        //
        // for nodejs
        //
        if (this._immediately) {
          _send();
        } else {
          _wait();
        }
      }
    },
    dequeue() {
      return this.requestQueue.shift();
    },
    clear() {
      _wait(true);
    },
    //
    // dynamically updates itself without queue
    //
    requestQueue: wpo.requestQueue || []
  };

  // core.getSpmId = conf.getSpmId.bind(core);

  uid = core.guid();
  wpo.uid = uid;
  core.config = core.setConfig(wpo.config);
  core.extend(wpo, core);
  root.__WPO = wpo;

  return wpo;
};
