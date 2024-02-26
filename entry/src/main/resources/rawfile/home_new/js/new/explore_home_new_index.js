"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//开启定时器
T.fn.changeurl('http://action:10077/?');




T.readLocalMesg(['hfFontType'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
  const typeVersions =oLocal.HFFONTTYPE;
 

    if (typeVersions != null) {
      const typeVersionname = typeVersions === "1" ? "old" : "";
      // _store.commit('updateOlderVersion', typeVersionname)
      window.document.documentElement.setAttribute(
        "data-typeversion",
        typeVersionname
      );
    }
  
  });
$(function () {
 

   
  if (location.href.indexOf('#reloaded') == -1) {
 
    location.href = location.href + '#reloaded';
    sa.track('pageview', {
      business_module: '业务类',
      first_module: '探索',
      second_module: '首页',
      third_module: '首页',
      page_name: '首页'
    });
  }
});




function RefreshStock() {
 
  this.codeList = [];

  this.api = function () {
    var _this = this;

    if (this.codeList.length > 0) {
      getStockInfo(this.codeList).then(function (res) {
        _this.render(res);
      });
    }
  };

  this.render = function (result) {
    $('.stock-target').each(function () {
      var code = result[$(this).attr('data-code')];

      if (code) {
        $(this).children('.stock-name').html(code.stockName);
        $(this).children('.rate').html(code.signValue);
      }
    });
  };

  this.timer = null;
}
function errorImg(img) {
  var retry = parseInt($(img).attr('retry')) || 0;
  if (retry < 3) {
      var sourceSrc = img.src;
      img.src = null;
      img.src = sourceSrc;
      $(img).attr('retry', retry + 1);
  } else {
  }
}

RefreshStock.prototype.push = function (code) {
  this.codeList.push(code);
};

RefreshStock.prototype.concat = function (codeList) {
  this.codeList = this.codeList.concat(codeList);
};

var refreshStock = new RefreshStock();
T.readLocalMesg(['MOBILECODE'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
});
var readId = [];

function tgFunc(url) {
  T.readLocalMesg(['jyloginflag', 'logintype=1', 'MOBILECODE', 'usercode'], function (oLocal) {
    var MOBILECODE = oLocal.MOBILECODE;
    var USERCODE = oLocal.USERCODE;

    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      //console.log(url);
      T.fn.action10061({
        url: url,
        tzthiddentitle: '1',
        tztadjustnever: '1'
      });
    } else {
      if (oLocal.JYLOGINFLAG <= 1) {
        //未登录
        var oSend = {
          action: '5',
          needToken: '0'
        };
        $.getData({
          oSendData: oSend,
          isToken: false,
          fnSuccess: function fnSuccess(oTime) {
            var serverTime = oTime.TIME;
            var oSend = {
              action: '46200',
              ReqlinkType: 2
            };
            $.getData({
              oSendData: oSend,
              isload: false,
              fnSuccess: function fnSuccess(oData) {
                var PUBLICK_KEY = oData.TG,
                    MD5_KEY = oData.HSSTRING;
                var str = JSON.stringify({
                  mobile: MOBILECODE,
                  from: 'sidi',
                  time: serverTime
                }); //处理rsa和md5key

                var senddata = encryptRsaTg(PUBLICK_KEY, MD5_KEY, str);
                var oUrl = url + '&data=' + encodeURIComponent(senddata.data);

                if (T.appversion.andriod()) {
                  T.fn.action10061({
                    url: url + '&data=' + encodeURIComponent(encodeURIComponent(senddata.data)),
                    tzthiddentitle: '1',
                    tztadjustnever: '1'
                  });
                } else {
                  T.fn.action10061({
                    url: oUrl,
                    tzthiddentitle: '1',
                    tztadjustnever: '1'
                  });
                }
              }
            });
          }
        });
      } else {
        var oSend = {
          action: '5',
          needToken: '0'
        };
        $.getData({
          oSendData: oSend,
          isToken: false,
          fnSuccess: function fnSuccess(oTime) {
            var serverTime = oTime.TIME;

            if (oLocal.JYLOGINFLAG <= 1) {
              //未登录
              T.fn.action10061({
                url: url,
                tzthiddentitle: '1',
                tztadjustnever: '1'
              });
            } else {
              var oSendData = {
                action: 6771,
                ReqlinkType: '1'
              };
              $.getData({
                oSendData: oSendData,
                fnSuccess: function fnSuccess(reg) {
                  var SERVTICKET_ID = reg.SERVTICKET_ID;
                  var oSend = {
                    action: '46200',
                    ReqlinkType: 2
                  };
                  $.getData({
                    oSendData: oSend,
                    isload: false,
                    fnSuccess: function fnSuccess(oData) {
                      var PUBLICK_KEY = oData.TG,
                          MD5_KEY = oData.HSSTRING;
                      var str = JSON.stringify({
                        token: SERVTICKET_ID,
                        mobile: MOBILECODE,
                        client_id: USERCODE,
                        from: 'sidi',
                        time: serverTime
                      }); //处理rsa和md5key

                      var senddata = encryptRsaTg(PUBLICK_KEY, MD5_KEY, str);
                      var oUrl = url + '&data=' + senddata.data;

                      if (T.appversion.andriod()) {
                        T.fn.action10061({
                          url: url + '&data=' + encodeURIComponent(encodeURIComponent(senddata.data)),
                          tzthiddentitle: '1',
                          tztadjustnever: '1'
                        });
                      } else {
                        T.fn.action10061({
                          url: oUrl,
                          tzthiddentitle: '1',
                          tztadjustnever: '1'
                        });
                      }
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
} //直播跳转复制


function zbTgFunc(url) {
  T.readLocalMesg(['jyloginflag', 'logintype=1', 'MOBILECODE', 'usercode'], function (oLocal) {
    var MOBILECODE = oLocal.MOBILECODE;
    var USERCODE = oLocal.USERCODE;

    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      //console.log(url);
      T.fn.action10061({
        url: url,
        tzthiddentitle: '1',
        tztadjustnever: '1'
      });
    } else {
      if (oLocal.JYLOGINFLAG <= 1) {
        //未登录
        var oSend = {
          action: '5',
          needToken: '0'
        };
        $.getData({
          oSendData: oSend,
          isToken: false,
          fnSuccess: function fnSuccess(oTime) {
            var serverTime = oTime.TIME;
            var oSend = {
              action: '46200',
              ReqlinkType: 2
            };
            $.getData({
              oSendData: oSend,
              isload: false,
              fnSuccess: function fnSuccess(oData) {
                var PUBLICK_KEY = oData.TG,
                    MD5_KEY = oData.HSSTRING;
                var str = JSON.stringify({
                  mobile: MOBILECODE,
                  from: 'sidi',
                  time: serverTime
                }); //处理rsa和md5key

                var senddata = encryptRsaTg(PUBLICK_KEY, MD5_KEY, str);
                var oUrl = url + '&data=' + encodeURIComponent(senddata.data);

                if (T.appversion.andriod()) {
                  T.fn.action10061({
                    url: url + '&data=' + encodeURIComponent(encodeURIComponent(senddata.data)),
                    tzthiddentitle: '1',
                    tztadjustnever: '1'
                  });
                } else {
                  T.fn.action10061({
                    url: oUrl,
                    tzthiddentitle: '1',
                    tztadjustnever: '1'
                  });
                }
              }
            });
          }
        });
      } else {
        var oSend = {
          action: '5',
          needToken: '0'
        };
        $.getData({
          oSendData: oSend,
          isToken: false,
          fnSuccess: function fnSuccess(oTime) {
            var serverTime = oTime.TIME;

            if (oLocal.JYLOGINFLAG <= 1) {
              //未登录
              T.fn.action10061({
                url: url,
                tzthiddentitle: '1',
                tztadjustnever: '1'
              });
            } else {
              var oSendData = {
                action: 6771,
                ReqlinkType: '1'
              };
              $.getData({
                oSendData: oSendData,
                fnSuccess: function fnSuccess(reg) {
                  var SERVTICKET_ID = reg.SERVTICKET_ID;
                  var oSend = {
                    action: '46200',
                    ReqlinkType: 2
                  };
                  $.getData({
                    oSendData: oSend,
                    isload: false,
                    fnSuccess: function fnSuccess(oData) {
                      var PUBLICK_KEY = oData.TG,
                          MD5_KEY = oData.HSSTRING;
                      var str = JSON.stringify({
                        token: SERVTICKET_ID,
                        mobile: MOBILECODE,
                        client_id: USERCODE,
                        from: 'sidi',
                        time: serverTime
                      }); //处理rsa和md5key

                      var senddata = encryptRsaTg(PUBLICK_KEY, MD5_KEY, str);
                      var oUrl = url + '&data=' + senddata.data;

                      if (T.appversion.andriod()) {
                        T.fn.action10061({
                          url: url + '&data=' + encodeURIComponent(encodeURIComponent(senddata.data)),
                          tzthiddentitle: '1',
                          tztadjustnever: '1'
                        });
                      } else {
                        T.fn.action10061({
                          url: oUrl,
                          tzthiddentitle: '1',
                          tztadjustnever: '1'
                        });
                      }
                    }
                  });
                }
              });
            }
          }
        });
      }
    }
  });
}

var myMixin = {
  methods: {
    //跳转个股行情页
    openStockPage: function openStockPage(stockcode, stocktype, item, num, it) {
      console.log('item', stockcode, stocktype, item, it);

      if (num == '0') {
        sa.track('sy_kx_kxnr_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          interact_type: '关联个股',
          page_name: '首页',
          zt_code: '',
          zt_name: '',
          product_code: stockcode,
          product_name: item
        });
      } else if (num == '2') {
        sa.track('sy_fkbk_glgp_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          interact_type: '关联个股',
          page_name: '首页',
          zt_code: '',
          zt_name: '',
          product_code: stockcode,
          product_name: item
        });
      } else if (num == '3') {
        sa.track('sy_dzjd_gpxq_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          page_name: '首页',
          product_code: stockcode,
          product_name: item
        });
      }
      else if (num == '5') {
        sa.track('sy_tcwj_glgp_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          page_name: '首页',
          product_code: stockcode,
          product_name: item
        });
      }

      T.stopBubble();
      onJsOverrideUrlLoading('http://action:12051/?stockcode=' + stockcode + '&&stocktype=' + stocktype);
    },
    //风口板块详情
    openPlatePage: function openPlatePage(id, name, num) {
      console.log('item', id, name);
      T.stopBubble();

      if (num == '0') {
        sa.track('sy_kx_kxnr_click', _defineProperty({
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          interact_type: '关联主题',
          page_name: '首页',
          zt_code: id,
          zt_name: name,
          product_code: '',
          product_name: ''
        }, "zt_name", name));
      } else {
        sa.track('sy_fkbk_bkxq_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          page_name: '首页',
          zt_code: id,
          zt_name: name
        });
      }

      var obj = {
        url: '/hq/zt_xq.html?id=' + id + ''
      };
      var oSend = {
        url: obj.url
      };
      TZT.fn.action10061(oSend);
    }
  }
};
var Component = Vue.extend({
  mixins: [myMixin]
});

function kxDate(data) {
  //快讯分享时间转换
  var date = data.toString().split(' '); // var day = date[0].substring(5).replace('-', '-') + '-';

  var day = date[0];
  var time = date[1].substring(0, 5);
  return day + ' ' + time;
}

var kxTgjpApp = new Component({
  el: '#kx-tgjp-app',
  data: {
    vueInit: false,
    kxLoading: true,
    swiperTgjp: null,
    kx: {
      content: '',
      time: '',
      date: '',
      stocks: [],
      plates: [],
      isTradeDate: true
    },
    tgjpLoading: true,
    tgjpList: [],
    zbList: [],
    rdzxList: [],
    typeVersion:''
  },
  mounted: function mounted() {
    this.vueInit = true;
  },
  methods: {
    parseTime: parseTime,
    init: function init(hasLoading=true) {
      var that = this;
      T.readLocalMesg(['hfFontType'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
        that.typeVersion=oLocal.HFFONTTYPE;
  
     
        });
      if(hasLoading){
        that.kxLoading = true;
      }
      queryNews(1, 10).then(function (res) {
        var record = res.data.records[0];
        console.log('快讯最近10条列表', res.data.records.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            time: new Date(item.ctime * 1000).format('yyyy-MM-dd hh:mm:ss')
          });
        }));
        that.kx.content = record.content;
        var createTime = new Date(record.ctime * 1000);
        that.kx.time = createTime.format('hh:mm');
        console.log('  that.kx.time', that.kx.time);
        that.kx.date = createTime.format('MM-dd');
        that.kx.ctime = record.ctime;
        console.log('record.stock', record.stocks, record);
        that.kx.stocks = record.stocks.slice(0, 1);
        console.log(' that.kx.stocks', that.kx.stocks);
        refreshStock.concat(that.kx.stocks.map(function (item) {
          return item.stockCode;
        }));
        that.kx.plates = record.plates.slice(0, 1);
        var oSend = {
          action: 41083,
          date: new Date(res.timestamp).format('yyyyMMdd')
        };
        $.getData({
          oSendData: oSend,
          isload: false,
          fnSuccess: function fnSuccess(oData) {
            that.kx.isTradeDate = oData.IS_TRADE_DATE === '1';
            that.kxLoading = false;
          }
        });
      });
      if(hasLoading){
        that.tgjpLoading = true;
      }
      Promise.all([this.getTgjpData(), this.getZbData(), this.getRdzxData()]).then()["finally"](function () {
        that.tgjpLoading = false;

        if (that.swiperTgjp) {
          that.swiperTgjp.destroy(false);
        }

        that.$nextTick(function () {
          //判断是否滑动，如果只有一条数据就不滚动
          var hdType = 3000;
          var hdloop = true;

          if (that.tgjpList.length > 0 && that.zbList.length > 0 || that.tgjpList.length > 0 && that.rdzxList.length > 0 || that.zbList.length > 0 && that.rdzxList.length > 0) {
            hdType = 3000;
            hdloop = true;
          } else {
            hdType = false;
            hdloop = false;
          }

          that.swiperTgjp = new Swiper('#swiper-container-tgjp', {
            autoplayDisableOnInteraction: false,
            //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            observer: true,
            //图片加载失败会删除元素，需要更新swiper
            observerParents: true,
            // autoplay: false,
            spaceBetween: 1,
            autoplay: hdType,
            loop: hdloop,
            pagination: '.swiper-pagination',
            onTap: function onTap(swiper, event) {
              var type = $(swiper.clickedSlide).attr('data-type');

              if (type == '1') {
                that.openTgjpPage(that.tgjpList[0]);
                return;
              }

              if (type == '2') {
                that.openZbPage(that.zbList[0]);
                return;
              }

              if (type == '3') {
                that.openOtherPage(that.rdzxList[0]);
                return;
              }
            }
          });
        });
      });
    },
    getTgjpData: function getTgjpData() {
      var that = this;
      return new Promise(function (resolve, reject) {
        // var params = {
        //     // clientId: '023008037400','($MobileCode)'
        //     clientId: '($MobileCode)' ||oVal.MOBILECODE ,
        //     orderType: '2',
        //     curPage: 1,
        //     numPerPage: 1,
        // };
        // var oSend = {
        //     param: JSON.stringify(params),
        //     method: 'get',
        //     ReqlinkType: 2, //资讯通道
        // };
        queryTgjp().then(function (res) {
          console.log('data,ss', res && res.data, res.data.map.list);

          var compare = function compare(attr, rev) {
            rev = rev || typeof rev === 'undefined' ? 1 : -1;
            return function (a, b) {
              a = a[attr];
              b = b[attr];

              if (a < b) {
                return rev * -1;
              }

              if (a > b) {
                return rev * 1;
              }

              return 0;
            };
          };

          if (res.data.map.list.length > 0) {
            var oData = res.data.map.list;
            console.log('oData', oData);
            oData = oData.sort(compare('examTime', false)); // 降序

            for (var i = 0; i < oData.length; i++) {
              oData[i].zbUserImg = oVal.tgJumpId + oData[i].zbUserImg;
            }

            that.tgjpList = [];
            that.tgjpList.push(oData[0]);
            console.log(oData, that.tgjpList, '投顾解盘');
            resolve();
          }
        }); // $.getData({
        //     oSendData: {
        //         action: 48012,
        //         method: 'post',
        //         path: '/redirect',
        //         activityState: '1,2,3,4',
        //         targetPath: '/utilServer/api/homePage/fn300022',
        //         pageNumber: 1,
        //         clientId: '($MobileCode)' || oVal.MOBILECODE,
        //         // pageSize: 1,
        //         ReqlinkType: 2, //资讯通道
        //     },
        //     isload:false,
        //     fnSuccess: function (data) {
        //      console.log('dat222a',data);
        //      const compare = (attr, rev) => {
        //         rev = rev || typeof rev === 'undefined' ? 1 : -1;
        //         return (a, b) => {
        //             a = a[attr];
        //             b = b[attr];
        //             if (a < b) {
        //                 return rev * -1;
        //             }
        //             if (a > b) {
        //                 return rev * 1;
        //             }
        //             return 0;
        //         };
        //     };
        //     if (data && data.DATA) {
        //         var oData = $.parseJSON(data.DATA).map.list;
        //         oData = oData.sort(compare('examTime', false)); // 降序
        //         for (var i = 0; i < oData.length; i++) {
        //             oData[i].zbUserImg = oVal.tgJumpId + oData[i].zbUserImg;
        //         }
        //         that.tgjpList = [];
        //         that.tgjpList.push(oData[0]);
        //         console.log(oData, that.tgjpList, '投顾解盘');
        //         resolve();
        //     }
        //     },
        //     oConfig: function (error) {
        //         console.log(error);
        //         reject();
        //     },
        // });
      });
    },
    //直播数据
    getZbData: function getZbData() {
      var that = this;
      return new Promise(function (resolve, reject) {
        $.getData({
          oSendData: {
            action: 48012,
            method: 'post',
            path: '/redirect',
            targetPath: '/utilServer/innerApi/HJLive/getLiveListTop3',
            pageNumber: 1,
            // pageSize: 1,
            ReqlinkType: 2 //资讯通道

          },
          isload: false,
          fnSuccess: function fnSuccess(data) {
            if (data && data.DATA) {
              var oData = $.parseJSON(data.DATA).content.slice(0, 1);
              that.zbList = oData;
              console.log(' that.zbList', that.zbList);
              resolve();
            }
          },
          oConfig: function oConfig(error) {
            reject(error);
          }
        });
      });
    },
    getRdzxData: function getRdzxData() {
      var that = this;
      return new Promise(function (resolve, reject) {
        var oSend = {
          action: 47100,
          Type: 66667,
          //热点资讯
          bigType: 'ZX',
          ReqlinkType: 2,
          pageNum: 1,
          pageSize: 1
        };
        $.getData({
          oSendData: oSend,
          isload: false,
          fnSuccess: function fnSuccess(data) {
            console.log(data, '热点资讯');
            var aGrid = data.GRID0;
            var ln = aGrid.length;

            if (ln) {
              var result = [];

              for (var i = 1; i < ln; i++) {
                var aData = aGrid[i].split('|');
                var commonObj = {
                  id: aData[data['ID_INDEX']],
                  date: aData[data['PUBLISHDATE_INDEX']],
                  title: aData[data['TITLE_INDEX']],
                  summary: aData[data['CRTAI_SUMMARY_INDEX']],
                  time: aData[data['PUBLISHDATE_INDEX']],
                  isjump: aData[data['ISJUMP_INDEX']],
                  jumplink: aData[data['JUMPLINK_INDEX']]
                };
                result.push(commonObj);
              }

              that.rdzxList = result;
              resolve();
            }
          },
          oConfig: function oConfig(error) {
            reject(error);
          }
        });
      });
    },
    handleShare: function handleShare() {
      sa.track('sy_kx_kxnr_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        interact_type: '分享',
        page_name: '首页',
        zt_code: '',
        zt_name: '',
        product_code: '',
        product_name: ''
      });
      var createTime = new Date(this.kx.ctime * 1000);
      var share_time = kxDate(createTime.format('yyyy-MM-dd hh:mm:ss'));
      $('.captime').html(share_time);
      $('.capcentertitle').html('');
      $('.capcenter .capcontent').html(this.kx.content);
      html2canvas(document.querySelector('#capture')).then(function (canvas) {
        var imgUri = canvas.toDataURL('image/png', 1); // 获取生成的图片的url

        var contentImg = imgUri.split('base64,')[1];
        console.log('contentImg', contentImg);
        T.fn.changeurl('http://action:10055/?contenttype=1&&image=' + encodeURIComponent(contentImg));
      });
    },
    openKxPage: function openKxPage() {
      var oSend = {
        url: '/zxxqkx/index.html'
      };
      oSend.tzthiddentitle = '1';
      oSend.tztadjustnever = '1';
      oSend.statusBarDark = '1';
      oSend.fullscreen = '1';
      T.fn.action10061(oSend);
      sa.track('sy_kx_kxnr_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        interact_type: '快讯详情',
        page_name: '首页',
        zt_code: '',
        zt_name: '',
        product_code: '',
        product_name: ''
      });
    },
    //投顾解盘卡片跳转
    openTgjpPage: function openTgjpPage(item) {
      console.log('2itrmew', item);

      if (item.activityState == '1' || item.activityState == '2') {
        var url = oVal.configData.TGLINK + '/m/app/#/liveSubscribePage?activity_id=' + item.activityId + '&source_id=hzzz&&fullscreen=1';
      } else {
        var url = oVal.configData.TGLINK + '/m/app/#/liveRoom?activity_id=' + item.activityId + '&source_id=hzzz&&fullscreen=1';
      }

      tgFunc(url);
      sa.track('sy_lbkw_lbnr_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        column_name: '投顾解盘',
        zb_id: item.activityId,
        zb_name: item.activityName,
        zb_state: item.activityState === 1 ? '回放' : '预约'
      });
    },
    //跳转直播页面
    openZbPage: function openZbPage(item) {
      var statusName = ['预约', '直播中', '回放'];
      var status = item.status;
      var h5Url = item.h5Url;

      if (oVal.configData) {
        //直播更多字段ZBZQMORE
        if (oVal.configData.ZBZQMORE) {
          console.log('oVal.configData', oVal.configData); // 首页栏位点击-股票组合
          // pageSensors.reportClick('mainPageColumnClick', {
          //     column_type: '直播专区',
          //     column_name: '直播专区-更多',
          //     column_no: '',
          // });

          sa.track('sy_lbkw_lbnr_click', {
            business_module: '业务类',
            first_module: '探索',
            second_module: '首页',
            third_module: '首页',
            column_name: '直播',
            page_name: '首页',
            zb_id: item.roomId,
            zb_name: item.title,
            zb_state: statusName[status]
          });
          T.fn.action10061({
            url: h5Url
          });
        }
      }
    },
    //跳转对应链接
    openOtherPage: function openOtherPage(item) {
      T.stopBubble();
      console.log('item', item);
      sa.track('sy_lbkw_lbnr_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        column_name: '热点资讯',
        page_name: '首页'
      });

      if (item.isjump === '1') {
        var oSend = {
          url: item.jumplink
        };
        T.fn.action10061(oSend);
      } else {
        var obj = {
          url: '/zx2/zx_zxxq.html?id=' + item.id + '&&type=huafu'
        };
        T.fn.action10061(obj);
      }
    }
  }
});
var djjdApp = new Component({
  el: '#djjd-app',
  data: {
    typeVersion:'',
    vueInit: false,
    loading: true,
    noLogin: false,
    checked: -1,
    tabName: "",
    scjdList: [],
    audioData: {},
    tabsList: [],
    other: {},

  },
  mounted: function mounted() {
    this.vueInit = true;
    this.init();
  },
  methods: {
    init: function init() {
      var _this2 = this;
      T.readLocalMesg(['hfFontType'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
        _this2.typeVersion=oLocal.HFFONTTYPE;
  
     
        });

      this.loading = true;
      queryCoreTztInfoTypeList().then(function (res) {
     
        _this2.tabsList = res.data.filter(function (item) {
          return [10, 11].includes(item.crtitCode);
        });
        _this2.other = _this2.tabsList.reduce(function (prev, current) {
          prev[current.crtitCode] = {
            list: []
          };
          return prev;
        }, Object.create(null));
        Promise.all(_this2.tabsList.map(function (item) {
          return _this2.getOtherData(item.crtitCode);
        })).then(function (res) {
          _this2.other = res.reduce(function (prev, current) {
            prev[current[0]] = {
              list: current[1]
            };
            return prev;
          }, Object.create(null));
        });
      });
      Promise.all([this.getScjdData()]).then(function (res) {
        _this2.loading = false;

        _this2.$nextTick(function () {
          Object.keys(_this2.audioData).forEach(function (item) {
            var audioDom = document.getElementById('audio-' + item);
            var throttleFunc = throttle(function () {
              var time = audioDom.currentTime;
              _this2.audioData[item].now = Math.floor(time / 60).toString().padStart(2, 0) + ':' + Math.floor(time % 60).toString().padStart(2, 0);
              _this2.audioData[item].rate = (audioDom.currentTime / audioDom.duration * 100).toFixed(2);

              if (parseFloat(_this2.audioData[item].rate) >= 100) {
                _this2.audioData[item].rate = 0;
                _this2.audioData[item].now = '00:00';

                _this2.handlePause(item);
              }
            }, 500);

            if (audioDom) {
              audioDom.addEventListener('timeupdate', function () {
                throttleFunc();
              });
              audioDom.addEventListener('pause', function () {
                console.log('pause');
                _this2.audioData[item].isPlay = false;
                _this2.audioData = Object.assign({}, _this2.audioData);
              });
              audioDom.addEventListener('play', function () {
                console.log('play');
                _this2.audioData[item].isPlay = true;
                _this2.audioData = Object.assign({}, _this2.audioData);
              });
            }
          });
        });
      });
    },
    getScjdData: function getScjdData() {
      var that = this;
      return queryMarketInterpretList({
        dayCount: 'null'
      }).then(function (res) {
        that.scjdList = res.data.map(function (item) {
          console.log('item', item);

          switch (item.categoryId) {
            case 81207:
              item.icon = 'yszb';
              item.cardTitle = '有声早报';
              that.audioData[item.articleId] = {
                isPlay: false,
                now: '00:00',
                nowTime: 0,
                time: 0,
                rate: 0
              };
              break;

            case 1555:
              item.icon = 'wjgg';
              item.cardTitle = '午间公告';
              var stock = item.stocks.split(',')[0].getNumber();
              refreshStock.push(stock);
              getStockInfo([stock]).then(function (res) {
                item.stocks = res[stock];
              });
              break;

            case 81155:
              item.icon = 'sp';
              item.cardTitle = '收评';
              break;

            case 81158:
              item.icon = 'jdfp';
              item.cardTitle = '焦点复盘';
              break;

            case 81225:
              item.icon = 'sjkp';
              item.cardTitle = '数据看盘';
              break;

            case 81152:
              item.icon = 'phggjj';
              item.cardTitle = '盘后公告集锦';
              break;

            case 1:
              item.icon = 'zc';
              item.cardTitle = '早参';
              break;

            case 8:
              item.icon = 'wc';
              item.cardTitle = '晚参';
              break;
          }

          var createTime = new Date(item.ctime * 1000);
          var share_time = new Date().format('yyyy-MM-dd') == createTime.format('yyyy-MM-dd') ? createTime.format('hh:mm') : kxDate(createTime.format('MM-dd hh:mm:ss'));
          console.log('share_time', share_time);
          item.time = share_time;
          item.content = (item.content || '').replace(/<[^>]+>/g, ''); // console.log(' item.content', item);

          return item;
        });
      });
    },
    getOtherData: function getOtherData(code) {
      return new Promise(function (resolve, reject) {
        var oSend = {
          action: 47100,
          Type: code,
          bigType: 'ZX',
          ReqlinkType: 2,
          pageNum: 1,
          pageSize: 2
        };
        $.getData({
          oSendData: oSend,
          isload: false,
          fnSuccess: function fnSuccess(data) {
            var aGrid = data.GRID0;
            var ln = aGrid.length;

            if (ln) {
              var result = [];

              for (var i = 1; i < ln; i++) {
                var aData = aGrid[i].split('|');

                var commonObj = _defineProperty({
                  id: aData[data['ID_INDEX']],
                  date: aData[data['PUBLISHDATE_INDEX']],
                  title: aData[data['TITLE_INDEX']],
                  summary: aData[data['CRTAI_SUMMARY_INDEX']],
                  time: aData[data['PUBLISHDATE_INDEX']],
                  isjump: aData[data['ISJUMP_INDEX']],
                  jumplink: aData[data['JUMPLINK_INDEX']]
                }, "summary", aData[data['CRTAI_SUMMARY_INDEX']]);

                result.push(commonObj);
              }

              resolve([code, result]);
            }

            reject();
          }
        });
      });
    },
    handleTabChange: function handleTabChange(value) {
      var tab = this.tabsList.find(function (item) {
        return item.crtitCode === value;
      });
      this.tabName = tab && tab.crtitName || '市场解读';
      sa.track('sy_djjd_tab_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        tab_name: this.tabName
      });
      this.checked = value;
    },
    handlePause: function handlePause(id) {
      sa.track('sy_yszb_bfqcz_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        interact_type: '暂停',
        page_name: '首页'
      });
      var audioDom = document.getElementById('audio-' + id);
      audioDom.pause(); // this.audioData[id].isPlay = false;
      // this.audioData = Object.assign({}, this.audioData);
    },
    handlePlay: function handlePlay(id) {
      sa.track('sy_yszb_bfqcz_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        interact_type: '开始',
        page_name: '首页'
      });
      var audioDom = document.getElementById('audio-' + id);
      audioDom.play(); // this.audioData[id].isPlay = true;
      // this.audioData = Object.assign({}, this.audioData);
    },
    openAccountPage: function openAccountPage() {
      sa.track('sy_khtg_ljkh_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      T.fn.changeurl('http://action:10048/?');
    },
    //跳转独家解读gup
    openStockPage_gp: function openStockPage_gp(stockcode, stocktype, item) {
    

      sa.track('sy_djjd_glgp_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        interact_type: '关联个股',
        page_name: '首页',
        tab_name: '市场解读',
        news_column: '',
        product_code: stockcode,
        product_name: item
      });
 
      T.stopBubble();
      onJsOverrideUrlLoading('http://action:12051/?stockcode=' + stockcode + '&&stocktype=' + stocktype);
    },
    //跳转独家解读二级页
    openDjjdPage: function openDjjdPage(type, num) {
      var _this3 = this;

      T.stopBubble('this.checked', this.checked);
      var tab = this.tabsList.find(function (item) {
        return item.crtitCode === _this3.checked;
      });
      this.tabName = tab && tab.crtitName || '市场解读';

      if (num == 2) {
        sa.track('sy_djjd_gdscjd_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          page_name: '首页'
        });
      } else {
        sa.track('sy_djjd_gd_click', {
          business_module: '业务类',
          first_module: '探索',
          second_module: '首页',
          third_module: '首页',
          page_name: '首页',
          tab_name: this.tabName
        });
      }

      var obj = {};
      obj.type = '1';
      obj.url = '/djjd/index.html' + (type ? '?type=' + type : '');
      obj.tzthiddentitle = '1';
      obj.tztadjustnever = '1';
      obj.statusBarDark = '1';
      obj.fullscreen = '1';
      T.fn.action10061(obj);
    },
    //跳转资讯详情页
    openTcwjDetailPage: function openTcwjDetailPage(id, item) {
      var _this4 = this;

      var tab = this.tabsList.find(function (item) {
        return item.crtitCode === _this4.checked;
      });
      this.tabName = tab && tab.crtitName || '市场解读';
      sa.track('sy_djjd_nrxq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        tab_name: this.tabName,
        page_name: '首页',
        news_column: item.cardTitle
      });

      if (item.icon == 'zc' || item.icon == 'wc') {
        if (item.jumpLink && item.jumpLink != null) {
          var obj = {
            url: item.jumpLink
          };
        } else {
          var obj = {
            url: '/zx2/zx_zxxq.html?id=' + id + '&&type=huafu'
          };
        }
      } else {
        var obj = {
          url: '/zx2/zx_zxxq.html?id=' + id + '&&menu_id=001' + '&&type=clszx'
        };
      }

      var oSend = {
        url: obj.url
      };
      oSend.secondtype = '98';
      oSend.secondtext = 'tzt_zx.png';
      oSend.secondjsfuncname = 'tztPageSecodeFun()';
      T.fn.action10061(oSend);
    },
    //跳转对应链接
    openOtherPage: function openOtherPage(item) {
      var _this5 = this;

      T.stopBubble();
      var tab = this.tabsList.find(function (item) {
        return item.crtitCode === _this5.checked;
      });
      this.tabName = tab && tab.crtitName || '市场解读';
      sa.track('sy_djjd_nrxq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        tab_name: this.tabName //  'news_column':item.title

      });

      if (item.isjump === '1') {
        var oSend = {
          url: item.jumplink
        };
        T.fn.action10061(oSend);
      }
    }
  }
});

var jrrdApp = new Component({
  el: '#jrrd-app',
  data: {
    typeVersion:'',
    checked: 0,
    hotspot: [],
    riseList: [],
    timer: null,
    leftCountPx: 0,
   
  },
  mounted: function mounted() {
    var _this6 = this;
  
    // setInterval(() => {
   
    this.init(); // }, 3000);




    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        if (_this6.timer) {
          clearInterval(_this6.timer);
          _this6.timer = null; // init(true);
          // pageRefresh();
        }

        _this6.init();
      }
    });
  },
  methods: {
    init: function init() {
      var that = this;
      T.readLocalMesg(['hfFontType'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
        that.typeVersion=oLocal.HFFONTTYPE;
  
        if (that.typeVersion=='1') {
          that.leftCountPx = 110 / 37.5 * parseFloat($('html').css('font-size'));
        }else{
          that.leftCountPx = 82 / 37.5 * parseFloat($('html').css('font-size'));
        }
        });
    
  
      queryhome_newFocusOnToday().then(function (res) {
        var data = res.data.slice(0, 3);
        console.log(that.typeVersion,'typeVersion');
        var codeList = data.flatMap(function (item) {
          if (that.typeVersion==1) {
            return item.faucet.slice(0, 1);
          }else{
            return item.faucet.slice(0, 2);
          }
      
        });
        // console.log();
        refreshStock.concat(codeList);
        getStockInfo(codeList).then(function (res) {
          console.log('res', res, data);
          data.forEach(function (item) {
            item.faucet = item.faucet.filter(function (item) {
              return codeList.includes(item);
            }).map(function (item) {
              return res[item];
            });
            var hot = parseInt(item.hot);
            item.hotRate = ['', '', '', '', ''].map(function (_, index) {
              return index + 1 <= hot;
            });
          });
          console.log('data2222222', data);
          that.hotspot = data;
        });
      });
      queryTodayRiseOfFour().then(function (res) {
        that.riseList = res.data; // that.riseList[3].isUp=false
   
        if (that.typeVersion==1) {
      
        that.riseList.splice(3, 1);
         
        }else{
     
        }

        that.riseList.map(function (item, index) {

          if (item.isUp == false) {
            that.riseList.splice(index, 1);
          }


        }); // console.log('   that.riseList',   that.riseList);

        refreshStock.concat(res.data.map(function (item) {
          return item.stockCode;
        }));
        console.log('queryTodayRiseOfFour', res.data, refreshStock);

        if (that.timer === null) {
          that.tabCarousel(5000);
        }
      });
    },
    //跳转今日关注页
    openJrgzPage: function openJrgzPage() {
      T.stopBubble();
      sa.track('sy_fkbk_gd_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      var obj = {};
      obj.type = '1';
      obj.url = '/fkbk/index.html';
      obj.tzthiddentitle = '1', obj.tztadjustnever = '1', obj.statusBarDark = '1';
      T.fn.action10061(obj);
    },
    //跳转大涨解读页
    openJrfkPage: function openJrfkPage() {
      T.stopBubble();
      sa.track('sy_dzjd_gd_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      var oSend = {};
      oSend.url = '/hq/jrfk_new.html';
      oSend.tzthiddentitle = '1';
      oSend.tztadjustnever = '1';
      oSend.statusBarDark = '1';
      oSend.fullscreen = '1';
      T.fn.action10061(oSend);
    },
    dzjd: function dzjd(item) {
      T.stopBubble();
      console.log(item);
      sa.track('sy_dzjd_gpxq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        product_code: item.stockCode,
        product_name: item.stockName
      });
      var oSend = {};
      oSend.url = '/hq/jrfk_new.html';
      oSend.tzthiddentitle = '1';
      oSend.tztadjustnever = '1';
      oSend.statusBarDark = '1';
      oSend.fullscreen = '1';
      T.fn.action10061(oSend);
    },
    tabCarousel: function tabCarousel(time) {
      var that = this;
      that.timer = setInterval(function () {
        if (that.checked + 1 >= that.riseList.length) {
          that.checked = 0;
        } else {
          that.checked = that.checked + 1;
        }
      }, time);
    }
  }
});
var dcjhApp = new Component({
  el: '#dcjh-app',
  data: {
    swiperTcwj: null,
    list: [],
    swiperQfrl: null,
    qfrlList: [],
    typeVersion:''
  },
  mounted: function mounted() {
   var that=this
    T.readLocalMesg(['hfFontType'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
      that.typeVersion=oLocal.HFFONTTYPE;
      that.init();
    })

  },
  methods: {
    init: function init() {
      var that = this;
      console.log('that',that.typeVersion,this.typeVersion);
      queryInsightChanceCollectList().then(function (res) {
        that.list = [res[0], res[1]];
        console.log('题材挖掘', that.list);

        if (that.swiperTcwj) {
          that.swiperTcwj.destroy(false);
        }

        that.$nextTick(function () {
          that.swiperTcwj = new Swiper('#swiper-container-tcwj', {
            autoplayDisableOnInteraction: false,
            //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            observer: true,
            //图片加载失败会删除元素，需要更新swiper
            observerParents: true,
            autoplay: false,
            spaceBetween: 1,
            loop: true,
            pagination: '.swiper-pagination',
            onTap: function onTap(swiper, event) {
              if (event.target.className.includes('stock-name')) {
                var dom = $(event.target).parent();
                that.openStockPage(dom.attr('data-code'), dom.attr('data-market'),dom.attr('data-name'),'5');
                return;
              } else if (event.target.className.includes('stock-tag')) {
                var _dom = $(event.target);

                that.openStockPage(_dom.attr('data-code'), _dom.attr('data-market'));
                return;
              }

              that.openTcwjDetailPage($(swiper.clickedSlide).attr('data-id'), '0');
            }
          });
        });
      });
      querySignificantNews(1, 20).then(function (res) {
        that.qfrlList = res.data.records;

        if (that.swiperQfrl) {
          that.swiperQfrl.destroy(false);
        }

        that.$nextTick(function () {
          that.swiperQfrl = new Swiper('#swiper-container-qfrl', {
            autoplayDisableOnInteraction: false,
            //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
            observer: true,
            //图片加载失败会删除元素，需要更新swiper
            observerParents: true,
            autoplay: 5000,
            loop: true,
            direction: 'vertical',
            onTap: function onTap(swiper, event) {
              that.openTcwjDetailPages($(swiper.clickedSlide).attr('data-id'), '1');
            }
          });
        });
      });
    },
    //跳转题材挖掘二级页
    openTcwjPage: function openTcwjPage() {
      console.log('跳转题材挖掘二级页');
      T.stopBubble();
      sa.track('sy_tcwj_gd_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      var oSend = {
        url: '/dcwj/index.html'
      }; // oSend.config = {
      //     tzthiddentitle: '1',
      //     tztadjustnever: '1',
      // };

      oSend.tzthiddentitle = '1';
      oSend.tztadjustnever = '1';
      oSend.fullscreen = '1';
      oSend.statusBarDark = '1';
      T.fn.action10061(oSend);
    },
    openTcwjDetailPages: function openTcwjDetailPages(id, num) {
      console.log('num', num);
      sa.track('sy_qfrl_xq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      var obj = {
        url: '/zx2/zx_zxxq.html?id=' + id + '&&menu_id=001' + '&&type=clszx'
      };
      var oSend = {
        url: obj.url
      };
      oSend.secondtype = '98';
      oSend.secondtext = 'tzt_zx.png';
      oSend.secondjsfuncname = 'tztPageSecodeFun()';
      TZT.fn.action10061(oSend);
    },
    //跳转资讯详情页
    openTcwjDetailPage: function openTcwjDetailPage(id, num) {
      console.log('num', id, num);
      sa.track('sy_tcwj_xq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        column_no: ''
      });
      var obj = {
        url: '/zx2/zx_zxxq.html?id=' + id + '&&menu_id=001' + '&&type=clszx'
      };
      var oSend = {
        url: obj.url
      };
      oSend.secondtype = '98';
      oSend.secondtext = 'tzt_zx.png';
      oSend.secondjsfuncname = 'tztPageSecodeFun()';
      TZT.fn.action10061(oSend);
    }
  }
});
var ywListApp = new Component({
  el: '#yw-list-app',
  data: {
    page: {
      current: 1,
      size: 0
    },
    typeVersion:'',
    ywList: [],
    ywOriginList: [],
    tgList: [[], []]
  },
  mounted: function mounted() {
    // this.init();
    var that = this;
  
    $('.page-wrapper').off('scroll').scroll(function () {
      //控制首页顶部显示，与客户端交互
      reqrolloffset();
      var targetY = $('#more-page').offset().top;
      var screenHeight = $('body').height(); //屏幕高度

      if (screenHeight >= targetY * 0.9) {
        if (oVal.loadYWFlag && oVal.ywNextPage) {
          console.log('加载数据'); // oVal.ywPageNum++;

          oVal.loadYWFlag = false;
          that.getYwList();
        }
      }
    });
  },
  methods: {
    dateStr: dateStr,
    formatDate: formatDate,
    init: function init() {
      var that=this
      T.readLocalMesg(['hfFontType'], function (oLocal) {// console.log('MOBILECODE数据', oLocal);
        that.typeVersion=oLocal.HFFONTTYPE;
  
      })
      oVal.infoOffset = '0';
      oVal.ywPageNum = 1;
      this.ywList = [];
      this.ywOriginList = [];
      this.getTgList();
      this.getYwList();
    },
    getYwList: function getYwList() {
      var that = this;
      var oSendData = {
        action: '31020',
        param: JSON.stringify({
          accessKey: 'e6ce431bd537718a',
          infoOffset: oVal.infoOffset,
          //当前已遍历查询的资讯页数，默认为 0
          page: oVal.ywPageNum - 1
        }),
        ReqLinkType: '2'
      };
      $.getData({
        oSendData: oSendData,
        copyIsArray: false,
        isload: false,
        fnSuccess: function fnSuccess(data) {
          var res = JSON.parse(data.BINDATA);
          oVal.infoOffset = res.infoOffset;
          that.ywOriginList = that.ywOriginList.concat(res.data);
          that.ywList = that.ywOriginList.chunk(2);
          oVal.ywNextPage = res.hasNext;
          oVal.loadYWFlag = true;
        },
        oConfig: function oConfig(error) {
          console.log('要闻接口报错：', error);
        }
      });
    },
    //60001 热门观点列表
    //60002 根据客户号查询订阅观点信息
    //60003 根据客户号查询订阅组合信息
    //60004 查询投顾组合收益率排行榜信息
    getTgList: function getTgList() {
      var that = this;
      var params = {
        // clientId: '023008037400',
        clientId: '($MobileCode)' || oVal.MOBILECODE,
        orderType: '2'
      };
      var oSend = {
        param: JSON.stringify(params),
        method: 'get',
        ReqlinkType: 2 //资讯通道

      }; // // $.getData({
      //     oSendData: Object.assign({ action: 60001 }, oSend),

      queryTggd().then(function (oData) {
        var res = oData.data;
        that.tgList = [res.map.list, that.tgList[1]];
      });
      queryTgts().then(function (oData) {
        var res = oData.data;
        console.log('res.data.map', res);
        res.map.list = res.map.list.slice(0, 2);

        for (var i = 0; i < res.map.list.length; i++) {
          res.map.list[i].faceImageSmall = oVal.tgJumpId + res.map.list[i].faceImageSmall;
        }

        that.tgList = [that.tgList[0], res.map.list];
        console.log(res, that.tgList, '推荐投顾');
      }); // $.getData({
      //     oSendData: {
      //         action: 48012,
      //         method: 'post',
      //         path: '/redirect',
      //         targetPath: '/utilServer/api/homePage/fn300010',
      //         pageNumber: 1,
      //         clientId: '($MobileCode)' || oVal.MOBILECODE,
      //         // pageSize: 1,
      //         orderType: '2',
      //         ReqlinkType: 2, //资讯通道
      //     },
      //     isload:false,
      //     fnSuccess: function (data) {
      //         const res = JSON.parse(data.DATA);
      //         that.tgList = [res.map.list, that.tgList[1]];
      //         console.log(res, that.tgList, '投顾观点');
      //     },
      //     oConfig: function (error) {
      //         console.log(error);
      //     },
      // });
      // $.getData({
      //     oSendData: Object.assign({ action: 60004 }, oSend),
      // $.getData({
      //     oSendData: {
      //         action: 48012,
      //         method: 'post',
      //         path: '/redirect',
      //         targetPath: '/utilServer/api/homePage/fn300021TS',
      //         pageNumber: 1,
      //         curPage: 2,
      //         numPerPage: 2,
      //         clientId: '($MobileCode)' || oVal.MOBILECODE,
      //         // pageSize: 1,
      //         ReqlinkType: 2, //资讯通道
      //     },
      //     isload:false,
      //     fnSuccess: function (data) {
      //         const res = JSON.parse(data.DATA);
      //         console.log('res.data.map', res);
      //         res.map.list = res.map.list.slice(0, 2);
      //         for (var i = 0; i < res.map.list.length; i++) {
      //             res.map.list[i].faceImageSmall = oVal.tgJumpId + res.map.list[i].faceImageSmall;
      //         }
      //         that.tgList = [that.tgList[0], res.map.list];
      //         console.log(res, that.tgList, '推荐投顾');
      //     },
      //     oConfig: function (error) {
      //         console.log(error);
      //     },
      // });
    },
    showRateText: function showRateText(str) {
      return (parseFloat(str) * 100).toFixed(2) + '%';
    },
    //跳转投顾社区-观点-热门页
    openTggdPage: function openTggdPage() {
      console.log('跳转投顾社区-观点-热门页');
      sa.track('sy_tggd_gd_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      T.fn.action10061({
        url: oVal.configData.TGVIEWPOINTMORE,
        tzthiddentitle: '1',
        tztadjustnever: '1',
        statusBarDark: '1',
        fullscreen: '1'
      }); // T.stopBubble();
      // var oSend = { url: url };
      // T.fn.action10061(oSend);
    },
    //跳转投顾社区对应投顾页面
    openTgPage: function openTgPage() {
      sa.track('sy_tjtg_gd_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页'
      });
      console.log('跳转投顾社区对应投顾页面');
      T.fn.action10061({
        url: oVal.configData.TGADVISORMORE,
        tzthiddentitle: '1',
        tztadjustnever: '1',
        statusBarDark: '1',
        fullscreen: '1'
      }); // T.stopBubble();
      // var oSend = { url: url };
      // T.fn.action10061(oSend);
    },
    //跳转选中投顾详情页
    openTgDetailPage: function openTgDetailPage(item, index) {
      sa.track('sy_tjtg_tgxq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        tg_id: item.investId,
        tg_name: item.userName,
        column_no: index
      });
      console.log('跳转选中投顾详情页', item);
      var url = oVal.configData.TGLINK + '/m/app/#/discover/advisorDetail?invest_id=' + item.investId + '&source_id=hzzz&&fullscreen=1';
      tgFunc(url);
    },
    //跳转选中观点详情页
    openGdDetailPage: function openGdDetailPage(item, index) {
      console.log('跳转选中观点详情页', item, index);
      sa.track('sy_tggd_gdxq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        tg_id: item.viewId,
        tg_name: item.title,
        view_id: item.viewpageId,
        view_name: item.viewpageName,
        column_no: index
      });
      var url = oVal.configData.TGLINK + '/m/app/#/viewDetail?view_id=' + item.viewId + '&source_id=hzzz&&fullscreen=1';
      tgFunc(url);
    },
    //跳转对应链接
    openOtherPage: function openOtherPage(url) {
      console.log('跳转对应链接', url);
      T.stopBubble();
      var oSend = {
        url: url
      };
      T.fn.action10061(oSend);
    },
    //跳转资讯详情页
    openYwDetailPage: function openYwDetailPage(item, index) {
      console.log('跳转资讯详情页', item, index, item.itemId);
      sa.track('sy_zxlb_zxxq_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '首页',
        column_no: index
      });
      var action = 'read.txt'; // pageSensors.reportClick('mainPageColumnClick', {
      //     column_type: '要闻',
      //     column_name: '要闻点击',
      //     column_no: item.itemId,
      // });

      var obj = {
        url: '/zx2/zx_zxxq.html?type=ths&id=' + item.itemId + '&time=' + formatDate(item.time) + '&source=' + item.source
      };
      var oSend = {
        url: obj.url
      };
      T.saveMapMesg({
        THSPAGETITLE: item.title
      }, function () {});

      if (readId.toString().indexOf(item.itemId) == -1) {
        readId.push(item.itemId);
      }

      T.saveFileMesg(readId, action, function (oData) {
        T.readFileMesg(action, function (oData) {
          if (item.copyright == '1') {
            TZT.fn.action10061(oSend);
          } else {
            TZT.fn.action10061({
              url: item.url
            });
          }
        });
      });
    }
  }
});
var timestamp = null;

function dealRefreshTimer() {
  refreshStock.api();

  if (!timestamp) {
    timestamp = new Date().getTime();
  } //3分钟刷新


  var timestamps = new Date().getTime();
  console.log('timestamps', timestamps, timestamp);

  if (timestamps - timestamp > 180000) {
    pageRefresh();
    timestamp = timestamps;
  }
}