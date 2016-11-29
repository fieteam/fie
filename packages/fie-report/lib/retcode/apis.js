/**
 * @desc 上报日志API
 * @author 六韬 <yubhbh@gmail.com>
 * @namespace fie-report
 * @memberOf fie-report
 * @exports apis
 */

'use strict';


module.exports = function (wpo, undef) {
  let startTime,
    scriptStart;

  if (wpo.startTime) {
    startTime = wpo.startTime;
  } else {
    try {
      startTime = window.performance.timing.responseStart;
      scriptStart = new Date();
    } catch (e) {
      scriptStart = startTime = new Date() - 0;
    }
  }

  const send = function (params, sampling) {
    sampling = sampling || wpo.config.sample;

    if (wpo.sampling(sampling) == (wpo.config.modVal || 1)) {
      params.sampling = sampling;
      wpo.send(params);
    }
  };

  /**
   * [custom description]
   * @param  {number|string} category [0/'time'，1/'count']
   * @param  {string} key      [自定义值]
   * @param  {object} value    [自定义值，如果type为count，自动忽略该值]
   * @return {void}
   */
  wpo.custom = function (category, key, value) {
    let customParam = {
        type: 'custom',
        usernick: wpo.getNick()
      },
      arr = ['time', 'count'];

    category = arr[category] || category;

    if (category == 'time' || category == 'count') {
      customParam.category = category;
    }

    if (customParam.type) {
      customParam.key = key;
      customParam.value = category == 'time' ? value : undef;
      send(customParam);
    }
  };

  /**
   * [error description]
   * @param  {string} category [可选参，错误类型，默认为sys]
   * @param  {string} msg      [自定义错误信息]
   * @return {void}
   */
  wpo.error = function (category, msg, file, line) {
    const errorParam = {
      type: 'jserror',
      usernick: encodeURIComponent(wpo.getNick())
    };

    if (arguments.length == 1) {
      msg = category;
      category = undefined;
    }

    if (!msg) {
      return;
    }

    errorParam.category = category || 'sys';
    errorParam.msg = encodeURIComponent(msg);

    //
    // separate msg file name
    //
    if (file) {
      errorParam.file = file;
    }

    if (line) {
      errorParam.line = line;
    }

    send(errorParam, 1);
  };

  /**
   * [performance description]
   * @param  {object} params [性能相关信息]
   * @return {void}
   */
  wpo.performance = function (params) {
    const perParam = {
      type: 'per'
    };

    send(wpo.extend(perParam, params));
  };

  /**
   * [retCode description]
   * @param  {string} api      [所调用的api]
   * @param  {boolean} issucess [是否成功，不成功会100%发送，成功按照抽样发送]
   * @param  {number|string} delay    [调用时间]
   * @param  {string} msg      [自定义消息]
   * @return {void}
   */
  wpo.retCode = function (api, issucess, delay, msg) {
    const retParam = {
      type: 'retcode',
      api: encodeURIComponent(api),
      issucess,
      usernick: wpo.getNick(),
      delay: typeof delay === 'number' ? parseInt(delay, 10) : (new Date() - startTime),
      msg: encodeURIComponent(msg),
      sampling: this.config.retCode[api]
    };

    if (typeof retParam.delay !== 'undefined') {
      send(retParam, issucess ? retParam.sampling : 1);
    }
  };

  const sendSpeed = function () {
    let perParam = {
        type: 'speed'
      },
      val;

    for (let i = 0, len = wpo.speed.points.length; i < len; i++) {
      val = wpo.speed.points[i];
      if (val) {
        perParam[`s${i}`] = val;
        wpo.speed.points[i] = null;
      }
    }

    send(perParam);
  };

  /**
   * [speed description]
   * @param  {number|string} pos          [0/'s0',1/'s1',2/'s2'....10/'s10']
   * @param  {number|string} delay        [耗时，如果没有定义，这按照当前时间减去页面起始时间]
   * @param  {boolean} _immediately [内部使用，是否强制发送，不强制发送会尽量收集3s内的所有点的数据一次性发送]
   * @return {void}
   */
  wpo.speed = function (pos, delay, _immediately) {
    let sArr;

    if (typeof pos === 'string') {
      pos = parseInt(pos.slice(1), 10);
    }

    if (typeof pos === 'number') {
      sArr = wpo.speed.points || new Array(11);
      sArr[pos] = typeof delay === 'number' ? delay : new Date() - startTime;

      if (sArr[pos] < 0) {
        sArr[pos] = new Date() - scriptStart;
      }

      wpo.speed.points = sArr;
    }

    clearTimeout(wpo.speed.timer);
    if (!_immediately) {
      wpo.speed.timer = setTimeout(sendSpeed, 3000);
    } else {
      sendSpeed();
    }
  };

  /**
   * [log 日志统计]
   * @param  {string} msg      [发送的内容]
   * @param  {number} sampling [可以自定义发送的抽样]
   * @return {void}
   */
  wpo.log = function (msg, sampling) {
    const param = {
      type: 'log',
      msg: encodeURIComponent(msg),
      usernick: encodeURIComponent(wpo.getNick())
    };

    send(param, sampling);
  };
};
