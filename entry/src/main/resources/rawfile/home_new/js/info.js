"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Array.prototype.flat || Object.defineProperty(Array.prototype, 'flat', {
  configurable: !0,
  value: function r() {
    var t = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
    return t ? Array.prototype.reduce.call(this, function (a, e) {
      return Array.isArray(e) ? a.push.apply(a, r.call(e, t - 1)) : a.push(e), a;
    }, []) : Array.prototype.slice.call(this);
  },
  writable: !0
}), Array.prototype.flatMap || Object.defineProperty(Array.prototype, 'flatMap', {
  configurable: !0,
  value: function value(r) {
    return Array.prototype.map.apply(this, arguments).flat();
  },
  writable: !0
}); // Polyfill for Promise.prototype.finally()

if (!Promise.prototype["finally"]) {
  Promise.prototype["finally"] = function (callback) {
    return this.then(function (value) {
      return Promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return Promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}
/**
 * 7 X 24 小时资讯
 */


function queryNews(page, size) {
  return infoRequest('/infoServer/clsInfo/queryNews', {
    current: page,
    size: size
  }).then(function (res) {
    var arr = [];
    res.data.records.forEach(function (record) {
      if (record.stocks) {
        arr = arr.concat(stockSplit(record.stocks));
      }
    });
    return Promise.all([getStockInfo(arr), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data.records.forEach(function (record) {
      record.stocks = stockInfoMap(stockInfo, stockSplit(record.stocks));
    });
    return newRes;
  });
}
/**
 * 投顾解盘
 */


function queryTgjp() {
  return infoRequest('/utilServer/api/homePage/fn300022', {
    activityState: '1,2,3,4',
    clientId: '($MobileCode)' || oVal.MOBILECODE,
    ReqlinkType: 2 //资讯通道

  }).then(function (res) {
    return res;
  });
}
/**
 * 热门观点列表
 */


function queryTggd() {
  return infoRequest('/utilServer/api/homePage/fn300010', {
    orderType: '2',
    clientId: '($MobileCode)' || oVal.MOBILECODE,
    ReqlinkType: 2 //资讯通道

  }).then(function (res) {
    return res;
  });
}
/**
 * 查询投顾组合收益率排行榜信息
 */


function queryTgts() {
  return infoRequest('/utilServer/api/homePage/fn300021TS', {
    curPage: 1,
    numPerPage: 10
  }).then(function (res) {
    return res;
  });
}
/**
 * 中卓中台配置查询
 */


function queryCoreRztInfoTypeList(page, size) {
  return infoRequest('/infoServer/clsInfo/queryCoreRztInfoTypeList', {
    crtitCodes: null
  }).then(function (res) {
    var arr = [];
    res.data.records.forEach(function (record) {
      if (record.stocks) {
        arr = arr.concat(stockSplit(record.stocks));
      }
    });
    return Promise.all([getStockInfo(arr), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data.records.forEach(function (record) {
      record.stocks = stockInfoMap(stockInfo, stockSplit(record.stocks));
    });
    return newRes;
  });
}
/**
 * 获取收评&&复盘 列表
 */


function queryAnalyMarketList(page, size) {
  return infoRequest('/infoServer/clsInfo/queryAnalyMarketList', {
    current: page,
    size: size
  }).then(function (res) {
    var arr = [];
    res.data.forEach(function (item) {
      arr = arr.concat(item.articles || []);
    }); // type 0: 复盘 1:收评

    var convert = function convert(obj) {
      var time = new Date(obj.ctime * 1000); // customType 收评:81155, 复盘:81225

      var customType = obj.customType == '81155' ? '1' : '0';
      return {
        type: customType,
        id: obj.id,
        date: time.format('yyyy-MM-dd'),
        title: obj.title,
        summary: obj.content && obj.content.trim().replace(/<[^>]+>/g, ''),
        time: time.format('hh:mm:ss')
      };
    };

    return arr.map(convert);
  });
}
/**
 * 获取今日关注数据
 */


function queryFocusOnToday() {
  return infoRequest('/infoServer/clsInfo/queryFocusOnToday').then(function (res) {
    var arr = [];
    res.data.forEach(function (item) {
      if (item.faucet) {
        arr = arr.concat(stockSplit(item.faucet.join(',')));
      }
    });
    return Promise.all([getStockInfo(arr), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data.forEach(function (item) {
      item.faucet = stockInfoMap(stockInfo, stockSplit(item.faucet.join(',')));
    });
    return newRes;
  });
}
/**
 * 获取首页今日关注数据
 */


function queryhome_newFocusOnToday() {
  return infoRequest('/infoServer/clsInfo/queryFocusOnToday').then(function (res) {
    res.data.forEach(function (item) {
      item.faucet = stockSplit(item.faucet.join(','));
    });
    return res;
  });
}
/**
 * 获取首页今日风口数据
 */


function queryhome_newTodayRise(date, isOutside) {
  return infoRequest('/infoServer/clsInfo/queryTodayRise', {
    day: date,
    isOutside: isOutside
  }).then(function (res) {
    res.data.forEach(function (item) {
      if (item.stockPool && item.stockPool.length) {
        item.stockPool = stockSplit(item.stockPool.map(function (val) {
          return val.stockCode;
        }).join(','));
      }
    });
    return res;
  });
}

function renderStockInfo(stockCodeList, clazz) {
  getStockInfo(stockCodeList).then(function (res) {
    $('.' + clazz).each(function () {
      var code = $(this).attr('data-id');
      var stock = res[code];

      if (stock) {
        var zdClass = '';

        if (stock.status === 'up') {
          zdClass = 'zf';
        }

        if (stock.status === 'down') {
          zdClass = 'df';
        }

        $(this).addClass(zdClass).find('.code').css('color', 'unset').attr('data-market', stock.market + '').attr('data-id', code + '').text(stock.stockName);
        $(this).show().find('.range').text(stock.signValue);
      }
    });
  });
}
/**
 * 获取今日风口数据
 */


function queryTodayRise(date, isOutside) {
  return infoRequest('/infoServer/clsInfo/queryTodayRise', {
    day: date,
    isOutside: isOutside
  }).then(function (res) {
    var arr = [];
    res.data.forEach(function (item) {
      if (item.stockPool && item.stockPool.length) {
        arr = arr.concat(stockSplit(item.stockPool.map(function (val) {
          return val.stockCode;
        }).join(',')));
      }
    });
    return Promise.all([getStockInfo(arr), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data.forEach(function (item) {
      item.stockPool.forEach(function (poolItem) {
        var matched = poolItem.stockCode.match(/\d{6}/);
        var code = matched[0];
        poolItem.stockInfo = stockInfo[code];
      });
    });
    return newRes;
  });
}
/**
 * 获取今日风口数据
 */


function queryTodayRiseOfFour() {
  return infoRequest('/infoServer/clsInfo/queryTodayRiseOfFour').then(function (res) {
    return Promise.all([getStockInfo(res.data.map(function (item) {
      return item.stockCode.getNumber();
    })), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data = newRes.data.map(function (item) {
      return Object.assign({}, item, stockInfo[item.stockCode.getNumber()]);
    });
    return newRes;
  });
}
/**
 * 获取市场解读8种数据
 */


function queryMarketInterpretList(list) {
  return infoRequest('/infoServer/clsInfo/queryMarketInterpretList', list);
}
/**
 * 中焯资讯类型列表
 */


function queryCoreTztInfoTypeList() {
  return infoRequest('/infoServer/clsInfo/queryCoreTztInfoTypeList', {
    crtitCodes: null
  });
}
/**
 * 盘前题材挖掘
 */


function queryInsightChanceList(categoryId, current, size) {
  return infoRequest('/infoServer/clsInfo/queryInsightChanceList', {
    categoryId: categoryId,
    current: current,
    size: size
  });
}
/**
 * 盘前题材挖掘&&明日主题前瞻 汇总前2条
 */


function queryInsightChanceCollectList() {
  return Promise.all([infoRequest('/infoServer/clsInfo/queryInsightChanceList', {
    categoryId: 1028,
    current: 1,
    size: 2
  }), infoRequest('/infoServer/clsInfo/queryInsightChanceList', {
    categoryId: 81157,
    current: 1,
    size: 2
  })]).then(function (res) {
    var result = res.map(function (item, type) {
      return item.data.records.sort(function (a, b) {
        return b.ctime - a.ctime;
      }).map(function (record, i) {
        record.typeName = type === 0 ? '题材' + (i + 1) : '主题' + (i + 1);
        return record;
      });
    }).flat().sort(function (a, b) {
      return b.ctime - a.ctime;
    }).slice(0, 2);
    var codeList = [];
    result.forEach(function (item) {
      item.stocks = item.stocks.split(',').slice(0, 2).map(function (stock) {
        return stock.getNumber();
      }).filter(function (item) {
        return item.trim();
      });
      codeList = codeList.concat(item.stocks);
    });
    return getStockInfo(codeList).then(function (res) {
      var _iterator = _createForOfIteratorHelper(result),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item.stocks = item.stocks.map(function (item) {
            return res[item];
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return result;
    });
  });
}
/**
 * 获取重大潜伏数据
 */


function querySignificantNews(page, size) {
  return infoRequest('/infoServer/clsInfo/querySignificantNews', {
    current: page,
    size: size
  }).then(function (res) {
    var arr = [];
    res.data.records.forEach(function (item) {
      if (item.stocks) {
        arr = arr.concat(stockSplit(item.stocks.join(',')));
      }
    });
    return Promise.all([getStockInfo(arr), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data.records.forEach(function (item) {
      item.stocks = stockInfoMap(stockInfo, stockSplit(item.stocks.join(',')));
    });
    return newRes;
  });
}
/**
 * 获取板块信息
 *
 * @param {string} plateId 板块id
 * @param {string} weight  0：全量 3：龙头股
 * @returns
 */


function queryNewsOfPlate(plateId, weight) {
  return infoRequest('/infoServer/clsInfo/queryNewsOfPlate', {
    plateId: plateId,
    weight: weight
  }).then(function (res) {
    var arr = [];

    if (res.data.stocks) {
      arr = stockSplit(res.data.stocks.map(function (val) {
        return val.stock;
      }).join(','));
    }

    return Promise.all([getStockInfo(arr), res]);
  }).then(function (res) {
    var stockInfo = res[0];
    var newRes = res[1];
    newRes.data.stocks.forEach(function (item) {
      var matched = item.stock.match(/\d{6}/);
      var code = matched[0];
      item.stockInfo = stockInfo[code];
    });
    return newRes;
  });
}
/**
 * 查询文章详情页
 */


function queryArticleDetail(articleId) {
  return infoRequest('/infoServer/clsInfo/queryArticleDetail', {
    articleId: articleId
  });
}
/**
 * 查询话题资讯
 */


function queryNewsOfSubject(plateId, page, size) {
  return infoRequest('/infoServer/clsInfo/queryNewsOfSubject', {
    plateId: plateId,
    current: page,
    size: size
  });
}
/**
 * 获取财联社资讯请求地址
 */


var HOST = '';

function getRequestHost() {
  if (HOST) {
    return Promise.resolve(HOST);
  }

  return new Promise(function (resolve, reject) {
    $.getData({
      oSendData: {
        ACTION: '46200',
        ReqlinkType: 2
      },
      isload: false,
      fnSuccess: function fnSuccess(res) {
        HOST = res.FUNDLINK;
        resolve(HOST);
      },
      oConfig: function oConfig(error) {
        reject(error);
      }
    });
  });
}

function infoRequest(url, body) {
  var requestId = nanoid(32);
  var timestamp = "".concat(Date.now());
 var params = filteObjectEmptyKey(body);
  var reqData = params ? JSON.stringify(params) : '';
  return getRequestHost().then(function (host) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: host + url,
        type: 'POST',
        headers: {
          'content-type': 'application/json',
          requestId: requestId,
          timestamp: timestamp,
          sign: CryptoJS.SHA1(reqData + timestamp + requestId)
        },
        data: reqData,
        contentType: 'application/json;',
        success: resolve,
        error: reject
      });
    });
  });
}
/*获取股票涨跌幅*/


function getStockInfo(codeArr) {
  return new Promise(function (resolve, reject) {
    if (!codeArr || !codeArr.length) {
      resolve({});
    }

    $.getData({
      oSendData: {
        Action: 60,
        grid: unique(codeArr).join(','),
        NewMarketNo: 1,
        ReqlinkType: 2,
        maxCount: codeArr.length + 1,
        AccountIndex: 0,
        StockIndex: 1
      },
      copyIsArray: false,
      isload: false,
      fnSuccess: function fnSuccess(data) {
        var stockInfo = {};
        var marketArr = data.NEWMARKETNO ? data.NEWMARKETNO.split('|').filter(function (val) {
          return val;
        }) : [];

        if (data.GRID0 && data.GRID0.length > 1) {
          data.GRID0.forEach(function (grid, index) {
            if (index === 0) {
              return;
            }

            var aGrid = grid.split('|');
            var unsignValue = aGrid[data.UPDOWNPINDEX],
                stockCode = aGrid[data.STOCKCODEINDEX];
            var signValue = unsignValue;
            var isUp = false;
            var status = 'normal';

            if (Number(unsignValue.replace('%', '')) > 0) {
              //判断股票是涨幅还是跌幅
              signValue = '+' + unsignValue;
              isUp = true;
              status = 'up';
            }

            if (Number(unsignValue.replace('%', '')) < 0) {
              status = 'down';
            }

            stockInfo[stockCode] = {
              stockCode: stockCode,
              signValue: signValue,
              unsignValue: unsignValue,
              isUp: isUp,
              status: status,
              market: marketArr[index - 1],
              newPrice: aGrid[data.NEWPRICEINDEX],
              stockName: aGrid[data.STOCKNAMEINDEX].replace(/\d+\./, ''),
              total: aGrid[data.TOTALMINDEX]
            };
          });
        }

        resolve(stockInfo);
      },
      oConfig: reject
    });
  });
}

function stockSplit(str) {
  var arr = [];

  if (str) {
    str.split(',').forEach(function (stock) {
      var matched = stock.match(/\d{6}/);

      if (matched && matched[0]) {
        arr.push(matched[0]);
      }
    });
  }

  return arr;
}

function stockInfoMap(stockInfo, stockList) {
  return stockList.map(function (stock) {
    if (stockInfo[stock]) {
      return stockInfo[stock];
    }
  }).filter(function (val) {
    return !!val;
  });
}

function unique(arr) {
  var array = [];

  for (var i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i]);
    }
  }

  return array;
}
/**
 * 加载script文件
 */


function loadScript(path) {
  return new Promise(function (resolve, reject) {
    var scriptEl = document.createElement('script');
    scriptEl.src = path;

    scriptEl.onload = function () {
      document.body.removeChild(scriptEl);
      resolve();
    };

    document.body.appendChild(scriptEl);
  });
}

Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    //月份
    'd+': this.getDate(),
    //日
    'h+': this.getHours(),
    //小时
    'm+': this.getMinutes(),
    //分
    's+': this.getSeconds(),
    //秒
    'q+': Math.floor((this.getMonth() + 3) / 3),
    //季度
    S: this.getMilliseconds() //毫秒

  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return fmt;
};
/**
 * 数据中为null 和 undefined的值
 */


function filteObjectEmptyKey(params) {
  if (_typeof(params) !== 'object' || !params) {
    return params;
  }

  var copy = JSON.parse(JSON.stringify(params));

  var filter = function filter(data) {
    if (_typeof(data) !== 'object' || !data) {
      return;
    }

    if (Array.isArray(data)) {
      data.forEach(function (item) {
        filter(item);
      });
      return;
    }

    Object.keys(data).forEach(function (key) {
      var val = data[key];

      if (val === undefined || val === null) {
        delete data[key];
        return;
      }

      filter(val);
    });
  };

  filter(copy);
  return copy;
}
/**
 * 生成UUID
 * @param {number} size 生成UUID的长度
 * @returns {string} uuid
 */


function nanoid(size) {
  if (!size) {
    size = 21;
  }

  var id = '';
  var bytes = crypto.getRandomValues(new Uint8Array(size));

  while (size--) {
    var _byte = bytes[size] & 63;

    if (_byte < 36) {
      id += _byte.toString(36);
    } else if (_byte < 62) {
      id += (_byte - 26).toString(36).toUpperCase();
    } else if (_byte < 63) {
      id += '_';
    } else {
      id += '-';
    }
  }

  return id;
}