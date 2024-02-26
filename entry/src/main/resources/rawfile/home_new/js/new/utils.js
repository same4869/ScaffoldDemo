"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function throttle(fn, interval) {
  var last;
  var timer;
  var interval = interval || 200;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();

    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  };
}
/**
 * 时间格式化
 */


function formatDate(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

  var Y = date.getFullYear(),
      M = date.getMonth() + 1 < 10 ? date.getMonth() + 1 : date.getMonth() + 1,
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds();
  M = M < 10 ? '0' + M : M;
  D = D < 10 ? '0' + D : D;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}
/**
 * 昨日今日判断返回
 * @param {*} date
 * @returns
 */


function formatDateDay(date) {
  var num = getDays(date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2));

  if (num == 0) {
    //今日
    return '今日 ' + date.substr(5, 5);
  } else if (num == 1) {
    //昨日
    return '昨日 ' + date.substr(5, 5);
  } else {
    return date.substr(5, 5);
  }
}

function getDays(data) {
  var date = data.toString();
  var year = date.substring(0, 4);
  var month = date.substring(4, 6);
  var day = date.substring(6, 8);
  var d1 = new Date(year + '/' + month + '/' + day);
  var dd = new Date();
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;
  var d = dd.getDate();
  var d2 = new Date(y + '/' + m + '/' + d);
  var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
  return iday;
}
/**
 * 时间文字化
 * @param {*} date
 * @returns
 */


function dateStr(date) {
  //console.log(date)
  var nowDate = new Date();
  var time = nowDate.getTime();
  var nowyear = nowDate.getFullYear();
  var year = date.substr(0, 4);
  var month = Number(date.substr(5, 2));
  var day = Number(date.substr(8, 2));
  var hour = Number(date.substr(11, 2));
  var minute = Number(date.substr(14, 2));
  var second = Number(date.substr(17, 2));
  var newDate = new Date(year, month - 1, day, hour, minute, second).getTime();
  time = parseInt((time - newDate) / 1000);
  var s;

  if (time < 60 * 5) {
    //五分钟内
    return '刚刚';
  } else if (time < 60 * 60 && time >= 60 * 5) {
    //超过十分钟少于1小时
    s = Math.floor(time / 60);
    return s + '分钟前';
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    //超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + '小时前';
  } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
    //超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24);
    return s + '天前';
  } else {
    //超过3天
    if (year == nowyear) {
      return date.substr(5, 5);
    } else {
      return date.split(' ')[0];
    }
  }
}

function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }

  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  var date;

  if (_typeof(time) === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }

    date = new Date(time);
  }

  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  var time_str = format.replace(/{([ymdhisaMD])+}/g, function (result, key) {
    var value = formatObj[key.toLowerCase()]; // Note: getDay() returns 0 on Sunday

    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }

    if (key === 'M') {
      return value.toString();
    }

    if (key === 'D') {
      return value.toString();
    }

    return value.toString().padStart(2, '0');
  });
  return time_str;
}
/**
 * 时间文字化
 * @param {*} date
 * @returns
 */


function dateStr1(date) {
  //console.log(date)
  var nowDate = new Date();
  var time = nowDate.getTime();
  var nowyear = nowDate.getFullYear();
  var year = date.substr(0, 4);
  var month = Number(date.substr(5, 2));
  var day = Number(date.substr(8, 2));
  var hour = Number(date.substr(11, 2));
  var minute = Number(date.substr(14, 2));
  var second = Number(date.substr(17, 2));
  var newDate = new Date(year, month - 1, day, hour, minute, second).getTime();
  time = parseInt((time - newDate) / 1000);
  var lastDate = new Date(new Date(new Date().format('yyyy-MM-dd')).getTime() - 60 * 60 * 24 * 1000).format('yyyy-MM-dd');
  var s;

  if (time < 60 * 5) {
    //五分钟内
    return '刚刚';
  } else if (time < 60 * 60 && time >= 60 * 5) {
    //超过十分钟少于1小时
    s = Math.floor(time / 60);
    return s + '分钟前';
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    //超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + '小时前';
  } else if (new Date(date).format('yyyy-MM-dd') == lastDate) {
    //昨天
    s = Math.floor(time / 60 / 60 / 24);
    return '昨天 ' + new Date(date).format('hh:mm');
  } else {
    //超过3天
    return new Date(date).format('MM-dd hh:mm');
  }
} // function dateStr1(date) {
//     //console.log(date)
//     var nowDate = new Date();
//     var time = nowDate.getTime();
//     var nowyear = nowDate.getFullYear();
//     var year = date.substr(0, 4);
//     var month = Number(date.substr(5, 2));
//     var day = Number(date.substr(8, 2));
//     var hour = Number(date.substr(11, 2));
//     var minute = Number(date.substr(14, 2));
//     var second = Number(date.substr(17, 2));
//     var newDate = new Date(year, month - 1, day, hour, minute, second).getTime();
//     time = parseInt((time - newDate) / 1000);
//     var lastDate = new Date(new Date(new Date().format('yyyy-MM-dd')).getTime() - 60 * 60 * 24 * 1000).format(
//         'yyyy-MM-dd'
//     );
//     var s;
//     console.log('time',time);
//     if (time < 60 * 5) {
//         //五分钟内
//         return '刚刚';
//     } else if (time < 60 * 60 && time >= 60 * 5) {
//         //超过十分钟少于1小时
//         s = Math.floor(time / 60);
//         return s + '分钟前';
//     } else if (new Date(date).format('yyyy-MM-dd') == lastDate) {
//         //超过1天少于2天内
//         s = Math.floor(time / 60 / 60 / 24);
//         return '昨天 ' + new Date(date).format('hh:mm');
//     } else {
//         //超过3天
//         return new Date(date).format('MM-dd hh:mm');
//     }
// }

/**
 * 数组分割
 * */


Array.prototype.chunk = function (len) {
  //将数组分割为以len个一组
  var len = parseInt(len);
  if (len <= 1 || this.length < len) return this;
  var groups = [],
      loop = Math.ceil(this.length / len);

  for (var i = 0; i < loop; i++) {
    groups.push(this.slice(len * i, len * (i + 1)));
  }

  return groups;
};
/**
 * 字符串中提取数值
 */


String.prototype.getNumber = function () {
  return (this || '').replace(/[^\d]/g, '');
};