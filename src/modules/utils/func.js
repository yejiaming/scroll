/**
 *
 * @authors liwb (you@example.org)
 * @date    2016/10/24 17:33
 * @version $ 工具类
 */

/* name module */

/**
 * 获取unix时间戳
 * @param time '20160126 12:00:00', '2016-01-26 12:00:00', '2016.01.26 12:00:00', '20160126', '2016-05-23 13:58:02.0'
 */
export function getUnixTimeStamp(time) {
  var result = '';

  if (typeof time !== 'string') return;

  if (time.length > 19) { // 2016-05-23 13:58:02.0
    time = time.substring(0, 19);
  }

  var unix_time;
  var pattern = /\-|\./g;

  if (pattern.test(time)) {
    unix_time = time.replace(pattern, '/');
  } else {
    var y, m, d;
    y = time.slice(0, 4);
    m = time.slice(4, 6);
    d = time.slice(6, 8);
    unix_time = y + '/' + m + '/' + d;
  }

  result = Math.round(Date.parse(unix_time));

  return result;

}

/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern('yyyy-MM-dd hh:mm:ss.S')==> 2006-07-02 08:09:04.423
 * (new Date()).pattern('yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern('yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern('yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern('yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 */
export function formatDate(date, fmt) {
  date = date == undefined ? new Date() : date;
  date = (typeof date == 'number' || typeof date == 'string') ? new Date(date) : date;
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  return fmt;
}

// 获取浏览器参数
export function getUrlParam(name) { // 'null' 会返回string
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r !== null) return decodeURIComponent(r[2]);
  return null; //返回参数值
}

export function getHttpParams(name) {
  var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)');
  var m = location.href.match(r);
  return decodeURIComponent(!m ? '' : m[2]);
}

//sessionstorage操作
export function setSessionStorageItem(item_key, item_value) {
  isSeesionStorageNameSupported() && sessionStorage.setItem(item_key, item_value);
}

export function getSessionStorageItem(item_key) {
  if (isSeesionStorageNameSupported()) {
    return sessionStorage.getItem(item_key);
  }
}

export function removeSessionStorageItem(item_key) {
  if (isSeesionStorageNameSupported()) {
    return sessionStorage.removeItem(item_key);
  }
}

export function clearSessionStorage() {
  isSeesionStorageNameSupported() && sessionStorage.clear();
}

function isSeesionStorageNameSupported() {
  var win = window,
    sessionStorageName = 'sessionStorage';

  try {
    return (sessionStorageName in win && win[sessionStorageName]);
  } catch (err) {
    return false;
  }
}

//localstore
export function setLocalStorageItem(item_key, item_value) {

  isLocalStorageNameSupported() && localStorage.setItem(item_key, item_value);
}

export function getLocalStorageItem(item_key) {
  if (isLocalStorageNameSupported()) {
    return localStorage.getItem(item_key);
  }
}

export function removeLocalStorageItem(item_key) {
  if (isLocalStorageNameSupported()) {
    return localStorage.removeItem(item_key);
  }
}

export function clearLoaclStorage() {
  isLocalStorageNameSupported() && localStorage.clear();
}

function isLocalStorageNameSupported() {
  var win = window,
    localStorageName = 'localStorage';

  try {
    return (localStorageName in win && win[localStorageName]);
  } catch (err) {
    return false;
  }
}

/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   禁止第一次调用，传入{leading: false}。
 *                                禁止最后一次调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
export function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

export function callback(data, success, fail) {
  if (data.error_no == '0') {
    (isFunction(success)) && success();
  } else {
    (isFunction(fail)) && fail();
  }
}

export function isMobile(str) {
  var reg = /^[1][34578]\d{9}$/;

  return reg.test(str);
}

//5-25字符。包含英文、数字
export function isAccount(str) {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,25}$/;

  return reg.test(str);
}

export function isPassword(str) {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;

  return reg.test(str);
}

//身份证号
export function isCardId(str) {
  var reg = /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/;

  return reg.test(str);
}

export function imageFilter(type) {

  return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
}

export function loggedIn() {
  return getLocalStorageItem('access_token') ? true : false;
}

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}
