"use strict";

var swiper = '',
    testIp = '',
    rememberTime = 0,
    swipers = '';
var zdf_arr = []; //今日风口主题涨跌幅数据

var jrfk_data = '',
    jrfk_oData = ''; //今日风口主题数据

var ts_info = ''; //推送消息数据

var oCache = {};
$('.banner .swiper-slide').css("height", Number($(document).width()) / 750 * 330 + "px");
$('.banner').css("height", Number($(document).width()) / 750 * 330 + "px");
var gdFlag = true;
var pageSensors = new track.Tracker();
pageSensors.registerPageModule('SY');
$('.wapper').scroll(function () {
  /*var a = $("#line1").offset().top;
     if (a >= $(window).scrollTop() && a < ($(window).scrollTop() + $(window).height())) {
         if ($('.moreScroll').hasClass('scrollNone')) {
         	$('.moreScroll').removeClass('scrollNone')
  		getGPZH();GPZHEvent();	//股票组合
  		getLCJJ();LCJJEvent();	//理财基金
  			getkx724(); //7*24快讯
  		getFNJP(); //福牛接盘
  		getJRFK(); //今日风口
  		getJRGZ(); //今日关注
         }
     }*/
  reqrolloffset();

  if (gdFlag) {
    gdFlag = false;
    getJRGZ(); //今日关注

    getNRGD();
    NRGDEvent(); //牛人观点

    getGPZH();
    GPZHEvent(); //股票组合

    getLCJJ();
    LCJJEvent(); //理财基金
  }
});

function reqrolloffset() {
  var obj = {};
  obj.offset = -$("#wapperTop").offset().top;
  var jsonobj = JSON.stringify(obj);
  T.readLocalMesg(["tztwkwebview"], function (data) {
    if (data.TZTWKWEBVIEW == 1) {
      window.webkit.messageHandlers.setContentParams.postMessage({
        func: "reqrolloffset",
        //回调函数名
        data: jsonobj //数据

      });
    } else {
      window.MyWebView.setContentParams("reqrolloffset", jsonobj);
    }

    ;
  });
} // 从综合管理系统获取页面内容


$(function () {
  getRemmber();
  getBanner();
  bannerEvent();
  getKJCD();
  KJCDEvent(); //快捷菜单

  getGDXX();
  GDXXEvent(); //滚动消息

  T.readLocalMesg(['mobilecode', 'softversion'], function (oData) {
    var MOBILECODE = oData.MOBILECODE;

    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      $('.xbly').show();
      getXBLY();
      XBLYEvent(); //小白乐园
    }
  }); // var action = "tzthome_newfirstflag.txt";
  // T.readFileMesg(action,function(oData){
  //        if(!oData){
  //        	getXBLY();XBLYEvent();	//小白乐园
  //        	$('.xbly').show();
  //        	// setMsgSubscribe();
  //        	saveFirstFlag();
  //        }else{
  //        	getGDXX();GDXXEvent();	//滚动消息
  //        }
  //    });
  //    T.attrUrl($('.more'));
  // setStyle();
  // getTuijian();
  //getHDZQ();HDZQEvent(); //活动专区
  // getNRGD();NRGDEvent();//牛人观点
  // getGPZH();GPZHEvent();	//股票组合
  // getLCJJ();LCJJEvent();	//理财基金

  /*setTimeout(function(){
  		getGPZH();GPZHEvent();	//股票组合
  	getLCJJ();LCJJEvent();	//理财基金
  	$('.moreScroll').removeClass('scrollNone')
  },2000)*/
  // getRMJJ();	//热门掘金

  getkx724();
  kx724Event(); //7*24快讯

  getFNJP(); //福牛接盘

  getJRFK(); //今日风口
  //getJRGZ(); //今日关注

  /*setTimeout(function () {
  	getJRFK()
  },1500)*/

  /*var kx_timer = setTimer(getkx724, 10000);*/

  setMsgSubscribe();
  closeDeclare(); //股转相关提醒弹窗初始设置关闭

  cybSignOpen(); //创业板弹窗功能
  // 页面浏览 page

  pageSensors.reportPageView('pageView');
});
var kx724Flag = 0;

var setTimer = function setTimer(fn, interval) {
  var _recurse, ref;

  ref = {};
  ref["continue"] = true;

  (_recurse = function recurse() {
    if (ref["continue"]) {
      ref.timeout = setTimeout(function () {
        fn();

        _recurse();
      }, interval);
    }
  })();

  return ref;
};

var clearTimer = function clearTimer(ref) {
  ref["continue"] = false;
  clearTimeout(ref.timeout);
};

var pageTimer = {};
var grid = [],
    myAccount = "";

function setMsgSubscribe() {
  //订阅消息
  T.readLocalMesg(['jyloginflag', 'logintype=1', 'usercode'], function (oData) {
    //判断登录
    if (oData.JYLOGINFLAG <= 1) {// 未登录
    } else {
      //登录
      var action2 = "tzthome_newSubscribe.txt";
      myAccount = oData.USERCODE;
      T.readFileMesg(action2, function (oData) {
        if (!oData) {
          msgSubscribe(myAccount);
        } else {
          grid = JSON.parse(decodeURIComponent(oData));
          var flag = 0;

          for (var i = 0; i < grid.length; i++) {
            if (grid[i] == myAccount) {
              flag = 1;
              break;
            }
          }

          if (flag == 0) {
            msgSubscribe(myAccount);
          }
        }
      });
    }
  });
}

function msgSubscribe(myAccount) {
  var action2 = "tzthome_newSubscribe.txt";
  var oSendData = {
    'action': '47202',
    'ReqlinkType': '2',
    'Account': '($account)',
    'menuids': '202,207,205,209,210'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {}
  });
  grid.push(myAccount);
  T.saveFileMesg(grid, action2, function (data) {});
} // function saveFirstFlag(){
// 	var action = "tzthome_newfirstflag.txt";
// 	var obj={flag:1};
// 	T.saveFileMesg(obj,action,function(oData){});
// }


function getRemmber() {
  T.readFileMesg('REMMBERTIME', function (data) {
    if (data) {
      /*var bannerDom = JSON.parse(decodeURIComponent(data));
      var nowDate = new Date();
      var nowday = formatDate(nowDate,"yyyy-mm-dd");
      var beforeday = getBeforeDate(7).replace(/-/g,"");
      if (Number(beforeday)>Number(bannerDom)) {
      	rememberTime=1;//重新加载
      }else{
      	rememberTime=0;//读取缓存
      }
      T.saveFileMesg(JSON.stringify(nowday.replace(/-/g,"")),'REMMBERTIME',function(){})*/
      var nowDateTime = new Date().getTime(); //console.log(nowDateTime,data.dateTime);

      if (nowDateTime - 86400000 < data) {
        //需求是1天
        rememberTime = 0; //读取缓存
      } else {
        rememberTime = 1; //重新加载
      }

      T.saveFileMesg(nowDateTime, 'REMMBERTIME', function () {});
    } else {
      rememberTime = 1; //重新加载

      /*var nowDate = new Date();
      var nowday = formatDate(nowDate,"yyyy-mm-dd");
      T.saveFileMesg(JSON.stringify(nowday.replace(/-/g,"")),'REMMBERTIME',function(){})*/

      var nowDateTime = new Date().getTime();
      T.saveFileMesg(nowDateTime, 'REMMBERTIME', function () {});
    }
  });
}

function getBanner() {
  T.readFileMesg('BANNERDOM', function (data) {
    if (data) {
      if (rememberTime == 1) {
        bannerOne();
      } else {
        var bannerDom = JSON.parse(decodeURIComponent(data));
        $('.banner .swiper-wrapper').html(bannerDom).attr('data-on', '1');

        if (swiper == '') {
          swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            autoplay: 3000,
            autoplayDisableOnInteraction: false
          });
        }

        var oSendData = {
          'action': '41500',
          'type': 'SYJDT',
          'ReqlinkType': '2'
        };
        $.getData({
          oSendData: oSendData,
          isload: false,
          fnSuccess: function fnSuccess(oData) {
            if (oData.ERRORNO >= 0) {
              var ln = oData.GRID0.length,
                  sHtml = '';

              if (ln > 1) {
                for (var i = 1; i < ln; i++) {
                  var oItem = oData.GRID0[i].split('|');
                  sHtml += '<div class="swiper-slide" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '" data-title="' + oItem[oData.IMAGE_TITLE_INDEX] + '" data-id="' + oItem[oData.ID_INDEX] + '"><img class="image" src="' + oItem[oData.IMAGE_URL_INDEX] + '"></div>';
                }

                $('.bannerdom').html(sHtml);
              } else {
                sHtml += '<div class="swiper-slide"><img class="image" src="/home_new/images/banner.png"></div>';
                $('.bannerdom').html(sHtml);
              }

              T.saveFileMesg(JSON.stringify(sHtml), 'BANNERDOM', function () {});
            }
          }
        });
      }
    } else {
      bannerOne();
    }
  });
}

function bannerOne() {
  var oSendData = {
    'action': '41500',
    'type': 'SYJDT',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';
        var cHeight = $(document).width();

        if (ln > 1) {
          for (var i = 1; i < ln; i++) {
            var oItem = oData.GRID0[i].split('|');
            sHtml += '<div class="swiper-slide" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '" data-title="' + oItem[oData.IMAGE_TITLE_INDEX] + '" data-id="' + oItem[oData.ID_INDEX] + '"><img class="image" src="' + oItem[oData.IMAGE_URL_INDEX] + '"></div>';
          }

          $('.banner .swiper-wrapper').html(sHtml).attr('data-on', '1');
        } else {
          sHtml += '<div class="swiper-slide"><img class="image" src="/home_new/images/banner.png"></div>';
          $('.banner .swiper-wrapper').html(sHtml).attr('data-on', '1');
        }

        T.saveFileMesg(JSON.stringify(sHtml), 'BANNERDOM', function () {});

        if (swiper == '') {
          swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            autoplay: 3000,
            autoplayDisableOnInteraction: false
          });
        }
      }
    }
  });
}

function bannerEvent() {
  $('.banner .swiper-wrapper').delegate('.swiper-slide', 'click', function () {
    var url = $(this).attr('data-url');
    var activityTitle = $(this).attr('data-title');
    var bannerId = $(this).attr('data-id');

    var _this = $(this); //快捷菜单事件埋点


    track.sensors.track('banner_click', {
      'banner_id': bannerId,
      'banner_list_name': '首页焦点图',
      'banner_name': activityTitle,
      'banner_superview': '首页'
    }); //banner点击

    pageSensors.reportClick('bannerClick', {
      banner_id: bannerId,
      banner_name: activityTitle,
      jump_url: url
    });

    if (url) {
      var typeName = T.getUrlParameter('typeName', url);
      var needH5Skip = T.getUrlParameter('needH5Skip', url);
      var wtType = T.getUrlParameter('wtType', url);

      if (needH5Skip) {
        //需要以H5方式跳转活动页
        getCommonActivityUrl(url, activityTitle);
      } else if (typeName) {
        //活动类型
        getActivityUrl(url, typeName);
      } else if (url.indexOf('action:58130') >= 0) {
        T.readLocalMesg(['MOBILECODE', 'softversion'], function (oLocal) {
          if (versionfunegt(oLocal.SOFTVERSION, '3.1.5')) {
            T.fn.changeurl(url);
          } else {
            var MOBILECODE = oLocal.MOBILECODE;

            if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
              T.fn.action10090();
            } else {
              var surl = decodeURIComponent(url.split('action:58130/?url=')[1]);
              T.fn.changeurl(surl);
            }
          }
        });
      } else if (wtType) {
        //跳转网厅
        T.readLocalMesg(['MOBILECODE', 'jyloginflag'], function (oLocal) {
          url = url.replace("&wtType=1", "");

          if (!!oLocal.MOBILECODE && oLocal.JYLOGINFLAG >= 1) {
            //第三种 已注册已登录
            wtJump(url);
          } else {
            T.fn.action10090({
              jsfuncname: "wtJump('" + url + "')"
            });
          }
        });
      } else {
        //特殊判断3.6.1和3.6.2，模拟炒股
        T.readLocalMesg(['MOBILECODE', 'softversion'], function (oLocal) {
          var _version = oLocal.SOFTVERSION,
              MOBILECODE = oLocal.MOBILECODE;

          if (T.appversion.iphone() && (_version == "3.6.1" || _version == "3.6.2") && (_this.attr('data-url').indexOf("hfzqkcbtest.moguyun.com") > -1 || _this.attr('data-url').indexOf("hfzqkcb.moguyun.com") > -1)) {
            mncg_modules(_this.attr('data-url'), MOBILECODE);
          } else {
            T.fn.changeurl(url);
          }
        });
      }
    }
  });
}

function getKJCD() {
  T.readFileMesg('KJCDDOM', function (data) {
    if (data) {
      if (rememberTime == 1) {
        kjcdOne();
      } else {
        var kjcdDom = JSON.parse(decodeURIComponent(data));
        $('.swiper-containers .swiper-wrapper').html(kjcdDom);
        $("#funcBar").show();

        if (swipers == '') {
          swipers = new Swiper('.swiper-containers', {
            slidesPerView: 'auto',
            pagination: '.swiper-pagination',
            onTouchEnd: function onTouchEnd(swiper, event) {//console.log("数据已存储",swiper,event)
            }
          });
        }

        var oSendData = {
          'action': '41500',
          'type': 'KJCD',
          'ReqlinkType': '2'
        };
        $.getData({
          oSendData: oSendData,
          isload: false,
          fnSuccess: function fnSuccess(oData) {
            //console.log("快捷菜单数据：",oData);
            if (oData.ERRORNO >= 0) {
              var ln = oData.GRID0.length,
                  sHtml = '';

              if (ln > 1) {
                var img_arr = []; //存放图片数组

                for (var i = 1; i < ln; i++) {
                  var oItem = oData.GRID0[i].split('|');
                  img_arr.push(oItem);
                }

                if (ln > 5) {
                  var arr = img_arr.chunk(10); //分隔图片以5个为一组

                  for (var i = 0; i < arr.length; i++) {
                    sHtml += '<div class="swiper-slide"><ul class="tztui-grids home_new">';

                    for (var j = 0; j < arr[i].length; j++) {
                      if (arr[i][j][oData.CLICKTYPE_INDEX] == '0') {
                        //自定义事件
                        sHtml += '<li class="tztui-grid tztui-grid2"';
                      } else if (arr[i][j][oData.CLICKTYPE_INDEX] == '9') {
                        //手机号注册与否判断标志
                        sHtml += '<li class="tztui-grid tztui-grid9"';
                      } else {
                        sHtml += '<li class="tztui-grid tztui-grid1"';
                      }

                      sHtml += 'data-url="' + arr[i][j][oData.IMAGE_CLICK_INDEX] + '" data-title="' + arr[i][j][oData.IMAGE_TITLE_INDEX] + '"><img class="grid__icon" src="' + arr[i][j][oData.IMAGE_URL_INDEX] + '"><p class="grid__label">' + arr[i][j][oData.IMAGE_TITLE_INDEX] + '</p><i class=""></i></li>';
                    }

                    sHtml += '</ul></div>';
                  }
                } else {
                  var arr = img_arr.chunk(10); //分隔图片以5个为一组

                  sHtml += '<div class="swiper-slide"><ul class="tztui-grids home_new">';

                  for (var j = 0; j < arr.length; j++) {
                    if (arr[j][oData.CLICKTYPE_INDEX] == '0') {
                      //自定义事件
                      sHtml += '<li class="tztui-grid tztui-grid2"';
                    } else if (arr[i][j][oData.CLICKTYPE_INDEX] == '9') {
                      //手机号注册与否判断标志
                      sHtml += '<li class="tztui-grid tztui-grid9"';
                    } else {
                      sHtml += '<li class="tztui-grid tztui-grid1"';
                    }

                    sHtml += 'data-url="' + arr[j][oData.IMAGE_CLICK_INDEX] + '" data-title="' + arr[j][oData.IMAGE_TITLE_INDEX] + '"><img class="grid__icon" src="' + arr[j][oData.IMAGE_URL_INDEX] + '"><p class="grid__label">' + arr[j][oData.IMAGE_TITLE_INDEX] + '</p><i class=""></i></li>';
                  }

                  sHtml += '</ul></div>';
                }

                $('.kjcddom').html(sHtml);
                T.saveFileMesg(JSON.stringify(sHtml), 'KJCDDOM', function () {});
              }
            }
          }
        });
      }
    } else {
      kjcdOne();
    }
  });
}

function kjcdOne() {
  var oSendData = {
    'action': '41500',
    'type': 'KJCD',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      //console.log("快捷菜单不再是第一次加载",oData);
      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';

        if (ln > 1) {
          var img_arr = []; //存放图片数组

          for (var i = 1; i < ln; i++) {
            var oItem = oData.GRID0[i].split('|');
            img_arr.push(oItem);
          }

          if (ln > 5) {
            var arr = img_arr.chunk(10); //分隔图片以5个为一组

            for (var i = 0; i < arr.length; i++) {
              sHtml += '<div class="swiper-slide"><ul class="tztui-grids home_new">';

              for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j][oData.CLICKTYPE_INDEX] == '0') {
                  //自定义事件
                  sHtml += '<li class="tztui-grid tztui-grid2"';
                } else if (arr[i][j][oData.CLICKTYPE_INDEX] == '9') {
                  //手机号注册与否判断标志
                  sHtml += '<li class="tztui-grid tztui-grid9"';
                } else {
                  sHtml += '<li class="tztui-grid tztui-grid1"';
                }

                sHtml += 'data-url="' + arr[i][j][oData.IMAGE_CLICK_INDEX] + '" data-title="' + arr[i][j][oData.IMAGE_TITLE_INDEX] + '"><img class="grid__icon" src="' + arr[i][j][oData.IMAGE_URL_INDEX] + '"><p class="grid__label">' + arr[i][j][oData.IMAGE_TITLE_INDEX] + '</p><i class=""></i></li>';
              }

              sHtml += '</ul></div>';
            }
          } else {
            var arr = img_arr.chunk(10); //分隔图片以5个为一组

            sHtml += '<div class="swiper-slide"><ul class="tztui-grids home_new">';

            for (var j = 0; j < arr.length; j++) {
              if (arr[j][oData.CLICKTYPE_INDEX] == '0') {
                //自定义事件
                sHtml += '<li class="tztui-grid tztui-grid2"';
              } else if (arr[i][j][oData.CLICKTYPE_INDEX] == '9') {
                //手机号注册与否判断标志
                sHtml += '<li class="tztui-grid tztui-grid9"';
              } else {
                sHtml += '<li class="tztui-grid tztui-grid1"';
              }

              sHtml += 'data-url="' + arr[j][oData.IMAGE_CLICK_INDEX] + '" data-title="' + arr[j][oData.IMAGE_TITLE_INDEX] + '"><img class="grid__icon" src="' + arr[j][oData.IMAGE_URL_INDEX] + '"><p class="grid__label">' + arr[j][oData.IMAGE_TITLE_INDEX] + '</p><i class=""></i></li>';
            }

            sHtml += '</ul></div>';
          }

          $('.swiper-containers .swiper-wrapper').html(sHtml);
          $("#funcBar").show();
          T.saveFileMesg(JSON.stringify(sHtml), 'KJCDDOM', function () {}); // $('.swiper-containers .swiper-wrapper .swiper-slide').each(function(i,item) {
          // 	$(this).append('<i class="tztui-grid-next"></i>');
          // })
        }
      }

      if (swipers == '') {
        swipers = new Swiper('.swiper-containers', {
          slidesPerView: 'auto',
          pagination: '.swiper-pagination',
          onTouchEnd: function onTouchEnd(swiper, event) {//.log("数据未存储",swiper,event)
          }
        });
      }
    }
  });
}

function KJCDEvent() {
  $(".swiper-containers").delegate(".tztui-grid", "click", function (e) {
    var _this = $(this);

    var dataUrl = _this.attr('data-url');

    var activityTitle = $(this).attr('data-title');
    var typeName = T.getUrlParameter('typeName', dataUrl);
    var needH5Skip = T.getUrlParameter('needH5Skip', dataUrl);
    var wtType = T.getUrlParameter('wtType', dataUrl); //快捷菜单事件埋点

    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '快捷菜单',
      'second_list_type': 'icon',
      'second_list_name': activityTitle
    }); // 九宫格区icon点击

    pageSensors.reportClick('iconSyClick', {
      button_name: activityTitle,
      jump_url: dataUrl
    }, false);

    if (needH5Skip) {
      //需要以H5方式跳转活动页
      getCommonActivityUrl(dataUrl, activityTitle);
    } else if (typeName) {
      //活动类型
      getActivityUrl(dataUrl, typeName);
    } else if (_this.find('p').html() == 'K线游戏') {
      var oSend = {
        action: 46200,
        ReqLinkType: 2
      };
      T.readLocalMesg(['MOBILECODE'], function (oLocal) {
        var MOBILECODE = oLocal.MOBILECODE;
        T.saveMapMesg({
          kLineurl: _this.attr('data-url')
        }, function () {
          if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
            if (T.appversion.andriod()) {
              T.fn.changeurl('http://action:58130/?url=' + encodeURIComponent('jy/KLinePlay.html'));
            } else {
              T.fn.action10061('jy/KLinePlay.html');
            }
          } else {
            $.getData({
              oSendData: oSend,
              fnSuccess: function fnSuccess(data) {
                //console.log(data);
                var obj = {};
                obj.PUBLICK_KEY = data.KLINEKEY;
                obj.MD5_KEY = data.MD5KEY;
                var str = JSON.stringify({
                  mobile: MOBILECODE
                });
                var oSendKeyUrl = encryptRsa3(obj.PUBLICK_KEY, obj.MD5_KEY, str);
                var url = _this.attr('data-url') + '&data=' + encodeURIComponent(oSendKeyUrl.data);
                T.fn.action10061(url);
              }
            });
          }
        });
      });
    } else if (wtType) {
      //跳转网厅
      T.readLocalMesg(['MOBILECODE', 'jyloginflag'], function (oLocal) {
        dataUrl = dataUrl.replace("&wtType=1", ""); //dataUrl=encodeURIComponent(dataUrl);

        if (!!oLocal.MOBILECODE && oLocal.JYLOGINFLAG >= 1) {
          //第三种 已注册已登录
          wtJump(dataUrl);
        } else {
          T.fn.action10090({
            jsfuncname: "wtJump('" + dataUrl + "')"
          });
        }
      });
    } else {
      //特殊判断3.6.1和3.6.2，模拟炒股
      T.readLocalMesg(['MOBILECODE', 'softversion'], function (oLocal) {
        var _version = oLocal.SOFTVERSION,
            MOBILECODE = oLocal.MOBILECODE;

        if (T.appversion.iphone() && (_version == "3.6.1" || _version == "3.6.2") && (_this.attr('data-url').indexOf("hfzqkcbtest.moguyun.com") > -1 || _this.attr('data-url').indexOf("hfzqkcb.moguyun.com") > -1)) {
          mncg_modules(_this.attr('data-url'), MOBILECODE);
        } else {
          if (_this.hasClass('tztui-grid1')) {
            //T.fn.changeurl(_this.attr('data-url'))华福资讯,数据中心，智能选股，智能盯盘，投教园地
            if (_this.find('p').html() == '华福资讯') {
              if (_this.attr('data-url').indexOf('TitleSkinType=1') > 0) {
                T.fn.changeurl(_this.attr('data-url') + "&TitleSkinType=1");
              } else {
                T.fn.changeurl(_this.attr('data-url'));
              }
            } else if (_this.find('p').html() == '智能选股' || _this.find('p').html() == '数据中心' || _this.find('p').html() == '智能盯盘' || _this.find('p').html() == '投教园地') {
              T.fn.changeurl(_this.attr('data-url') + "&&TitleSkinType=1");
            } else {
              T.fn.changeurl(_this.attr('data-url'));
            }
          } else if (_this.hasClass('tztui-grid9')) {
            T.readLocalMesg(['MOBILECODE', 'softversion'], function (oLocal) {
              if (versionfunegt(oLocal.SOFTVERSION, '3.1.5')) {
                var url = 'http://action:58130/?url=' + encodeURIComponent(_this.attr('data-url'));
                T.fn.changeurl(url);
              } else {
                var MOBILECODE = oLocal.MOBILECODE;

                if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
                  T.fn.action10090();
                } else {
                  T.fn.changeurl(_this.attr('data-url'));
                }
              }
            });
          } else {
            if (_this.find('.grid__label').text().indexOf("多元金融") >= 0) {
              T.readLocalMesg(["softversion"], function (oData) {
                if (versionfunegt(oData.SOFTVERSION, '3.1.3')) {
                  dyjrFunc(_this.attr('data-url'));
                } else {
                  alert('当前客户端版本过低，请更新客户端至更高版本');
                }
              });
            } else if (_this.attr('data-url').indexOf("hzzz") >= 0) {
              //投顾首页
              tgFunc(_this.attr('data-url'));
            }
          }
        }
      });
    }

    e.stopPropagation();
  });
  $(".swiper-containers").delegate(".tztui-grid-next", "click", function (e) {
    e.stopPropagation();
  });
}

function mncg_modules(mncgurl, MOBILECODE) {
  T.saveMapMesg({
    mncgurl: mncgurl
  }, function () {
    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      if (T.appversion.andriod()) {
        T.fn.changeurl('http://action:58130/?url=' + encodeURIComponent('home_new/monichaogu.html'));
      } else {
        T.fn.action10061('home_new/monichaogu.html');
      }
    } else {
      MOBILECODE = window.btoa(encodeURIComponent(MOBILECODE));
      var url = mncgurl + '&mobile=' + MOBILECODE; //T.fn.action10061(url);

      if (url.indexOf("10061") > -1) {
        url = url.split("10061?url=")[1];
      }

      T.fn.action10061(url);
    }
  });
}

function getGDXX() {
  var login = "";
  T.readLocalMesg(['jyloginflag', 'logintype=1', 'tztuniqueid'], function (oData) {
    //判断登录
    if (oData.JYLOGINFLAG <= 1) {
      // 未登录
      login = 0;
    } else {
      //登录
      login = 1;
    }

    var isuniqueid = oData.TZTUNIQUEID;

    if (!isuniqueid || isuniqueid == 'undefined' || isuniqueid == '' || isuniqueid == 'null' || isuniqueid == '($tztuniqueid)') {} else {
      /*var oSendData = {
       'action': '41035',
       'ReqLinkType': '2',
       'uniqueid':'($tztuniqueid)',
      }
      $.getData({oSendData: oSendData,copyIsArray: false,isload: false,fnSuccess: function (data) {
      //console.log("推送消息：",data)
       var sHtml = '';
       if (data.GRID0 && data.GRID0.length>0) {
           var newData = data.GRID0.sort(compare);
           var menuids = [],items=[];
           for (var i = 0; i < newData.length; i++) {
           	var item = newData[i].split("|");
           	if(item[5]!=''&&item[5]>0){
                   $('.nextpage_xx').css({
                       'background':'url(images/nextpage_xx.png) no-repeat',
                       'background-size':'100% 100%',
                   });
                   break;
               }else{
                   $('.nextpage_xx').css({
                       'background':'url(images/nextpage.png) no-repeat',
                       'background-size':'100% 100%',
                   });
               }
           }
           for (var i = 0; i < newData.length; i++) {
           	var item = newData[i].split("|");
           	if (item[9]) {items.push(item);}
           }
      ts_info=items;
           loadXXLB(items,login);
       }
       if ($('.mingdan li').length<=0) {
       	$('.xwlb').hide();
       }else{
       	$('.xwlb').show();
       }
       //mescroll.endSuccess();
      }})*/

      /*新版消息中心，查询近一周最新的两条消息*/
      $.getData({
        oSendData: {
          action: '49835',
          mobilecode: '($mobileCode)',
          uniqueid: '($tztuniqueid)',
          account: '($account)',
          startpos: 1,
          maxcount: 2,
          ReqlinkType: '2'
        },
        copyIsArray: false,
        isload: false,
        fnSuccess: function fnSuccess(data) {
          //console.log("推送消息：",data)
          var sHtml = '';

          if (data.GRID0 && data.GRID0.length > 0) {
            var newData = data.GRID0.sort(compare); //console.log(newData);

            $('.mingdan').html(''); //成交回报、中签提醒、新股开板、持仓预警、国债逆回购、智能盯盘、新股新债 >> 显示详情
            //持仓公告、基金消息、每日资讯、系统消息、华福热门、持仓股公告、华福通知 >> 显示标题

            for (var i = 0; i < newData.length; i++) {
              var item = newData[i].split("|");

              if (item[2].indexOf("成交回报") > -1 || item[2].indexOf("中签提醒") > -1 || item[2].indexOf("新股开板") > -1 || item[2].indexOf("持仓预警") > -1 || item[2].indexOf("国债逆回购") > -1 || item[2].indexOf("智能盯盘") > -1 || item[2].indexOf("新股新债") > -1) {
                $('.mingdan').append('<li><a href="javascript:void;"><i></i><span>' + item[3] + '</span><em>' + dateStr2(item[6]) + '</em></a></li>');
              } else {
                $('.mingdan').append('<li><a href="javascript:void;"><i></i><span>' + item[2] + '</span><em>' + dateStr2(item[6]) + '</em></a></li>');
              }
            }

            $.getData({
              oSendData: {
                action: '49749',
                mobilecode: '($mobileCode)',
                uniqueid: '($tztuniqueid)',
                account: '($account)',
                ReqlinkType: '2'
              },
              copyIsArray: false,
              isload: false,
              fnSuccess: function fnSuccess(data) {
                if (data.DATA) {
                  var _result = JSON.parse(data.DATA);

                  $('.nextpage_xx').css({
                    'background': 'url(images/nextpage.png) no-repeat',
                    'background-size': '100% 100%'
                  });

                  for (var i = 0; i < _result.length; i++) {
                    if (_result[i].menubadage > 0) {
                      $('.nextpage_xx').css({
                        'background': 'url(images/nextpage_xx.png) no-repeat',
                        'background-size': '100% 100%'
                      });
                      break;
                    }
                  }
                } else {
                  $('.nextpage_xx').css({
                    'background': 'url(images/nextpage.png) no-repeat',
                    'background-size': '100% 100%'
                  });
                }
              },
              oConfig: function oConfig() {
                $('.nextpage_xx').css({
                  'background': 'url(images/nextpage.png) no-repeat',
                  'background-size': '100% 100%'
                });
              }
            });
            $('.xwlb').show();
          } else {
            $('.xwlb').hide();
          }
        },
        oConfig: function oConfig(error) {
          $('.xwlb').hide();
        }
      });
    }
  });
}

function compare(obj1, obj2) {
  //数组排序
  var val1 = Number(obj1.split("|")[9]);
  var val2 = Number(obj2.split("|")[9]);

  if (val1 < val2) {
    return 1;
  } else if (val1 > val2) {
    return -1;
  } else {
    return 0;
  }
}

function AutoScroll(obj) {
  $(obj).find("ul:first").animate({
    marginTop: "-22px"
  }, 1000, function () {
    $(this).css({
      marginTop: "0px"
    }).find("li:first").appendTo(this);
  });
}

function isToday(str) {
  return new Date().toDateString() === new Date(str.replace(/-/g, '/')).toDateString(); //ios中时间转换new Date()不兼容横杆'-'问题，转为斜杠‘/’
}

function loadXXLB(items, login) {
  var index = 0;
  $('.mingdan').html('');

  for (var i = 0; i < items.length; i++) {
    if (index == 2) {
      break;
    }

    var item = items[i];
    var itemName = item[4];

    if (login) {
      if (itemName.indexOf("成交回报") > -1 || itemName.indexOf("中签提醒") > -1 || itemName.indexOf("新股开板") > -1 || itemName.indexOf("持仓预警") > -1 || itemName.indexOf("国债逆回购") > -1) {
        $('.mingdan').append('<li><a href="#"><i></i><span>' + item[8] + '</span><em>' + dateStr2(item[9]) + '</em></a></li>');
        index++;
      } else if (itemName.indexOf("持仓公告") > -1) {
        $('.mingdan').append('<li><a href="#"><i></i><span>' + item[7] + '</span><em>' + dateStr2(item[9]) + '</em></a></li>');
        index++;
      } else if (itemName.indexOf("基金消息") > -1) {
        //date0511
        $('.mingdan').append('<li><a href="#"><i></i><span>' + item[7] + '</span><em>' + dateStr2(item[9]) + '</em></a ></li>');
        index++;
      }
    }

    if (itemName.indexOf("智能盯盘") > -1 || itemName.indexOf("新股新债") > -1) {
      $('.mingdan').append('<li data-href=""><a href="#"><i></i><span>' + item[8] + '</span><em>' + dateStr2(item[9]) + '</em></a></li>');
      index++;
    } else if (itemName.indexOf("每日资讯") > -1 || itemName.indexOf("系统消息") > -1 || itemName.indexOf("华福热门") > -1) {
      $('.mingdan').append('<li data-href=""><a href="#"><i></i><span>' + item[7] + '</span><em>' + dateStr2(item[9]) + '</em></a></li>');
      index++;
    } else if (itemName.indexOf("持仓股公告") > -1) {
      //date0809新增--bug5414
      $('.mingdan').append('<li><a href="#"><i></i><span>' + item[7] + '</span><em>' + dateStr2(item[9]) + '</em></a></li>');
      index++;
    } else if (itemName.indexOf("华福通知") > -1) {
      //date0809新增--bug5413
      $('.mingdan').append('<li><a href="#"><i></i><span>' + item[7] + '</span><em>' + dateStr2(item[9]) + '</em></a></li>');
      index++;
    }
  }
}

function GDXXEvent() {
  $(document).delegate('.xwlb', 'click', function () {
    //我的消息点击事件埋点
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '我的消息'
    });
    /*var oSend = {url:'/msg/msg_wdxx.html'};
          oSend.secondtype = '99';
          oSend.secondtext = '消息设置';
          oSend.secondjsfuncname = 'tztPageSecodeFun()';
          T.fn.action10061(oSend);*/

    var oSend = {
      url: '/dist/src/message-center/index.html#/index'
    };
    oSend.tzthiddentitle = 1; //客户端隐藏导航栏

    oSend.tztadjustnever = 0;
    oSend.TitleSkinType = 1;
    T.fn.action10061(oSend);
  });
}

function getXBLY() {
  T.readFileMesg('XBLYDOM', function (data) {
    if (data) {
      if (rememberTime == 1) {
        xblyOne();
      } else {
        var xblyDom = JSON.parse(decodeURIComponent(data));
        $('.xbly-box').html(xblyDom);
        var oSendData = {
          'action': '41500',
          'type': 'XBLY',
          'ReqlinkType': '2'
        };
        $.getData({
          oSendData: oSendData,
          isload: false,
          fnSuccess: function fnSuccess(oData) {
            if (oData.ERRORNO >= 0) {
              var ln = oData.GRID0.length,
                  sHtml = '';

              if (ln > 1) {
                var sHtml = '';

                for (var i = 1; i < 3; i++) {
                  var oItem = oData.GRID0[i].split('|');
                  sHtml += '<div class="box-item box-item1" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '"><img src="' + oItem[oData.IMAGE_URL_INDEX] + '"></div>';
                }

                $('.xblydom').html(sHtml);
                T.saveFileMesg(JSON.stringify(sHtml), 'XBLYDOM', function () {});
              }
            }
          }
        });
      }
    } else {
      xblyOne();
    }
  });
}

function xblyOne() {
  var oSendData = {
    'action': '41500',
    'type': 'XBLY',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';

        if (ln > 1) {
          /*$('.xbly-box .box-item').each(function(i,item) {
                             var that = $(this);
                             var oItem = oData.GRID0[i+1].split('|');
                             that.css('background','url('+ oItem[oData.IMAGE_URL_INDEX] +') no-repeat center / contain')
                             that.attr("data-url",oItem[oData.IMAGE_CLICK_INDEX])
                         })
                         var xblyNext = $('.xbly-box').html();
                         T.saveFileMesg(JSON.stringify(xblyNext),'XBLYDOM',function(){})*/
          var sHtml = '';

          for (var i = 1; i < ln; i++) {
            var oItem = oData.GRID0[i].split('|');
            sHtml += '<div class="box-item box-item1" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '"><img src="' + oItem[oData.IMAGE_URL_INDEX] + '"></div>';
          }

          $('.xbly-box').html(sHtml);
          T.saveFileMesg(JSON.stringify(sHtml), 'XBLYDOM', function () {});
        }
      }
    }
  });
}

function XBLYEvent() {
  $('.xbly-box').delegate('.box-item', 'click', function () {
    var _this = $(this);

    if (_this.attr('data-url').indexOf("hzzz") >= 0) {
      tgFunc(_this.attr('data-url'));
    } else {
      T.fn.changeurl($(this).attr('data-url'));
    }
  });
}

function getHDZQ() {
  var oSendData = {
    'action': '41500',
    'type': 'HDZQ',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';

        if (ln > 1) {
          for (var i = 1; i < ln; i++) {
            var oItem = oData.GRID0[i].split('|');
            sHtml += '<div class="swiper-slide item1" style="width: 2rem;" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '"><div class="box-item" style="background: url(' + oItem[oData.IMAGE_URL_INDEX] + ') center center / cover no-repeat;"></div></div>';
          }

          $('.hdzq-box .swiper-container1 .swiper-wrapper').html(sHtml);
        }

        var itemWidth = $('.hdzq-box .box-item').width() + 1;
        var items = $('.hdzq-box .box-item').length;
        var scrollWidth = items * itemWidth + items * 12 + 5;
      }

      var swiper1 = new Swiper('.swiper-container1', {
        slidesPerView: 'auto',
        spaceBetween: 10
      });
    }
  });
}

function HDZQEvent() {
  $('.hdzq-box .swiper-container1 .swiper-wrapper').delegate('.swiper-slide', 'click', function () {
    T.fn.action10061({
      url: $(this).attr('data-url')
    });
  });
}

function getNRGD() {
  var oSend1106416 = {
    action: '49245',
    ReqlinkType: 2,
    funcNo: '1106416',
    dataType: "json",
    method: 'post'
  };
  $.getData({
    oSendData: oSend1106416,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      if (data) {
        if (data.DATA) {
          $('.nrgd').show();
          testIp = data.ERRORMESSAGE;
          var data = $.parseJSON(data.DATA);
          var data1 = $.parseJSON(data);
          var ln = data1.length;
          var itemHtml = '';
          var itemLocation = ['牛人观点位置一', '牛人观点位置二', '牛人观点位置三'];

          for (var i = 0; i < 3; i++) {
            itemHtml += '<div class="swiper-slide" style="width: 2rem; margin-right: 10px;">' + '<div class="box-item box-item1" data-location="' + itemLocation[i] + '"  style="height:1.05rem;" data-id="' + data1[i].view_id + '">' + '<div class="nr_bg"></div><p class="box-title"><span class="title-img">' + '</span><span class="title-name">' + data1[i].invest_name + '</span></p>' + '<p class="box-content">' + data1[i].title + '</p>' + '<p class="box-introdution">' + data1[i].introdution + '</p></div></div>';
          }

          $('.nrgd-box .swiper-wrapper').html(itemHtml);
          $('.nrgd-box .box-item').each(function (i, item) {
            var that = $(this);
            that.find('.title-img').css({
              'background': 'url(' + testIp + data1[i].face_image_small + ')',
              'background-size': '100% 100%'
            });
          });
          var swiper_nrgd = new Swiper('.swiper-container-nrgd', {
            slidesPerView: 'auto',
            spaceBetween: 10
          });
        } else {
          $('.nrgd').hide();
        }
      }
    },
    oConfig: function oConfig(data) {
      $('.nrgd').hide();
    }
  });
}

function NRGDEvent() {
  //跳转观点列表
  $('.nrgd').delegate('.nrgd-title', 'click', function () {
    //var url = testIp + '/m/ytg/views/loadPage.html?toPagecode=point/index&source_id=hzzz';
    //牛人观点事件埋点
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '牛人观点',
      'second_list_type': '列表',
      'second_list_name': '牛人观点'
    }); // 首页栏位点击-牛人观点-更多

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '牛人观点',
      column_name: '牛人观点-更多',
      column_no: ''
    });
    var url = testIp + '/m/app/#/?toPagecode=viewpoint&source_id=hzzz';
    tgFunc(url);
  }); //跳转观点详情

  $('.nrgd').delegate('.box-item', 'click', function () {
    //牛人观点事件埋点
    var location = $(this).attr('data-location');
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '牛人观点',
      'second_list_type': '列表位置',
      'second_list_name': location
    }); // 首页栏位点击-牛人观点

    pageSensors.reportClick('mainPageColumnClick', {
      column_name: location,
      column_no: $(this).index()
    });
    var id = $(this).data('id'); //var url = testIp + '/m/ytg/views/loadPage.html?toPagecode=point/detail&view_id=' + id + '&source_id=hzzz';

    var url = testIp + '/m/app/#/?toPagecode=viewDetail&view_id=' + id + '&source_id=hzzz';
    tgFunc(url);
  });
}

function getGPZH() {
  var oSend1106331 = {
    action: '49245',
    ReqlinkType: 2,
    funcNo: '1106331',
    orderType: 38,
    numPerPage: 3,
    method: 'post'
  };
  $.getData({
    oSendData: oSend1106331,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      if (data) {
        if (data.DATA) {
          $('.gpzh').show();
          var data = $.parseJSON(data.DATA);
          var data1 = $.parseJSON(data);
          var oData = data1[0].data;
          var ln = oData.length;
          var itemHtml = '';
          var itemLocation = ['股票组合位置一', '股票组合位置二', '股票组合位置三'];

          for (var i = 0; i < ln; i++) {
            var profit = parseFloat(oData[i].recent_week_yield); //近七日收益率

            var str = oData[i].new_trade_time;
            var time = '--';

            if (str != '') {
              time = str.slice(0, 4) + '/' + str.slice(4, 6) + '/' + str.slice(6, 8) + ' ' + str.slice(8, 13); //格式化日期
            }

            itemHtml += '<div class="box-item" data-location="' + itemLocation[i] + '" data-id="' + oData[i].portfolio_id + '"><div class="box-left">';

            if (profit >= 0) {
              itemHtml += '<p>' + (profit * 100).toFixed(2) + '%</p><span>近7日收益率</span>';
            } else {
              itemHtml += '<p style="color:#02B88D">' + (profit * 100).toFixed(2) + '%</p><span>近7日收益率</span>';
            }

            itemHtml += '</div><div class="box-right"><p class="right-title">' + oData[i].portfolio_name + '</p><p class="right-label"><i style="background:#F6A623;">' + oData[i].oper_style + '</i></p><p class="right-create"><span>' + oData[i].user_name + '<em> 创建</em></span></p><p class="right-time">最近操作：' + time + '</p></div></div>';
          }

          $('.gpzh .gpzh-box').html(itemHtml);
        } else {
          $('.gpzh').hide();
        }
      }
    },
    oConfig: function oConfig(data) {
      $('.gpzh').hide();
    }
  });
}

function GPZHEvent() {
  $('.gpzh').delegate('.gpzh-title', 'click', function () {
    //var url = testIp + '/m/ytg/views/loadPage.html?toPagecode=portfolio/index&source_id=hzzz';
    //股票组合事件埋点
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '股票组合',
      'second_list_type': '列表',
      'second_list_name': '股票组合'
    }); // 首页栏位点击-股票组合-更多

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '股票组合',
      column_name: '股票组合-更多',
      column_no: ''
    });
    var url = testIp + '/m/app/#/?toPagecode=combine&source_id=hzzz';
    tgFunc(url);
  }); //跳转组合详情

  $('.gpzh .gpzh-box').delegate('.box-item', 'click', function () {
    //股票组合列表事件埋点
    var location = $(this).attr('data-location');

    if (location) {
      track.sensors.track('second_list_click', {
        'bottomtabbar_name': '探索',
        'toptabbar_name': '首页',
        'first_list_name': '股票组合',
        'second_list_type': '列表位置',
        'second_list_name': location
      }); // 首页栏位点击-股票组合

      pageSensors.reportClick('mainPageColumnClick', {
        column_type: '股票组合',
        column_name: location,
        column_no: $(this).index()
      });
    }

    var id = $(this).data('id'); //var url = testIp + '/m/ytg/views/loadPage.html?toPagecode=portfolio/Detail&portfolio_id=' + id + '&source_id=hzzz';

    var url = testIp + '/m/app/#/?toPagecode=combineDetail&portfolio_id=' + id + '&source_id=hzzz';
    tgFunc(url);
  });
}

function getLCJJ() {
  var oSendData = {
    'action': '41500',
    'type': 'LCJDT',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      if (data.ERRORNO >= 0) {
        var oData = data.GRID0;
        var ln = oData.length;
        var sHtml = '';
        var all_url = data.IMAGE_ALL_URL_INDEX; //图片完整路径

        var img_url = data.IMAGE_URL_INDEX; //图片路径

        var url = data.IMAGE_CLICK_INDEX;

        if (ln > 1) {
          $('.zhuanqu').children().each(function (i, item) {
            var that = $(this);
            var oItem = oData[i + 1].split('|');
            that.css('background', 'url(' + oItem[img_url] + ') no-repeat center / contain');
            that.attr("data-url", oItem[url]);
          });
        }
      }
    }
  });
}

function LCJJEvent() {
  $('.zhuanqu').delegate('.tztui-grid', 'click', function () {
    var url = $(this).attr('data-url');
    var name = url.indexOf('jj') > -1 ? '基金专区' : url.indexOf('sy') > -1 ? '理财专区' : ''; //快捷菜单事件埋点

    if (name) {
      track.sensors.track('second_list_click', {
        'bottomtabbar_name': '探索',
        'toptabbar_name': '首页',
        'first_list_name': '专区',
        'second_list_type': 'icon',
        'second_list_name': name
      }); // 首页栏位点击-股票组合

      pageSensors.reportClick('mainPageColumnClick', {
        column_type: '理财专区',
        column_name: name,
        column_no: $(this).index()
      });
    }

    T.fn.changeurl(url);
  });
} //热门题材掘金


function getRMJJ() {
  var oSendData = {
    'action': '41500',
    'type': '',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      if (data.ERRORNO >= 0) {
        var oData = data.GRID0;
        var ln = oData.length;
        var sHtml = '';
        var all_url = data.IMAGE_ALL_URL_INDEX; //图片完整路径

        var img_url = data.IMAGE_URL_INDEX; //图片路径

        if (ln > 1) {}
      }
    }
  });
}

function dyjrFunc(thisurl) {
  //多元金融：传递客户身份3要素（姓名、证件类型和证件号码）给门户
  oCache.thisurl = thisurl;
  T.reqsofttodo({
    'hf_dyjrurl': thisurl
  }, function () {});
  var oSend = {
    action: '5',
    needToken: '0'
  };
  $.getData({
    oSendData: oSend,
    isToken: false,
    fnSuccess: function fnSuccess(oTime) {
      var serverTime = oTime.TIME; //服务器时间

      var timeStr = serverTime.replace(/-/g, '/') + ' GMT+8'; //转为UTC时间

      oCache.serverTime = new Date(timeStr).getTime();
      var oSend = {
        action: '46200',
        ReqlinkType: 2
      };
      $.getData({
        oSendData: oSend,
        fnSuccess: function fnSuccess(oData) {
          T.readLocalMesg(['jyloginflag', 'logintype=1', 'UserName', 'IDType', 'IDNO'], function (oLocal) {
            oCache.UserName = oLocal.USERNAME;
            oCache.IDType = oLocal.IDTYPE;
            oCache.IDNO = oLocal.IDNO;
            oCache.PUBLICK_KEY = oData.DYJR, oCache.MD5_KEY = oData.MD5KEY;

            if (oLocal.JYLOGINFLAG <= 1) {
              //未登录
              var str = JSON.stringify({
                sn: 'A02',
                from: '12',
                time: oCache.serverTime
              });
              var senddata = encryptRsa(oCache.PUBLICK_KEY, oCache.MD5_KEY, str);
              var url = thisurl + '?from=12&data=' + encodeURIComponent(senddata.data) + '&mac=' + encodeURIComponent(senddata.mac);
              T.fn.action10061({
                url: url,
                fullscreen: '1',
                tzthiddentitle: '1'
              });
            } else {
              //已登录
              hfReadLocalFile("dyjrauthorizeFile", "hfReadLocalFileSyCallBack");
              /*if (true) {//该账号已授权
                                    } else {//该账号未授权
                                       var str = JSON.stringify({sn:'A01',from:'12',certType:oCache.IDType,certNo:oCache.IDNO,custName: oCache.UserName,time:oCache.serverTime});
                                       var senddata = encryptRsa(oCache.PUBLICK_KEY,oCache.MD5_KEY,str);//处理rsa和md5key
                                       var url = oCache.thisurl+'?from=12&data=' + encodeURIComponent(senddata.data) + '&mac=' + encodeURIComponent(senddata.mac);
                                       T.fn.action10061({url:url,fullscreen:'1',tzthiddentitle:'1'});
                                   }*/
            }
          });
        }
      });
    }
  });
} //本地读取授权标识//多元金融


window.hfReadLocalFile = function (fileName, callbackName) {
  if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
    window.webkit.messageHandlers.cibApp.postMessage({
      type: 'hfReadLocalFile',
      fileName: fileName,
      func: callbackName
    });
  } else {
    window.MyWebView.setContentParams('hfReadLocalFile', '{fileName:' + fileName + ', func: ' + callbackName + '}');
  }
}; //本地读取授权标识回调//多元金融


window.hfReadLocalFileSyCallBack = function (data) {
  T.readLocalMesg(['usercode'], function (oLocal) {
    var usercode = oLocal.USERCODE;

    if (data.indexOf(usercode) > -1) {
      //已授权
      var str = JSON.stringify({
        sn: 'A01',
        from: '12',
        certType: oCache.IDType,
        certNo: oCache.IDNO,
        custName: oCache.UserName,
        time: oCache.serverTime
      });
      var senddata = encryptRsa(oCache.PUBLICK_KEY, oCache.MD5_KEY, str); //处理rsa和md5key

      var url = oCache.thisurl + '?from=12&data=' + encodeURIComponent(senddata.data) + '&mac=' + encodeURIComponent(senddata.mac);
      T.fn.action10061({
        url: url,
        fullscreen: '1',
        tzthiddentitle: '1'
      });
    } else {
      //未授权
      var str = JSON.stringify({
        sn: 'A02',
        from: '12',
        time: oCache.serverTime
      });
      var senddata = encryptRsa(oCache.PUBLICK_KEY, oCache.MD5_KEY, str);
      var url = oCache.thisurl + '?from=12&data=' + encodeURIComponent(senddata.data) + '&mac=' + encodeURIComponent(senddata.mac);
      T.fn.action10061({
        url: url,
        fullscreen: '1',
        tzthiddentitle: '1'
      });
    }
  });
};

function wtFunc(dz) {
  var oSend = {
    action: '5',
    needToken: '0'
  };
  var oSendData = {
    action: 6771,
    ReqlinkType: '1'
  };
  $.getData({
    oSendData: oSendData,
    fnSuccess: function fnSuccess(reg) {
      var SERVTICKET_ID = reg.SERVTICKET_ID;
      var oSend46201 = {
        action: '46201',
        ReqlinkType: 2
      };
      $.getData({
        oSendData: oSend46201,
        fnSuccess: function fnSuccess(oWt) {
          var url = oWt[dz];

          if (SERVTICKET_ID == '' || !SERVTICKET_ID) {
            T.fn.action10061(url);
          } else {
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
                  fnSuccess: function fnSuccess(oData) {
                    var PUBLICK_KEY = oData.WSYYT,
                        MD5_KEY = oData.HSSTRING;
                    var str = JSON.stringify({
                      token: SERVTICKET_ID,
                      from: 'sidi',
                      time: serverTime
                    });
                    var senddata = encryptRsa2(PUBLICK_KEY, MD5_KEY, str);
                    var oUrl = url + '&data=' + senddata.data;

                    if (dz == 'WSYYT') {
                      var oUrl = url + '?data=' + senddata.data;
                    } else {
                      var oUrl = url + '&data=' + senddata.data;
                    }

                    T.fn.changeurl('http://action:58117/?url=' + encodeURIComponent(oUrl));
                  }
                });
              }
            });
          }
        }
      });
    }
  });
}

function tgFunc(url) {
  T.readLocalMesg(['jyloginflag', 'logintype=1', 'MOBILECODE', 'usercode'], function (oLocal) {
    var MOBILECODE = oLocal.MOBILECODE;
    var USERCODE = oLocal.USERCODE;

    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      //console.log(url);
      T.fn.action10061({
        url: url,
        'tzthiddentitle': '1',
        'tztadjustnever': '1'
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
              fnSuccess: function fnSuccess(oData) {
                var PUBLICK_KEY = oData.TG,
                    MD5_KEY = oData.HSSTRING;
                var str = JSON.stringify({
                  mobile: MOBILECODE,
                  from: 'sidi',
                  time: serverTime
                }); //处理rsa和md5key

                var senddata = encryptRsaTg(PUBLICK_KEY, MD5_KEY, str);
                var oUrl = url + '&data=' + encodeURIComponent(senddata.data); //console.log(oUrl);
                //console.log(senddata.data);

                if (T.appversion.andriod()) {
                  T.fn.action10061({
                    url: url + '&data=' + encodeURIComponent(encodeURIComponent(senddata.data)),
                    'tzthiddentitle': '1',
                    'tztadjustnever': '1'
                  });
                } else {
                  T.fn.action10061({
                    url: oUrl,
                    'tzthiddentitle': '1',
                    'tztadjustnever': '1'
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
            /*if(oLocal.JYLOGINFLAG <=1){ //未登录
                                  T.fn.action10061({url:url,'tzthiddentitle':'1','tztadjustnever':'1'});
                              }else{*/

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
                        'tzthiddentitle': '1',
                        'tztadjustnever': '1'
                      });
                    } else {
                      T.fn.action10061({
                        url: oUrl,
                        'tzthiddentitle': '1',
                        'tztadjustnever': '1'
                      });
                    }
                  }
                });
              }
            });
            /*}*/
          }
        });
      }
    }
  });
}

window.backxl = function () {
  zdf_arr = []; //今日风口主题涨跌幅数据

  jrfk_data = ''; //今日风口主题数据

  jrfk_oData = ''; //今日风口主题数据

  ts_info = ''; //推送消息数据

  getkx724(); //7*24快讯

  getFNJP(); //福牛接盘
  //getJRFK(); //今日风口

  getJRGZ(); //今日关注

  getBanner();
  getKJCD(); //快捷菜单

  getGDXX();
  getNRGD(); //牛人观点
  //getHDZQ();HDZQEvent(); //活动专区

  if ($('.chosetj').hasClass('active')) {
    getTuijian();
  }

  mescroll.endSuccess();

  for (var each in pageTimer) {
    //清除页面timeout
    clearTimeout(pageTimer[each]);
  }

  pageTimer["timer1"] = setTimeout(function () {
    getGPZH(); //股票组合

    getLCJJ(); //理财基金

    getJRFK();
    $('.moreScroll').removeClass('scrollNone');
  }, 2000);
  cybSignOpen(); //创业板弹窗功能
};

window.changeZC = function () {
  var oSend = {
    url: '/zt/zt_money.html',
    tzthiddentitle: 1,
    tztadjustnever: 1
  };
  T.fn.action10061(oSend);
};

var mescroll = new MeScroll("mescroll", {
  down: {
    callback: backxl,
    use: true,
    auto: false
  }
});

function encryptRsa(publickkey, md5key, str) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publickkey);
  var encrypted = encrypt.encrypt(str); //rsa加密

  var data = encrypt.debase64(encrypted); //把base64转成16进制

  var mac = md5('from12data' + data + md5key);
  return {
    data: data,
    mac: mac
  };
}

function encryptRsa2(publickkey, md5key, str) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publickkey);
  var encrypted = encrypt.encrypt(str); //rsa加密

  var odata = encrypt.debase64(encrypted); //把base64转成16进制

  return {
    data: encrypted
  };
}

function encryptRsa3(publickkey, md5key, str) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publickkey); // var encrypted = encrypt.encrypt(str);//rsa加密
  // var data = encrypt.debase64(str);//把base64转成16进制

  var data = encrypt.enbase64(str); //把base64转成16进制

  var mac = md5('from12data' + data + md5key);
  return {
    data: data,
    mac: mac
  };
}

function encryptRsaTg(publickkey, md5key, str) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publickkey);
  var encrypted = encrypt.encryptLong(str); //rsa加密

  return {
    data: encrypted
  };
}

Array.prototype.chunk = function (len) {
  //将数组分割为以四个一组
  var len = parseInt(len);
  if (len <= 1 || this.length < len) return this;
  var groups = [],
      loop = Math.ceil(this.length / len);

  for (var i = 0; i < loop; i++) {
    groups.push(this.slice(len * i, len * (i + 1)));
  }

  return groups;
};

function dateStr2(date) {
  var nowDate = new Date();
  var time = nowDate.getTime();
  var nowyear = nowDate.getFullYear();
  var year = date.substr(0, 4);
  var month = Number(date.substr(4, 2));
  var day = Number(date.substr(6, 2));
  var hour = Number(date.substr(8, 2));
  var minute = Number(date.substr(10, 2));
  var second = Number(date.substr(12, 2));
  var newDate = new Date(year, month - 1, day, hour, minute, second).getTime();
  time = parseInt((time - newDate) / 1000);
  /*if (isToday(year+'-'+month+'-'+day)) {
         return date.substr(8,2)+':'+date.substr(10,2);
     }else if (year == nowyear) {
         /!*return date.substr(4,2)+'-'+date.substr(6,2)+' '+date.substr(8,2)+':'+date.substr(10,2);*!/
         return date.substr(4,2)+'-'+date.substr(6,2);
     }else{
         /!*return year+'-'+date.substr(4,2)+'-'+date.substr(6,2)+' '+date.substr(8,2)+':'+date.substr(10,2);*!/
         return year;
     }*/

  if (isToday(year + '-' + month + '-' + day)) {
    return date.substr(8, 2) + ':' + date.substr(10, 2);
  } else {
    if (time < 60 * 60 * 24 * 4) {
      //少于4天内/*(time<60*60*24*4)&&(time>=60*60*24)*/
      var s = Math.round(time / 60 / 60 / 24);
      return s + "天前";
    } else {
      //超过4天
      if (year == nowyear) {
        return date.substr(4, 2) + '-' + date.substr(6, 2);
      } else {
        return year;
      }
    }
  }
}

function formatDate(date, str) {
  var mat = {};
  mat.M = date.getMonth() + 1; //月份记得加1

  mat.Y = date.getFullYear();
  mat.D = date.getDate();

  if (mat.M < 10) {
    mat.M = "0" + mat.M;
  }

  if (mat.D < 10) {
    mat.D = "0" + mat.D;
  }

  if (str.indexOf(":") > -1) {
    mat.Y = mat.Y.toString().substr(2, 2);
    return mat.Y + "/" + mat.M + "/" + mat.D;
  }

  if (str.indexOf("/") > -1) {
    return mat.Y + "/" + mat.M + "/" + mat.D;
  }

  if (str.indexOf("-") > -1) {
    return mat.Y + "-" + mat.M + "-" + mat.D;
  }
} //获取当前指定的前几天的日期


function getBeforeDate(n) {
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();

  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }

  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  s = year + "-" + (mon < 10 ? '0' + mon : mon) + "-" + (day < 10 ? '0' + day : day);
  return s;
}

function versionfunegt(version1, version2) {
  //华福版本号大小判断3.1.3
  var nowvers = version1.split('.'); //当前版本

  var hisvers = version2.split('.'); //历史版本

  if (Number(nowvers[0]) > Number(hisvers[0])) {
    return true;
  } else if (Number(nowvers[1]) > Number(hisvers[1])) {
    return true;
  } else {
    if (Number(nowvers[2]) > Number(hisvers[2])) {
      return true;
    } else {
      return false;
    }
  }
} //福牛解盘


function getFNJP() {
  var oSendData = {
    action: '50050',

    /*46118*/
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '20149',
    nPage: 1,
    maxcount: 10,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      //console.log("福牛解盘：",data)
      if (data && data.GRID0.length >= 1) {
        $('.fnjp').show();
        var oData = [],
            zbHtml = '',
            fpHtml = '',
            spHtml = '';

        for (var j = 0; j < data.GRID0.length; j++) {
          oData.push(data.GRID0[j].split('|'));
        }

        var itemHtml = '';
        itemHtml += '<div class="swiper-container-fnjp">\n' + '\t\t\t\t\t\t<div class="swiper-wrapper">';
        var oSendData = {
          action: 47100,
          ReqlinkType: 2,
          Type: "1,7,8",
          pageNum: 1,
          pageSize: 1,
          bigType: 'ZX'
        };
        $.getData({
          oSendData: oSendData,
          copyIsArray: false,
          isload: false,
          fnSuccess: function fnSuccess(data1) {
            var aGrid = data1.GRID0,
                sHtml = '',
                aTemp = [];
            var ln = aGrid.length; //console.log("早报111：",data1);

            var aData1 = aGrid[1].split('|');
            var obj = {
              "id": aData1[data1['ID_INDEX']],
              "date": aData1[data1['PUBLISHDATE_INDEX']].split(" ")[0],
              "title": aData1[data1['TITLE_INDEX']],
              "summary": aData1[data1['CRTAI_SUMMARY_INDEX']],
              "time": aData1[data1['PUBLISHDATE_INDEX']]
            };
            /*早报*/

            var zbTime = aData1[data1['PUBLISHDATE_INDEX']];

            if (isToday(zbTime)) {
              obj.time = obj.time.split(" ")[1];
              obj.time = obj.time.split(":")[0] + ":" + obj.time.split(":")[1];
            } else {
              obj.time = obj.time.split(" ")[0];
              obj.time = obj.time.split("-")[1] + "-" + obj.time.split("-")[2];
            }

            zbHtml = '<div class="swiper-slide" style="width: 1.523rem; margin-right: 0.11rem;">' + '<div class="box-item" data-id="' + obj.id + '">' + '<p class="box-title">' + '<span class="title-left xfzb">小福读报</span>' + '<span class="title-right">' + obj.time + '</span>' + '</p>' + '<p class="box-content">' + obj.title + '</p>' + '</div></div>';
            /*复盘*/

            var fpTime = '',
                fpDate = '',
                fp_timehtml = '';
            /**/

            var spTime = '',
                spDate = '',
                sp_timehtml = '';

            for (var k = 0; k < oData.length; k++) {
              if (oData[k][data.TYPE] == 0 && fpHtml == "") {
                //复盘
                fpDate = oData[k][data.DATE];
                fpTime = oData[k][data.TIME];
                var fpDateTime = fpDate + " " + fpTime; //fpDateTime = setDateTime(fpDateTime).format("yyyy-MM-dd hh:mm:ss");

                if (isToday(fpDateTime)) {
                  var fpTime1 = fpDateTime.split(" ")[1];
                  fp_timehtml = fpTime1.split(":")[0] + ":" + fpTime1.split(":")[1];
                } else {
                  var fpDate1 = fpDateTime.split(" ")[0];
                  fp_timehtml = fpDate1.split("-")[1] + "-" + fpDate1.split("-")[2];
                }

                fpHtml = '<div class="swiper-slide" style="width: 1.523rem; margin-right: 0.11rem;">' + '<div class="box-item" data-id="' + oData[k][data.INFOCODE] + '">' + '<p class="box-title">' + '<span class="title-left xffp">小福复盘</span>' + '<span class="title-right">' + fp_timehtml + '</span>' + '</p>' + '<p class="box-content">' + oData[k][data.TITLE] + '</p>' + '</div></div>';
              } else if (oData[k][data.TYPE] == 1 && spHtml == "") {
                //收评
                spDate = oData[k][data.DATE];
                spTime = oData[k][data.TIME];
                var spDateTime = spDate + " " + spTime; //spDateTime = setDateTime(spDateTime).format("yyyy-MM-dd hh:mm:ss");

                if (isToday(spDateTime)) {
                  var spTime1 = spDateTime.split(" ")[1];
                  sp_timehtml = spTime1.split(":")[0] + ":" + spTime1.split(":")[1];
                } else {
                  var spDate1 = spDateTime.split(" ")[0];
                  sp_timehtml = spDate1.split("-")[1] + "-" + spDate1.split("-")[2];
                }

                spHtml = '<div class="swiper-slide" style="width: 1.523rem; margin-right: 0.11rem;">' + '<div class="box-item" data-id="' + oData[k][data.INFOCODE] + '">' + '<p class="box-title">' + '<span class="title-left xfsp">小福收评</span>' + '<span class="title-right">' + sp_timehtml + '</span>' + '</p>' + '<p class="box-content">' + oData[k][data.TITLE] + '</p>' + '</div></div>';
              }
            }

            if (T.judge('ISIOS')) {
              zbTime = zbTime.replace(/-/g, "/");
              spDate = spDate.replace(/-/g, "/");
              fpDate = fpDate.replace(/-/g, "/");
            } //console.log("转换前：",zbTime,fpDate,spDate);


            var timeZB = new Date(zbTime),
                timeFP = new Date(fpDate + " " + fpTime),
                timeSP = new Date(spDate + " " + spTime); //console.log("转换后：",timeZB,timeFP,timeSP);

            if (timeZB > timeFP) {
              if (timeZB > timeSP) {
                itemHtml += zbHtml;

                if (timeSP > timeFP) {
                  itemHtml += spHtml + fpHtml;
                } else {
                  itemHtml += fpHtml + spHtml;
                }
              } else {
                itemHtml += spHtml + zbHtml + fpHtml;
              }
            } else {
              if (timeFP > timeSP) {
                itemHtml += fpHtml;

                if (timeSP > timeZB) {
                  itemHtml += spHtml + zbHtml;
                } else {
                  itemHtml += zbHtml + spHtml;
                }
              } else {
                itemHtml += spHtml + fpHtml + zbHtml;
              }
            } //itemHtml+=zbHtml+spHtml+fpHtml;


            itemHtml += '<div class="sfckgd-p"><div class="sfckgd">释放查看更多 <img src="./images/sf_right.png" alt=""></div></div>';
            itemHtml += '</div></div>';
            $('.fnjp').html(itemHtml); //$('.fnjp .swiper-wrapper').html(itemHtml);

            FNJPEvent();
            var swiper_fnjp = new Swiper('.swiper-container-fnjp', {
              slidesPerView: 'auto',
              spaceBetween: 10,
              slidesOffsetAfter: 5,
              onTouchEnd: function onTouchEnd(swiper, event) {
                var _slide = $(".fnjp .swiper-slide");

                var _width = _slide.width();

                if (_slide.length == 2) {
                  if (swiper.translate < -50) {
                    //onJsOverrideUrlLoading("http://action:11004?type=hf");

                    /*var oSend={ url: '/zx2/zx_lmt.html?type=hf'};
                    oSend.tzthiddentitle = 1;//客户端隐藏导航栏
                    oSend.tztadjustnever = 1;
                    T.fn.action10061(oSend);*/
                    T.fn.changeurl('http://action:58114/?TitleSkinType=1&&firsttext=资讯&&secondtext=数据&&rightfunctionname=rightfunc&&firsturl=/zx2/zx_list.html?type=fnjp&&secondurl=https://b2b-api.10jqka.com.cn/b2bgw/resource/h5/private/HFZQ/latest/home_newpage/home_newpage/index.html#/?ckey=608028110045');
                  }
                } else {
                  if (swiper.translate + _width < -50) {
                    //onJsOverrideUrlLoading("http://action:11004?type=hf");

                    /*var oSend={ url: '/zx2/zx_lmt.html?type=hf'};
                    oSend.tzthiddentitle = 1;//客户端隐藏导航栏
                    oSend.tztadjustnever = 1;
                    T.fn.action10061(oSend);*/
                    T.fn.changeurl('http://action:58114/?TitleSkinType=1&&firsttext=资讯&&secondtext=数据&&rightfunctionname=rightfunc&&firsturl=/zx2/zx_list.html?type=fnjp&&secondurl=https://b2b-api.10jqka.com.cn/b2bgw/resource/h5/private/HFZQ/latest/home_newpage/home_newpage/index.html#/?ckey=608028110045');
                  }
                }
              }
            });
          },
          oConfig: function oConfig(error) {
            console.log("早报接口报错：", error);
            $('.fnjp').hide();
          }
        });
      } else {
        $('.fnjp').hide();
      }
    },
    oConfig: function oConfig(error) {
      console.log("福牛接盘接口报错：", error);
      $('.fnjp').hide();
    }
  });
}

function FNJPEvent() {
  //跳转福牛解盘
  $('.fnjp .box-item').off().on('click', function () {
    //var url = testIp + '/m/ytg/views/loadPage.html?toPagecode=point/index&source_id=hzzz';
    //var url = testIp + '/m/app/#/?toPagecode=viewpoint&source_id=hzzz';
    //tgFunc(url);

    /*var oSend = {url:'/zx2/zx_fnjp.html'};
    T.fn.action10061(oSend);*/

    /*onJsOverrideUrlLoading("http://action:11004?type=fnjp");*/
    //onJsOverrideUrlLoading("http://action:11004?type=hf");
    var title = $(this).find('.title-left').text(); //小福复盘，小福收评，小福早报事件埋点

    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '资讯',
      'second_list_type': '详情',
      'second_list_name': title
    }); // 首页栏位点击-福牛解盘-栏目

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '今日风口',
      column_name: $(this).find('.box-content').text(),
      column_no: $(this).parent().index()
    });
    var oSend = {
      url: '/zx2/zx_lmt.html?type=hf'
    };
    oSend.tzthiddentitle = 1; //客户端隐藏导航栏

    oSend.tztadjustnever = 1; //T.fn.action10061(oSend);

    T.fn.changeurl('http://action:58114/?TitleSkinType=1&&firsttext=资讯&&secondtext=数据&&rightfunctionname=rightfunc&&firsturl=/zx2/zx_list.html?type=fnjp&&secondurl=https://b2b-api.10jqka.com.cn/b2bgw/resource/h5/private/HFZQ/latest/home_newpage/home_newpage/index.html#/?ckey=608028110045');
  });
} //今日风口


function getJRFK() {
  var oSendData = {
    action: '50052',
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '001',
    ReqLinkType: '2',
    nPage: 1,
    maxcount: 3
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      //console.log("今日风口-大涨解读：",data);
      if (data && data.GRID0.length >= 1) {
        $('.jrfk').show();
        var oData = [],
            oData1 = [];

        for (var j = 0; j < data.GRID0.length; j++) {
          oData.push(data.GRID0[j].split('|'));
        }

        jrfk_data = data;
        jrfk_oData = oData; //循环grid1

        /*for(var k=0;k<oData.length;k++){
        	if(data.PLATE_ID>0){
        		getZTXQ(oData[k][data.PLATE_ID],oData.length);
        	}
        }*/
        //console.log("主题涨跌幅数据：",zdf_arr)
        //板块描述

        var _bkms = '',
            bkmsIndex = data.PLATE_DESC; //主题对应股票

        var gpname = '',
            gpcode = '',
            gphtml = '';
        var itemHtml = '';
        itemHtml += '<div class="swiper-container-jrfk">\n' + '\t\t\t\t\t\t<div class="swiper-wrapper">';
        var itemLocation = ['今日风口位置一', '今日风口位置二', '今日风口位置三'];

        for (var i = 0; i < 3; i++) {
          gphtml = '<span class="left code" data-id="' + gpcode + '">' + gpname + '</span><span class="right range"> --</span>'; //关于涨幅等dom加载完后再获取

          var _gpZDF = oData[i][data.CORE_PCP],
              _gpZDFclass = '';

          if (_gpZDF > 0) {
            _gpZDF = "+" + parseFloat(_gpZDF).toFixed(2) + "%";
            _gpZDFclass = "zf";
          } else {
            _gpZDF = parseFloat(_gpZDF).toFixed(2) + "%";
            _gpZDFclass = "df";
          }

          itemHtml += '<div class="swiper-slide" style="width: 1.523rem; margin-right: 0.11rem;">\n' + '\t\t\t\t\t\t\t<div class="box-item box-item1" data-index="' + i + '" data-location="' + itemLocation[i] + '">\n' + '\t\t\t\t\t\t\t\t<div class="box-title">\n' + '\t\t\t\t\t\t\t\t\t<p class="title" data-id="' + oData[i][data.PLATE_ID] + '">' + oData[i][data.PLATE_NAME] + '</p>\n' + '\t\t\t\t\t\t\t\t\t<p class="value ' + _gpZDFclass + '">' + _gpZDF + '</p>\n' + '\t\t\t\t\t\t\t\t</div >\n' + '\t\t\t\t\t\t\t\t<div class="box-content">\n' + '\t\t\t\t\t\t\t\t\t<p class="content-top">' + _bkms + '</p>\n' + '\t\t\t\t\t\t\t\t\t<p class="content-bottom">' + gphtml + '</p>\n' + '\t\t\t\t\t\t\t\t</div >\n' + '\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t</div>';
        }

        itemHtml += '<div class="sfckgd-p"><div class="sfckgd">释放查看更多 <img src="./images/sf_right.png" alt=""></div></div>';
        itemHtml += '</div></div>';
        $('.jrfk .jrfk-box').html(itemHtml); //$('.jrfk .swiper-wrapper').html(itemHtml);

        /*$(".jrfk .content-bottom").each(function () {
        	getStock($(this).find(".code").attr("data-id"),$(this).find(".range"));
        });*/

        $(".jrfk .box-item .box-title").each(function () {
          var _id = $(this).find(".title").attr("data-id");

          var _dom1 = $(this).parent().find(".content-top");

          var _dom2 = $(this).parent().find(".range");

          getZTXQ(_id, _dom1, _dom2);
        });
        JRFKEvent();
        var swiper_jrfk = new Swiper('.swiper-container-jrfk', {
          slidesPerView: 'auto',
          spaceBetween: 10,
          slidesOffsetAfter: 5,
          onTouchEnd: function onTouchEnd(swiper, event) {
            //在最后一页继续拖动则释放跳转
            var _width = $(".jrfk .swiper-slide").width(); //console.log("跳转事件执行",swiper.translate,_width);


            if (swiper.translate + _width < -50) {
              //console.log("跳转")
              var oSend = {
                url: '/hq/jrfk.html'
              };
              T.fn.action10061(oSend);
            }
          }
        });
      } else {
        $('.jrfk').hide();
      }
    },
    oConfig: function oConfig(error) {
      console.log("今日风口接口报错：", error);
      $('.jrfk').hide();
    }
  });
}

function JRFKEvent() {
  //跳转今日风口模块
  $('.jrfk .more').off().on('click', function () {
    //今日风口事件埋点
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '今日风口',
      'second_list_type': '列表',
      'second_list_name': '今日风口'
    }); // 首页栏位点击-今日风口-栏目

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '今日风口',
      column_name: '今日风口-更多',
      column_no: ''
    });
    var oSend = {
      secondtype: 0,
      url: '/hq/jrfk.html'
    };
    T.fn.action10061(oSend);
  }); //跳转对应主题

  $('.jrfk .box-item').off().on('click', function () {
    //今日风口列表事件埋点
    var location = $(this).attr('data-location');
    var index = $(this).attr('data-index');
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '今日风口',
      'second_list_type': '列表位置',
      'second_list_name': location
    }); // 首页栏位点击-今日风口-栏目

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '今日风口',
      column_name: $(this).find('.content-top').text(),
      column_no: index
    });
    var sId = $(this).find(".title").attr('data-id');
    var obj = {
      'url': '/hq/zt_xq.html?id=' + sId + ''
    };
    var oSend = {
      url: obj.url
    };
    TZT.fn.action10061(oSend);
  });
} //今日关注


function getJRGZ() {
  var oSendData = {
    action: '50050',

    /*46118*/
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '20146',
    nPage: 1,
    maxcount: 10,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      //console.log("今日关注：",data);
      if (data && data.GRID0.length >= 1) {
        $('.jrgz').show();
        var oData = [];

        for (var j = 0; j < data.GRID0.length; j++) {
          oData.push(data.GRID0[j].split('|'));
        }

        var title = ["01", "02", "03"];
        var itemHtml = '';
        itemHtml += '<div class="swiper-container-jrgz">\n' + '\t\t\t\t\t\t<div class="swiper-wrapper">';
        var _ln = '';

        if (data.GRID0.length > 3) {
          _ln = 3;
        } else {
          _ln = data.GRID0.length;
        }

        var itemLocation = ['今日关注位置一', '今日关注位置二', '今日关注位置三'];

        for (var i = 0; i < _ln; i++) {
          oData[i][data.DATE] = setDateTime(oData[i][data.DATE]).format("yyyy-MM-dd hh:mm:ss");
          var timehtml = oData[i][data.DATE].split(" ")[1];
          timehtml = timehtml.split(":")[0] + ":" + timehtml.split(":")[1];
          var paiming = oData[i][data.HOT].trim();

          if (Number(paiming) < 10) {
            paiming = "0" + paiming;
          } //处理股票


          var gpData = oData[i][data.STOCKS],
              gphtml = ''; //gpData="首创股份,600008;飞乐音响,600651;飞乐音响1,600652";

          if (gpData) {
            gpData = gpData.split(";"); //还不确定是不是以分号,逗号区分，先默认分号,逗号;类似：（勤上股份,002638;飞乐音响,600651）

            for (var k = 0; k < gpData.length; k++) {
              if (k < 2) {
                //默认只取前两支股票
                gphtml += '<span><i class="code" data-market="' + gpData[k].split(',')[2] + '" data-id="' + gpData[k].split(',')[1] + '">' + gpData[k].split(',')[0] + '</i><i class="range"> --</i></span>'; //关于涨幅等dom加载完后再获取
              } else {
                break;
              }
            }
          }

          itemHtml += '<div class="swiper-slide" style="width: 2.864rem; margin-right: 0.11rem;">\n' + '\t\t\t\t\t\t\t<div class="box-item" data-index="' + i + '" data-location="' + itemLocation[i] + '" plate-id="' + Number(oData[i][data.PLATEID]).toFixed(0) + '" data-id="' + Number(oData[i][data.INFOCODE]).toFixed(0) + '">\n' + '\t\t\t\t\t\t\t\t<div class="box-title">\n' + '\t\t\t\t\t\t\t\t\t<span class="title-left">' + paiming + '<img src="./images/jrgz.png" alt="jrgz"></span>\n' + '\t\t\t\t\t\t\t\t\t<span class="title-mid">' + oData[i][data.FATTURED_TITLE] + '</span>\n' + '\t\t\t\t\t\t\t\t\t<span class="title-right">' + timehtml + '</span>\n' + '\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t\t<div class="box-content1">\n' + '\t\t\t\t\t\t\t\t\t<p class="content-top">' + oData[i][data.TITLE] + '</p>\n' + '\t\t\t\t\t\t\t\t\t<p class="content-bottom clear">' + gphtml + '</p>\n' + '\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t</div>';
          timehtml = null;
        }

        itemHtml += '<div class="sfckgd-p"><div class="sfckgd">释放查看更多 <img src="./images/sf_right.png" alt=""></div></div>';
        itemHtml += '</div></div>';
        $('.jrgz .jrgz-box').html(itemHtml); //$('.jrgz .swiper-wrapper').html(itemHtml);

        var jrgz_code_arr = [];
        $(".jrgz .content-bottom span").each(function () {
          //getStock($(this).find(".code").attr("data-id"),$(this).find(".range"));
          jrgz_code_arr.push($(this).find(".code").attr("data-id"));
        });
        getStock2(jrgz_code_arr);
        JRGZEvent();
        var swiper_jrgz = new Swiper('.swiper-container-jrgz', {
          slidesPerView: 'auto',
          spaceBetween: 10,
          slidesOffsetAfter: 5,
          onTouchEnd: function onTouchEnd(swiper, event) {
            //在最后一页继续拖动则释放跳转
            //console.log("跳转事件执行",swiper.translate,event);
            var _width = $(".jrgz-box .swiper-slide").width() * 2;

            if (swiper.translate + _width < -40) {
              //console.log("跳转")
              var oSend = {
                url: '/zx2/zx_chance.html'
              };
              T.fn.action10061(oSend);
              /*onJsOverrideUrlLoading("http://action:11004?type=jh");*/
            }
          }
        });
      } else {
        $('.jrgz').hide();
      }
    },
    oConfig: function oConfig(error) {
      console.log("今日关注接口报错：", error);
      $('.jrgz').hide();
    }
  });
}

function JRGZEvent() {
  //跳转机会模块
  $('.jrgz .more').off().on('click', function () {
    //今日关注事件埋点
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '今日关注',
      'second_list_type': '列表',
      'second_list_name': '今日关注'
    }); // 首页栏位点击-今日关注-更多

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '今日关注',
      column_name: '今日关注-更多',
      column_no: ''
    });
    var oSend = {
      url: '/zx2/zx_chance.html?'
    };
    T.fn.action10061(oSend);
    /*onJsOverrideUrlLoading("http://action:11004?type=jh");*/
  });
  $('.jrgz .box-item').off().on('click', function () {
    /*var sId = $(this).attr('data-id');
    var obj = {
    	'url':'/zx2/zx_zxxq.html?id=' + sId + '&&menu_id=001'+"&&type=hejzx"
    };
    var oSend = {url:obj.url};
    TZT.fn.action10061(oSend);*/
    //今日关注列表事件埋点
    var location = $(this).attr('data-location');
    var index = $(this).attr('data-index');

    if (location) {
      track.sensors.track('second_list_click', {
        'bottomtabbar_name': '探索',
        'toptabbar_name': '首页',
        'first_list_name': '今日关注',
        'second_list_type': '列表位置',
        'second_list_name': location
      });
    } // 首页栏位点击-栏目-更多


    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '今日关注',
      column_name: $(this).find('.content-top').text(),
      column_no: index
    });
    var sId = $(this).attr('plate-id');
    var obj = {
      'url': '/hq/zt_xq.html?id=' + sId + ''
    };
    var oSend = {
      url: obj.url
    };
    TZT.fn.action10061(oSend);
  }); //跳转个股行情页

  $('.jrgz .content-bottom span').off().on('click', function (event) {
    T.stopBubble();
    var stockcode = $(this).find(".code").attr('data-id');
    var stocktype = $(this).find(".code").attr('data-market');
    onJsOverrideUrlLoading("http://action:12051/?stockcode=" + stockcode + "&&stocktype=" + stocktype);
  });
}
/*获取7*24快讯*/


function getkx724(num) {
  kx724Flag = 0;
  var oSendData = {
    action: '50050',

    /*46118*/
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '20145',
    nPage: 1,
    maxcount: 3,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      //console.log("7*24快讯：",data)
      var oData = data.GRID0,
          sHtml = '';
      sHtml += '<div class="swiper-container-724kx">\n' + '\t\t\t\t\t\t<div class="swiper-wrapper" style="height: 0.48rem;">';

      if (oData && oData.length >= 1) {
        /*var timehtml=aGrid[data.DATE].split(' ')[1];*/
        for (var i = 0; i < oData.length; i++) {
          var aGrid = oData[i].split('|');
          var timehtml = aGrid[data.DATE];
          timehtml = setDateTime(timehtml).format("yyyy-MM-dd hh:mm:ss");
          timehtml = timehtml.split(" ")[1].split(":")[0] + ":" + timehtml.split(" ")[1].split(":")[1];
          /*timehtml=timehtml.split(":")[0]+':'+timehtml.split(":")[1];*/

          /*sHtml += '<span class="title-top">'+timehtml+'</span><span class="title-bottom">'+aGrid[data.TITLE]+'</span>'*/

          sHtml += '<div class="swiper-slide" style="height: 0.48rem"><span class="title-top">' + timehtml + '</span><span class="title-bottom">' + aGrid[data.TITLE] + '</span></div>';
        }
      } else {
        /*sHtml = '<div class="noZX" style="display: block;"><span class="nodata"></span><p>暂无数据</p></div>';*/
      }

      sHtml += "</div></div>";
      /*if(num&&num==1){
      	$('.kx724 .home_new-list-title-right').append(sHtml);
      	lbKx724(num)
      }else{
      	$('.kx724 .home_new-list-title-right').html(sHtml);
      	lbKx724()
      }*/
      //kx724Event();
      //var kx724Timer=setTimer(lbKx724, 2000);
      //lbKx724()

      $('.kx724 .home_new-list-title-right').html(sHtml); //$('.kx724 .home_new-list-title-right .swiper-wrapper').html("");
      // $('.kx724 .home_new-list-title-right .swiper-wrapper').attr("style","height: 0.48rem");
      // $('.kx724 .home_new-list-title-right .swiper-wrapper').html(sHtml);
      // console.log("111",swiper_724kx);

      var swiper_724kx = new Swiper('.swiper-container-724kx', {
        /*slidesPerView :'auto',*/
        autoplay: 3000,
        autoplayStopOnLast: true,
        direction: 'vertical',
        grabCursor: true,
        autoplayDisableOnInteraction: false,
        mousewheelControl: true,
        autoHeight: true,
        speed: 800,
        onSlideChangeEnd: function onSlideChangeEnd(swiper) {
          if (2 == swiper.activeIndex) {
            //执行事件
            setTimeout(function () {
              getkx724();
            }, 2000);
          }
        }
      });
    }
  });
}

;

function lbKx724(num) {
  $('.kx724 .home_new-list-title-right div').animate({
    top: -kx724Flag * 0.48 + "rem"
  }, 1500);

  if (kx724Flag < 2) {
    kx724Flag++;
    pageTimer["timer2"] = setTimeout(function () {
      lbKx724();
    }, 4000);
  } else {
    //clearTimer(kx724Timer);
    pageTimer["timer3"] = setTimeout(function () {
      getkx724();
    }, 4000);
  }
}

function kx724Event() {
  //快讯7*24
  $('.kx724 .home_new-list-title').off('click').on('click', function () {
    //onJsOverrideUrlLoading("http://action:11004?type=724");
    //7*24快讯事件埋点
    track.sensors.track('second_list_click', {
      'bottomtabbar_name': '探索',
      'toptabbar_name': '首页',
      'first_list_name': '资讯',
      'second_list_type': '列表',
      'second_list_name': '7*24快讯'
    }); // 首页栏位点击-7*24快讯

    pageSensors.reportClick('mainPageColumnClick', {
      column_type: '7*24快讯',
      column_name: '7*24快讯-更多',
      column_no: ''
    });
    var oSend = {
      url: '/zx2/zx_lmt.html?type=724'
    };
    oSend.config = {
      tzthiddentitle: '1',
      tztadjustnever: '1'
    }; //T.fn.action10061(oSend);

    T.fn.changeurl('http://action:58114/?TitleSkinType=1&&firsttext=资讯&&secondtext=数据&&rightfunctionname=rightfunc&&firsturl=/zx2/zx_list.html?type=724&&secondurl=https://b2b-api.10jqka.com.cn/b2bgw/resource/h5/private/HFZQ/latest/home_newpage/home_newpage/index.html#/?ckey=608028110045');
  });
}

;
/*处理格林尼治时间*/

function setDateTime(fnTime) {
  var x = fnTime; // 取得时间"2017-07-08 13:00:00"

  if (!T.judge('ISIOS')) {
    x = fnTime;
  } else {
    //处理下，ios转换有问题
    x = fnTime.replace(/-/g, '/');
  }

  var time = new Date(x);
  var timeNum = 8; //小时数

  time.setHours(time.getHours() + timeNum);
  return time;
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    //月份
    "d+": this.getDate(),
    //日
    "h+": this.getHours(),
    //小时
    "m+": this.getMinutes(),
    //分
    "s+": this.getSeconds(),
    //秒
    "q+": Math.floor((this.getMonth() + 3) / 3),
    //季度
    "S": this.getMilliseconds() //毫秒

  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }

  return fmt;
};
/*获取股票涨跌幅*/


function getStock(stockcode, oDom) {
  if (stockcode) {
    var oSendData = {
      Action: 60,
      grid: stockcode,
      NewMarketNo: 1,
      ReqlinkType: 2,
      maxCount: 100,
      AccountIndex: 0,
      StockIndex: 1
    };
    $.getData({
      oSendData: oSendData,
      copyIsArray: false,
      isload: false,
      fnSuccess: function fnSuccess(data) {
        //console.log("股票：",data.GRID0[1].split("|")[data.UPDOWNPINDEX]);
        var _zdf = data.GRID0[1].split("|")[data.UPDOWNPINDEX],
            zdClass = "";

        if (Number(_zdf.replace("%", "")) > 0) {
          //判断股票是涨幅还是跌幅
          zdClass = "zf";
          _zdf = "+" + _zdf;
        } else {
          zdClass = "df";
        } //console.log(oDom,oDom.parent())


        oDom.parent().addClass(zdClass);
        oDom.html(_zdf);
      }
    });
  } else {
    return null;
  }
}

;
/*今日风口获取股票涨跌幅*/

function getStock1(stockcode, oDom) {
  if (stockcode) {
    var oSendData = {
      Action: 60,
      grid: stockcode.join(','),
      NewMarketNo: 1,
      ReqlinkType: 2,
      maxCount: 100,
      AccountIndex: 0,
      StockIndex: 1
    };
    $.getData({
      oSendData: oSendData,
      copyIsArray: false,
      isload: false,
      fnSuccess: function fnSuccess(data) {
        //console.log("股票：",data,data.GRID0[1].split("|")[data.UPDOWNPINDEX]);return;
        var _zdf = data.GRID0[1].split("|")[data.UPDOWNPINDEX],
            zdClass = "";

        if (Number(_zdf.replace("%", "")) > 0) {
          //判断股票是涨幅还是跌幅
          zdClass = "zf";
          _zdf = "+" + _zdf;
        } else {
          zdClass = "df";
        } //console.log(oDom,oDom.parent());


        oDom.parent().addClass(zdClass);
        oDom.html(_zdf);
        oDom.parent().find(".code").attr("date-id", data.GRID0[1].split("|")[data.STOCKCODEINDEX]);
        var _name = data.GRID0[1].split("|")[data.STOCKNAMEINDEX];

        if (_name.indexOf(".") > -1) {
          _name = _name.split(".")[1];
        }

        oDom.parent().find(".code").html(_name);
      }
    });
  } else {
    return null;
  }
}

;
/*今日关注获取股票涨跌幅*/

function getStock2(stockcode) {
  if (stockcode) {
    var oSendData = {
      Action: 60,
      grid: stockcode.join(','),
      NewMarketNo: 1,
      ReqlinkType: 2,
      maxCount: 100,
      AccountIndex: 0,
      StockIndex: 1
    };
    $.getData({
      oSendData: oSendData,
      copyIsArray: false,
      isload: false,
      fnSuccess: function fnSuccess(data) {
        for (var i = 1; i < data.GRID0.length; i++) {
          var oData = data.GRID0[i].split("|");
          var _zdf = oData[data.UPDOWNPINDEX],
              zdClass = "";

          if (Number(_zdf.replace("%", "")) > 0) {
            //判断股票是涨幅还是跌幅
            zdClass = "zf";
            _zdf = "+" + _zdf;
          } else if (Number(_zdf.replace("%", "")) < 0) {
            zdClass = "df";
          }

          $(".jrgz .code").each(function () {
            if ($(this).attr("data-id") == oData[data.STOCKCODEINDEX]) {
              $(this).next().html(_zdf);
              $(this).parent().addClass(zdClass);
            }
          });
        }
      }
    });
  } else {
    return null;
  }
}

; // 主题详情

function getZTXQ(id, dom1, dom2) {
  var oSendData = {
    action: '50052',
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '005',
    ReqLinkType: '2',
    nPage: 1,
    maxcount: 10,
    plate_id: id
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      //console.log("主题详情：",data)
      if (data && data.GRID0.length >= 1) {
        var oData = data.GRID0[0].split('|');
        var codeArr = [];

        for (var i = 0; i < data.GRID0.length; i++) {
          var oData1 = data.GRID0[i].split('|');
          codeArr.push(oData1[data.STOCK_CODE]);

          if (i == data.GRID0.length - 1) {
            getStock1(codeArr, dom2);
          }
        }

        dom1.html(oData[data.PLATE_DESC]);
      } else {//暂无数据
      }
    },
    oConfig: function oConfig(error) {
      console.log("主题详情接口报错：", error);
    }
  });
}
/*
window.GoBackOnLoad=function(){
	console.log("manage--页面返回加载？？？")
}*/
// 综台配置营销活动页  一次性使用，后续废弃


function getActivityUrl(url, typeName) {
  var dataUrl = url; //活动链接

  var typeName = typeName; //活动类型

  if (typeName && typeName == 'zqbb') {
    //总行中秋博饼活动
    var appid = T.getUrlParameter('appid', dataUrl);
    var activityUrl = dataUrl.substring(0, dataUrl.indexOf('?')) + '?appid=' + appid; //活动页地址

    T.readLocalMesg(['MOBILECODE'], function (oLocal) {
      var MOBILECODE = oLocal.MOBILECODE;

      if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
        //未登录手机号
        T.saveMapMesg({
          xyActivityUrl: activityUrl
        }, function () {
          //由于58130无回调函数，因此增加过渡页面来加密参数
          if (T.appversion.andriod()) {
            T.fn.changeurl('http://action:58130/?type=9&&url=' + encodeURIComponent('home_new/xyzqbb.html'));
          } else {
            T.fn.action10061('home_new/xyzqbb.html');
          }
        });
      } else {
        //已登录手机号
        setActivityUrl(activityUrl);
      }
    });
  }
}

function setActivityUrl(activityUrl) {
  var oSend = {
    action: 46201,
    ReqLinkType: 2
  };
  T.readLocalMesg(['TZTZTLOGINUSERNAME', 'MOBILECODE'], function (oLocal) {
    var objData = {
      'mobile': oLocal.MOBILECODE,
      'realName': oLocal.TZTZTLOGINUSERNAME
    };
    var content = JSON.stringify(objData);
    $.getData({
      oSendData: oSend,
      fnSuccess: function fnSuccess(data) {
        var ActivePrivateKey = data.ACTIVEPRIVATEKEY; //key不足24位自动以0(最小位数是0)补齐,如果多余24位,则截取前24位,后面多余则舍弃掉

        var base64 = CryptoJS.enc.Utf8.parse(ActivePrivateKey);
        var encrypt = CryptoJS.TripleDES.encrypt(content, base64, {
          mode: CryptoJS.mode.ECB,
          //ECB模式
          padding: CryptoJS.pad.Pkcs7 //padding处理

        });

        if (T.appversion.andriod()) {
          var encryptData = encodeURIComponent(encodeURIComponent(encrypt.toString())); //加密完成后，转换成字符串
        } else {
          var encryptData = encodeURIComponent(encrypt.toString()); //加密完成后，转换成字符串
        }

        var url = activityUrl + '&content=' + encryptData;
        T.fn.action10061(url);
      }
    });
  });
}
/**
 * 活动页获取手机号公共方法
 * @param {string} commonActivityUrl 活动页地址
 * @param {string} activityTitle 活动页标题
 */


function getCommonActivityUrl(commonActivityUrl, activityTitle) {
  T.readLocalMesg(['MOBILECODE'], function (oLocal) {
    var MOBILECODE = oLocal.MOBILECODE;

    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      //未登录手机号
      T.saveMapMesg({
        commonActivityUrl: commonActivityUrl
      }, function () {
        //由于58130无回调函数，因此增加过渡页面来加密参数
        if (T.appversion.andriod()) {
          T.fn.changeurl('http://action:58130/?type=9&&url=home_new/commonActivityUrl.html&&activityTitle=' + encodeURIComponent(activityTitle));
        } else {
          T.fn.action10061('home_new/commonActivityUrl.html?activityTitle=' + encodeURIComponent(activityTitle));
        }
      });
    } else {
      //已登录手机号-判断获取头像的路径
      getUserImg(commonActivityUrl);
    }
  });
}
/**
 *获取用户头像
 *
 * @param {string} commonActivityUrl 活动页地址
 */


function getUserImg(commonActivityUrl) {
  var headImg = '';
  T.readLocalMesg(['MOBILECODE'], function (oLocal) {
    var mobilecode = oLocal.MOBILECODE; //查询头像

    var oSend49038 = {
      action: '49038',
      khh: mobilecode,
      ReqlinkType: 2
    };
    $.getData({
      oSendData: oSend49038,
      isload: false,
      fnSuccess: function fnSuccess(result) {
        headImg = result.IMG_PATH; //上传的头像

        setCommonActivityUrl(commonActivityUrl, mobilecode, headImg);
      },
      oConfig: function oConfig(odata) {
        headImg = '';
        setCommonActivityUrl(commonActivityUrl, mobilecode, headImg);
      }
    });
  });
}
/**
 *加密参数
 * @param {string} commonActivityUrl 活动页地址
 * @param {string} mobilecode 手机号
 * @param {string} headImg 头像
 */


function setCommonActivityUrl(commonActivityUrl, mobilecode, headImg) {
  //绑定客户登录信息，此处用来查询userId
  var oSend = {
    action: '49135',
    ReqlinkType: '2',
    mobileNo: mobilecode,
    accountType: '0'
  };
  $.getData({
    oSendData: oSend,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      var oJson = JSON.parse(data.DATA); // console.log(oJson)

      getUserInfo({
        userId: oJson.userId
      }, function (oData) {
        //获取用户三方信息
        // console.log(oData);
        var objData = {
          'mobile': mobilecode,
          'nickName': oData.name,
          'headImg': headImg
        };
        var content = JSON.stringify(objData); //查询后台相关配置信息

        var oSendData = {
          action: 46200,
          ReqLinkType: 2
        };
        $.getData({
          oSendData: oSendData,
          fnSuccess: function fnSuccess(res) {
            var key = res.DESKEY; //key不足24位自动以0(最小位数是0)补齐,如果多余24位,则截取前24位,后面多余则舍弃掉

            var base64 = CryptoJS.enc.Utf8.parse(key);
            var encrypt = CryptoJS.TripleDES.encrypt(content, base64, {
              mode: CryptoJS.mode.ECB,
              //ECB模式
              padding: CryptoJS.pad.Pkcs7 //padding处理

            });
            var encryptData = encodeURIComponent(encrypt.toString()); //加密完成后，转换成字符串

            var url = commonActivityUrl + '&&objData=' + encryptData;
            T.fn.action10061(url);
          }
        });
      });
    }
  });
}
/**
 *网厅跳转
 *
 * @param {string} dataUrl 跳转地址
 */


function wtJump(dataUrl) {
  //var dataUrl=wtJumpUrl;
  //dataUrl=decodeURIComponent(dataUrl);
  $.getData({
    oSendData: {
      action: 6771,
      ReqlinkType: '1'
    },
    fnSuccess: function fnSuccess(reg) {
      var SERVTICKET_ID = reg.SERVTICKET_ID;

      if (SERVTICKET_ID == '' || !SERVTICKET_ID) {
        T.fn.action10061(dataUrl);
      } else {
        $.getData({
          oSendData: {
            action: '5',
            needToken: '0'
          },
          isToken: false,
          fnSuccess: function fnSuccess(oTime) {
            var serverTime = oTime.TIME;
            $.getData({
              oSendData: {
                action: '46200',
                ReqlinkType: 2
              },
              fnSuccess: function fnSuccess(oData) {
                var PUBLICK_KEY = oData.WSYYT,
                    MD5_KEY = oData.HSSTRING;
                var str = JSON.stringify({
                  token: SERVTICKET_ID,
                  from: 'sidi',
                  time: serverTime
                });
                var senddata = encryptRsa2(PUBLICK_KEY, MD5_KEY, str);
                var oUrl = dataUrl + '&data=' + senddata.data;
                T.fn.changeurl('http://action:58117/?url=' + encodeURIComponent(oUrl));
              }
            });
          }
        });
      }
    }
  });
}
/**
 *创业板网厅签署跳转
 *
 * @param {string} dataUrl
 */


function cybJump() {
  //var dataUrl=wtJumpUrl;
  //dataUrl=decodeURIComponent(dataUrl);
  $.getData({
    oSendData: {
      action: 6771,
      ReqlinkType: '1'
    },
    fnSuccess: function fnSuccess(reg) {
      var SERVTICKET_ID = reg.SERVTICKET_ID;

      if (SERVTICKET_ID == '' || !SERVTICKET_ID) {
        T.fn.action10061(dataUrl);
      } else {
        $.getData({
          oSendData: {
            action: '5',
            needToken: '0',
            ReqlinkType: '1'
          },
          isToken: false,
          fnSuccess: function fnSuccess(oTime) {
            var serverTime = oTime.TIME;
            $.getData({
              oSendData: {
                action: '46200',
                ReqlinkType: 2
              },
              fnSuccess: function fnSuccess(oData) {
                var PUBLICK_KEY = oData.WSYYT,
                    MD5_KEY = oData.HSSTRING;
                var str = JSON.stringify({
                  token: SERVTICKET_ID,
                  from: 'sidi',
                  time: serverTime
                });
                var senddata = encryptRsa2(PUBLICK_KEY, MD5_KEY, str);
                var dataUrl = oData.SECONDBOARD;
                var oUrl = dataUrl + '&data=' + senddata.data;
                T.fn.changeurl('http://action:58117/?url=' + encodeURIComponent(oUrl));
              }
            });
          }
        });
      }
    }
  });
} //创业板网厅签署弹窗  消息栏目41046


function cybSignOpen() {
  if ($('.cybSign').css('display') == 'block') return;
  $.getData({
    oSendData: {
      action: '5',
      needToken: '0',
      ReqlinkType: '1'
    },
    copyIsArray: false,
    isload: false,
    isToken: false,
    fnSuccess: function fnSuccess(dayData) {
      var nowDay = dayData.TIME.split(" ")[0].replace(/-/g, "");
      cybDialog(nowDay);
    },
    oConfig: function oConfig(error) {
      var nowDate = new Date();
      var nowDay = formatDate(nowDate, "yyyy-mm-dd");
      cybDialog(nowDay);
    }
  }); //下次提醒

  $(".cybSign-close").off().on("click", function () {
    // var obj = {};
    // obj.date = $(".cybSign").attr("data-date"); // 当天日期
    // T.saveFileMesg(JSON.stringify(obj), 'cybSign.txt', function (data) {});
    var title = $('.cybSign .cybSign-title').text().trim();
    var time = $('.cybSign').attr('data-time');
    var type = $('.cybSign').attr('data-type'); //关闭弹框事件埋点

    track.sensors.track('popup_message_click', {
      'popup_botton_click': 'cancel按钮',
      'popup_message_type': type,
      'popup_message_title': title,
      'popup_message_id': '301创业板提醒',
      'popup_message_time': time
    });
    $(".cybSign").hide();
  }); //跳转网厅

  $(".cybSign-footer").off().on("click", function () {
    var title = $('.cybSign .cybSign-title').text().trim();
    var time = $('.cybSign').attr('data-time');
    var type = $('.cybSign').attr('data-type'); //点击立即签署事件埋点

    track.sensors.track('popup_message_click', {
      'popup_botton_click': '重签按钮',
      'popup_message_type': type,
      'popup_message_title': title,
      'popup_message_id': '301创业板提醒',
      'popup_message_time': time
    });
    T.readLocalMesg(['MOBILECODE', 'jyloginflag'], function (oLocal) {
      //dataUrl=dataUrl.replace("&wtType=1","");
      if (!!oLocal.MOBILECODE && oLocal.JYLOGINFLAG >= 1) {
        //第三种 已注册已登录
        cybJump();
      } else {
        T.fn.action10090({
          jsfuncname: "cybJump()"
        });
      }
    });
    $(".cybSign").hide();
  });
}

var isShowed = false; // 是否已展示过弹框

/**
 * 处理创业板弹框的展示
 * @param nowDay 今天的日期
 */

function cybDialog(nowDay) {
  if (isShowed) {
    return;
  } // 已经展示过弹框，不展示


  T.readFileMesg('cybSign.txt', function (data) {
    if (!!data) {
      var res = JSON.parse(decodeURIComponent(data));
      console.log("cybSign:", res);

      if (nowDay == res.date) {
        //今天已展示过弹框，不再展示
        $(".cybSign").hide();
      } else {
        //今天未展示过弹框，根据推送消息的日期决定是否展示消息
        getPushMsg(nowDay);
      }
    } else {
      //从未展示过弹框，根据推送消息的日期决定是否展示消息
      getPushMsg(nowDay);
    }
  });
}
/**
 * 获取推送消息
 * @param nowDay 今天的日期
 *
 */


function getPushMsg(nowDay) {
  $.getData({
    oSendData: {
      action: '41046',
      ReqlinkType: '2',
      uniqueid: '($tztuniqueid)',
      menuid: '301',
      startpos: 1,
      maxcount: 1
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      // console.log(res);
      var data = oData.GRID0;

      if (data) {
        var dataTime = data[0].split("|")[6];
        var dataDate = dataTime.substr(0, 8); //推送消息的年月日

        if (nowDay != dataDate) {
          // 不是今天推送的消息，不展示(即以前推送的消息不展示)
          $(".cybSign").hide();
        } else {
          var msgTypeMap = {
            '21': '系统资讯',
            '25': '公告(详细内容为文本)',
            '27': '详细内容为URL'
          };
          var msgType = data[0].split("|")[4];
          var formatTime = dataTime.substring(0, 4) + '-' + dataTime.substring(4, 6) + '-' + dataTime.substring(6, 8);
          $('.cybSign').attr('data-time', formatTime).attr('data-type', msgTypeMap[msgType]);
          isShowed = true; //存消息日期

          T.saveFileMesg(JSON.stringify({
            date: dataDate
          }), 'cybSign.txt', function (data) {}); //显示弹框事件埋点

          track.sensors.track('popup_message_view', {
            'popup_tab_name': '探索',
            'popup_message_type': msgTypeMap[msgType],
            'popup_message_title': $('.cybSign-title').text().trim(),
            'popup_message_id': '301创业板提醒',
            'popup_message_time': formatTime
          });
          $(".cybSign").show();
        }
      } else {
        $(".cybSign").hide();
      }
    },
    oConfig: function oConfig(error) {
      $(".cybSign").hide();
    }
  });
} //股转相关提醒弹窗


function closeDeclare() {
  T.readFileMesg('gzRemind.txt', function (data) {
    if (!!data) {//则不再对股转相关弹窗再做处理
    } else {
      //等所有参数都设置为关闭，再初始化
      T.reqsofttodo({
        'xjrwtx': "0"
      }, function () {
        T.reqsofttodo({
          'xjfxtx': "0"
        }, function () {
          T.reqsofttodo({
            'sgzqtx': "0"
          }, function () {
            T.reqsofttodo({
              'sgfxtx': "0"
            }, function () {
              var obj = {};
              obj.gzRemind = "gzRemind"; // 当天日期

              T.saveFileMesg(JSON.stringify(obj), 'gzRemind.txt', function (data) {});
            });
          });
        });
      });
    }
  });
}
/**
 * 回到页面顶部
 * */


function goBackScrollTop() {
  console.log($("#mescroll")); // $("#mescroll").css("overflow-y","hidden");

  $("#mescroll").scrollTop(0); // setTimeout(function () {
  //     $("#mescroll").css("overflow-y","auto");
  // },300);
}