"use strict";

var oVal = {},
    sticky = null,
    //悬浮导航栏设置
mescroll = '';
var oCache = {}; //缓存变量

oVal.downRefresh = true; //下拉刷新标志
// var pageSensors = new track.Tracker();
// pageSensors.registerPageModule('SY');
// 页面浏览 page
// pageSensors.reportPageView('pageView');

oVal.limitedVersion = '3.20.8'; //新旧版本限制版本号

oVal.nineBoxFile = 'appNineBoxFile.txt'; //首页九宫格缓存名称

$(function () {
  //获取tztwkwebview信息
  T.readLocalMesg(['tztwkwebview'], function (data) {
    oVal.TZTWKWEBVIEW = data.TZTWKWEBVIEW;
  }); //获取46200配置文件信息

  getConfigInfo(function () {
    //投顾图片前缀id
    oVal.tgJumpId = oVal.configData.TGPICLINK;
    init(); //stickyEvent();

    pageEvent();
    oVal.pageType = 'tuijian'; //创建MeScroll对象,内部已默认开启下拉刷新,刷新列表数据;

    mescroll = new MeScroll('mescroll-index', {
      down: {
        callback: downCallBack,
        use: true,
        auto: false
      }
    }); //因为需要域名 获取到域名后运行
    //快讯 投顾解盘

    kxTgjpApp.init(); //要闻 投顾观点 推荐投顾

    ywListApp.init();
  });
  /*$('.page-wrapper').off("scroll").scroll(function(){
      reqrolloffset();
  });*/
});

function pageRefresh() {
  //快讯 投顾解盘
  kxTgjpApp.init(false); //独家解读
  // djjdApp.init();
  //今日热点

  jrrdApp.init(); //洞察机会

  dcjhApp.init(); //底部 要闻列表 投顾观点 推荐投顾

  ywListApp.init();
}

function downCallBack() {


  if (!!oVal.downRefresh) {
    oVal.downRefresh = false;
    console.log('oVal.MOBILECODE', oVal.MOBILECODE);

    if (oVal.MOBILECODE == '' || !oVal.MOBILECODE || oVal.MOBILECODE == 'null') {
      //新手快捷入口
      getNewKJCD();

      if (commonFunction.compareVersion(oVal.currVersion, oVal.limitedVersion)) {
        //新手广告图
        getNewBannerInfo();
      } else {
        getOldBannerInfo();
      }

      pageRefresh(); // if (commonFunction.compareVersion(oVal.currVersion, oVal.limitedVersion)) {
      //     getBannerInfo();
      // } else {
      //     getOldBannerInfo();
      // }
    } else {
      getKJCD();
      pageRefresh();

      if (commonFunction.compareVersion(oVal.currVersion, oVal.limitedVersion)) {
        getBannerInfo();
      } else {
        getOldBannerInfo();
      }
    } // getZBmessageInfo(); //直播数据刷新


    getSuspensionInfo(); //悬浮窗数据刷新
    // setTimeout(function () {

    mescroll.endSuccess(0);
    oVal.downRefresh = true; // }, 1000);
  }
}
/**
 * 获取配置文件信息
 * */


function getConfigInfo(callback) {
  $.getData({
    oSendData: {
      action: '46200',
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      oVal.configData = oData;
      callback();
    },
    oConfig: function oConfig(error) {
      console.log(error);
      callback();
    }
  });
}

var refreshTimer = null;
/**
 * 初始化
 * */

function init(isGobackOnLoad) {
  console.log('刷新顶部的数据');
 
  T.readLocalMesg(['mobilecode', 'softversion', 'jyloginflag','hfFontType'], function (oData) {
    const typeVersions =oData.HFFONTTYPE;
    if (typeVersions != null) {
      const typeVersionname = typeVersions === "1" ? "old" : "";
      // _store.commit('updateOlderVersion', typeVersionname)
      window.document.documentElement.setAttribute(
        "data-typeversion",
        typeVersionname
      );
    }
   
    oVal.HFFONTTYPE = oData.HFFONTTYPE;

    oVal.MOBILECODE = oData.MOBILECODE;
    oVal.currVersion = oData.SOFTVERSION;
    oVal.jylogin = oData.JYLOGINFLAG; // console.log(oVal.MOBILECODE == '' || !oVal.MOBILECODE || oVal.MOBILECODE == 'null');
    if (typeVersions != null) {
      const typeVersionname = typeVersions === "1" ? "old" : "";
      // _store.commit('updateOlderVersion', typeVersionname)
      window.document.documentElement.setAttribute(
        "data-typeversion",
        typeVersionname
      );
    }
    if (commonFunction.compareVersion(oData.SOFTVERSION, oVal.limitedVersion)) {
      $('.header-version-new').show();
      $('.header-version-old').remove();
    } else {
      $('.header-version-new').remove();
      $('.header-version-old').show();
    }

    if (oVal.MOBILECODE == '' || !oVal.MOBILECODE || oVal.MOBILECODE == 'null') {
      djjdApp.noLogin = true; //新手快捷入口

      getNewKJCD();

      if (commonFunction.compareVersion(oData.SOFTVERSION, oVal.limitedVersion)) {
        //新手广告图
        getNewBannerInfo();
      } else {
        getOldBannerInfo();
      } // $('.scroll-info-tz').hide(); //未登录手机号时，隐藏消息栏
      //背景高度控制
      //$(".header .change-bg").addClass("change-bg-height");

    } else {
      $('.gradient-bg').css('height', '8rem');
      djjdApp.noLogin = false;
      getKJCD();

      if (commonFunction.compareVersion(oData.SOFTVERSION, oVal.limitedVersion)) {
        getBannerInfo();
      } else {
        getOldBannerInfo();
      } // getMessageInfo();
      // getZBmessageInfo();
      //$(".header .change-bg").removeClass("change-bg-height");

    } //分页数据


    if (!isGobackOnLoad) {
      //触发GobackOnLoad刷新页面时，不刷新分页数据（刷新的话，页面变化幅度太大）
      loadTabHtml();
    } //悬浮框数据


    getNowDay(function () {
      getSuspensionInfo();
    });
  });
}
/**
 * 获取滚动消息
 * 取七天内的，最新的三条数据
 * */
// function getMessageInfo() {
//     $.getData({
//         oSendData: {
//             /*'action': '41035',
//             'ReqLinkType': '2',
//             'uniqueid':'($tztuniqueid)',*/
//             action: '49835',
//             ReqlinkType: '2',
//             mobilecode: '($mobileCode)',
//             uniqueid: '($tztuniqueid)',
//             account: '($account)',
//             startpos: 1,
//             maxcount: 3,
//         },
//         copyIsArray: false,
//         isload: false,
//         fnSuccess: function (data) {
//             // console.log("推送消息：",data);
//             var sHtml = '';
//             if (data.GRID0 && data.GRID0.length > 0) {
//                 var dataArr = data.GRID0;
//                 for (var item = 0; item < dataArr.length; item++) {
//                     var listArr = dataArr[item].split('|');
//                     var content = listArr[2];
//                     if (
//                         listArr[2].indexOf('智能盯盘') > -1 ||
//                         listArr[2].indexOf('新股新债') > -1 ||
//                         listArr[2].indexOf('成交回报') > -1 ||
//                         listArr[2].indexOf('中签提醒') > -1 ||
//                         listArr[2].indexOf('持仓预警') > -1 ||
//                         listArr[2].indexOf('国债逆回购') > -1
//                     ) {
//                         content = listArr[3];
//                     } else if (
//                         listArr[2].indexOf('持仓公告') > -1 ||
//                         listArr[2].indexOf('基金消息') > -1 ||
//                         listArr[2].indexOf('每日资讯') > -1 ||
//                         listArr[2].indexOf('系统消息') > -1 ||
//                         listArr[2].indexOf('华福热门') > -1 ||
//                         listArr[2].indexOf('持仓股公告') > -1 ||
//                         listArr[2].indexOf('华福通知') > -1
//                     ) {
//                         content = listArr[2];
//                     }
//                     sHtml += '<div class="swiper-slide"><span class="list">' + content + '</span></div>';
//                 }
//                 $('.swiper-container-tz .swiper-wrapper').html(sHtml);
//                 $('.scroll-info-tz').show();
//                 if (oVal.swiperTz) {
//                     // oVal.swiperTz.init();
//                 } else {
//                     oVal.swiperTz = new Swiper('.swiper-container-tz', {
//                         direction: 'vertical',
//                         // slidesPerView: 1,
//                         // paginationClickable: true,
//                         // spaceBetween: 30,
//                         autoplayDisableOnInteraction: false,
//                         mousewheelControl: true,
//                         autoplay: 3000,
//                         loop: true,
//                     });
//                 }
//             } else {
//                 $('.scroll-info-tz').hide();
//             }
//         },
//         oConfig: function (error) {
//             $('.scroll-info-tz').hide();
//         },
//     });
// }

/**
 * 获取直播消息
 * 48012
 * */
// function getZBmessageInfo() {
//     $.getData({
//         oSendData: {
//             action: 48012,
//             method: 'post',
//             path: '/redirect',
//             targetPath: '/utilServer/innerApi/HJLive/getLiveListTop3',
//             pageNumber: 1,
//             // pageSize: 1,
//             ReqlinkType: 2, //资讯通道
//         },
//         copyIsArray: false,
//         isload: false,
//         fnSuccess: function (data) {
//             if (data.DATA && data.ERRORNO == '200') {
//                 // console.log("直播消息：",JSON.parse(data.DATA));
//                 var sHtml = '';
//                 var dataArr = JSON.parse(data.DATA).content;
//                 if (dataArr.length > 0) {
//                     for (var item = 0; item < dataArr.length; item++) {
//                         var status = dataArr[item].status, //直播间状态 0未开始 1直播中 2已结束
//                             h5Url = dataArr[item].h5Url,
//                             liveLink = dataArr[item].liveLink, //直播链接 status为0、1时取该字段
//                             videoLink = dataArr[item].videoLink || ''; //回放视频链接 status为2时取该字段且只有结束才有
//                         if (status == '1') {
//                             sHtml +=
//                                 '<div class="swiper-slide" data-status="' +
//                                 status +
//                                 '" data-liveLink="' +
//                                 liveLink +
//                                 '" data-videoLink="' +
//                                 videoLink +
//                                 '" data-h5Url="' +
//                                 h5Url +
//                                 '"><span class="list">' +
//                                 dataArr[item].title +
//                                 '</span></div>';
//                         }
//                     }
//                     if (!sHtml) {
//                         $('.scroll-info-zb').hide();
//                         return;
//                     }
//                     //setZbIcon(dataArr[0].status);
//                     $('.scroll-info-zb .swiper-wrapper').html(sHtml);
//                     $('.scroll-info-zb').show();
//                     if (oVal.swiperZb) {
//                         oVal.swiperZb.init();
//                     } else {
//                         oVal.swiperZb = new Swiper('.swiper-container-zb', {
//                             direction: 'vertical',
//                             //slidesPerView: 1,
//                             //paginationClickable: true,
//                             //spaceBetween: 30,
//                             mousewheelControl: true,
//                             autoplayDisableOnInteraction: false,
//                             autoplay: 3000,
//                             loop: true,
//                             onInit: function () {
//                                 $('.scroll-info-zb .swiper-slide')
//                                     .off()
//                                     .on('click', function () {
//                                         var status = $(this).attr('data-status');
//                                         var h5Url = $(this).attr('data-h5Url');
//                                         var videoLink = $(this).attr('data-videoLink');
//                                         T.fn.action10061(h5Url);
//                                     });
//                             },
//                         });
//                     }
//                     // oVal.swiperZb.on('transitionStart', function(s) {
//                     //     var status = $(s.wrapper[0]).find('.swiper-slide').eq(s.activeIndex).attr('data-status');
//                     //     setZbIcon(status);
//                     // });
//                     // function setZbIcon(status) {
//                     //     var iconEle = $('.scroll-title-zb');
//                     //     switch(status) {
//                     //         case '0':
//                     //             iconEle.html(
//                     //                 '<svg width="27px" height="27px" viewBox="0 0 27 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
//                     //                 '    <title>yuyue</title>' +
//                     //                 '    <g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
//                     //                 '        <g id="画板" transform="translate(-40.000000, -503.000000)" fill="#FFFFFF">' +
//                     //                 '            <g id="编组-2" transform="translate(32.000000, 504.000000)">' +
//                     //                 '                <g id="yuyue" transform="translate(9.000000, 0.000000)">' +
//                     //                 '                    <path d="M12.5,0 C5.59644063,0 0,5.59644063 0,12.5 C0,19.4035594 5.59644063,25 12.5,25 C19.4035594,25 25,19.4035594 25,12.5 C25,5.59644063 19.4035594,0 12.5,0 Z M12.5,23.2142857 C6.58266339,23.2142857 1.78571428,18.4173366 1.78571428,12.5 C1.78571428,6.58266339 6.58266339,1.78571428 12.5,1.78571428 C18.4173366,1.78571428 23.2142857,6.58266339 23.2142857,12.5 C23.2142857,18.4173366 18.4173366,23.2142857 12.5,23.2142857 L12.5,23.2142857 Z" id="形状" stroke="#FFFFFF" stroke-width="0.7" fill-rule="nonzero"></path>' +
//                     //                 '                    <path d="M12.1990898,6 C11.5418062,6 11.0080962,6.5229913 11.0080962,7.1666087 L11.0080962,14.3914435 C11.0080962,14.3991652 11,14.4033391 11,14.4114783 C11,15.0550957 11.53371,15.578087 12.1909936,15.578087 L17.0553184,15.578087 C17.7123889,15.578087 18.2460989,15.0550957 18.2460989,14.4114783 C18.2460989,13.7678609 17.7123889,13.245287 17.0553184,13.245287 L13.3898704,13.245287 L13.3898704,7.1666087 C13.3898704,6.5229913 12.858504,6 12.1990898,6 Z" id="路径"></path>' +
//                     //                 '                </g>' +
//                     //                 '            </g>' +
//                     //                 '        </g>' +
//                     //                 '    </g>' +
//                     //                 '</svg>' +
//                     //             '<em>预告</em>'
//                     //             );
//                     //             break;
//                     //         case '1':
//                     //             iconEle.html(
//                     //                 '<svg width="20px" height="24px" viewBox="0 0 24 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
//                     //                     '<g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
//                     //                         '<g id="分组-7" transform="translate(-9.000000, -7.000000)" fill="#FFFFFF" fill-rule="nonzero">' +
//                     //                             '<g id="分组-12" transform="translate(9.000000, 7.000000)">' +
//                     //                                 '<rect id="矩形" x="0" y="0" width="5" height="24"></rect>' +
//                     //                                 '<rect id="矩形" x="7" y="5" width="5" height="19"></rect>' +
//                     //                                 '<rect id="矩形" x="15" y="11" width="5" height="13"></rect>' +
//                     //                             '</g>' +
//                     //                         '</g>' +
//                     //                     '</g>'+
//                     //                 '</svg>' +
//                     //                 '<em>直播中</em>'
//                     //             );
//                     //             break;
//                     //         case '2':
//                     //             iconEle.html(
//                     //                 '<svg width="12px" height="12px" viewBox="0 0 25 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
//                     //                     '<title>回放</title>'+
//                     //                     '<desc>Created with Sketch.</desc>'+
//                     //                     '<g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
//                     //                         '<g id="画板" transform="translate(-186.000000, -232.000000)" fill="#FFFFFF" fill-rule="nonzero">'+
//                     //                             '<g id="kechenghuifang" transform="translate(186.000000, 232.000000)">'+
//                     //                                 '<path d="M12.3147462,5.85453913 C11.6574626,5.85453913 11.1237525,6.37753043 11.1237525,7.02114783 L11.1237525,14.2459826 C11.1237525,14.2537043 11.1156563,14.2578783 11.1156563,14.2660174 C11.1156563,14.9096348 11.6493664,15.4326261 12.30665,15.4326261 L17.1709747,15.4326261 C17.8280452,15.4326261 18.3617553,14.9096348 18.3617553,14.2660174 C18.3617553,13.6224 17.8280452,13.0998261 17.1709747,13.0998261 L13.5055267,13.0998261 L13.5055267,7.02114783 C13.5055267,6.37753043 12.9741603,5.85453913 12.3147462,5.85453913 Z M12.7491712,0 C7.93470202,0 3.77133775,2.7213913 1.76880662,6.67826087 L4.71987148,6.67826087 C6.46311116,4.15972174 9.40863651,2.50434783 12.7491712,2.50434783 C18.103103,2.50434783 22.4433053,6.75568696 22.4433053,12 C22.4433053,17.244313 18.103103,21.4956522 12.7491712,21.4956522 C9.45550925,21.4956522 6.54748208,19.8853565 4.79550704,17.426087 L1.82334944,17.426087 C3.84590801,21.3261913 7.97752665,24 12.7491712,24 C19.5152507,24 25,18.6275478 25,12 C25,5.37266087 19.5152507,0 12.7491712,0 Z M0,6.65217391 L3.67908368,10.7933217 L7.3579543,6.65217391 L0,6.65217391 Z" id="形状"></path>'+
//                     //                             '</g>'+
//                     //                         '</g>'+
//                     //                     '</g>'+
//                     //                 '</svg>'+
//                     //                 '<em>回放</em>');
//                     //             break;
//                     //     }
//                     // }
//                 } else {
//                     $('.scroll-info-zb').hide();
//                 }
//             } else {
//                 $('.scroll-info-zb').hide();
//             }
//         },
//         oConfig: function (error) {
//             $('.scroll-info-zb').hide();
//         },
//     });
// }

/**
 * 滚动交互
 * */


function reqrolloffset() {
  var obj = {}; //obj.offset = (-$("#wapperTop").offset().top);

  obj.offset = $('.page-wrapper').scrollTop(); //console.log(obj.offset);

  var jsonobj = JSON.stringify(obj);

  if (oVal.TZTWKWEBVIEW == 1 && window.webkit.messageHandlers) {
    window.webkit.messageHandlers.setContentParams.postMessage({
      func: 'reqrolloffset',
      //回调函数名
      data: jsonobj //数据

    });
  } else {
    if (window.MyWebView) {
      window.MyWebView.setContentParams('reqrolloffset', jsonobj);
    }
  }
}
/**
 * 回到页面顶部
 * */


function goBackScrollTop() {
  $('.page-wrapper').css('overflow-y', 'hidden');
  $('.page-wrapper').scrollTop(0);
  setTimeout(function () {
    $('.page-wrapper').css('overflow-y', 'auto');
  }, 300);
  /*$(".page-wrapper").stop().animate({
      scrollTop:0
  })*/
}
/**
 * 获取六期改造之前的banner图
 * */


function getOldBannerInfo() {
  //$(".swiper-container-banner .swiper-wrapper").html("");
  $.getData({
    oSendData: {
      action: '41500',
      type: 'SYJDT',
      ReqlinkType: '2'
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      // console.log(oData)
      if (oData.GRID0 && oData.GRID0.length < 1) {
        var data_grid = oData.GRID0;
        data_grid.shift();
        var sHtml = '';

        for (var i = 0; i < data_grid.length; i++) {
          var data = data_grid[i].split('|'),
              click_url = data[oData.IMAGE_CLICK_INDEX],
              img_title = data[oData.IMAGE_TITLE_INDEX],
              img_url = data[oData.IMAGE_URL_INDEX];

          if (img_url) {
            sHtml += '<div class="swiper-slide"><img class="image" src="' + img_url + '" data-title="' + img_title + '" data-url="' + click_url + '" onerror="$(this).parent().remove();"></div>';
          }
        }

        $('.swiper-container-banner-old .swiper-wrapper').html(sHtml);

        if (oVal.swiperBannerOld) {
          oVal.swiperBannerOld.destroy(false);
          oVal.swiperBannerOld = null;
        }

        oVal.swiperBannerOld = new Swiper('.swiper-container-banner-old', {
          autoplay: 3000,
          //可选选项，自动滑动
          autoplayDisableOnInteraction: false,
          spaceBetween: 1,
          //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
          observer: true,
          //图片加载失败会删除元素，需要更新swiper
          observerParents: true,
          loop: true,
          pagination: '.swiper-pagination-banner-old'
        });
        bannerEvent();
      } else {}
    },
    oConfig: function oConfig(error) {}
  });
}
/**
 * 获取banner图
 * */


function getBannerInfo() {
  // $(".swiper-container-banner .swiper-wrapper").html("");
  $.getData({
    oSendData: {
      action: '41500',
      type: 'TJYYWXB',
      ReqlinkType: '2'
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      // console.log(oData)
      if (oData.GRID0 && oData.GRID0.length > 1) {
        var data_grid = oData.GRID0;
        data_grid.shift();
        var sHtml = '';

        if (!Array.isArray(data_grid) || data_grid.length === 0) {
          $('#banner-block').hide();
          return;
        }

        for (var i = 0; i < data_grid.length; i++) {
          var data = data_grid[i].split('|'),
              click_url = data[oData.IMAGE_CLICK_INDEX],
              img_title = data[oData.IMAGE_TITLE_INDEX],
              img_url = data[oData.IMAGE_URL_INDEX]; //  console.log('img_url',img_url);

          if (img_url) {
            sHtml += '<div class="swiper-slide"><img class="image" src="' + img_url + '" data-title="' + img_title + '" data-url="' + click_url + '" onerror="$(this).parent().remove();"></div>';
          }
        }


        if (oVal.swiperBanner) {
          oVal.swiperBanner.destroy(false);
          oVal.swiperBanner = null;
        }
        var hdTypes = 3000;
        if ( oData.GRID0.length=='1') {
          hdTypes=false
        }else{
          hdTypes = 3000;
        }

        $('.swiper-container-banner .swiper-wrapper').html(sHtml);
        oVal.swiperBanner = new Swiper('.swiper-container-banner', {
          autoplay: hdTypes,
          spaceBetween: 1,
          //可选选项，自动滑动
          autoplayDisableOnInteraction: false,
          //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
          observer: true,
          //图片加载失败会删除元素，需要更新swiper
          observerParents: true,
          loop: true,
          pagination: '.swiper-pagination-banner'
        });
        bannerEvent();
      } else {
        $('#banner-block').hide();
        console.log('22222222222222');
      }
    },
    oConfig: function oConfig(error) {}
  });
}
/**
 * 获取新手banner图
 * */


function getNewBannerInfo() {
  //$(".swiper-container-banner .swiper-wrapper").html("");
  $.getData({
    oSendData: {
      action: '41500',
      type: 'XSYYWXB',
      ReqlinkType: '2'
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      if (oData.GRID0 && oData.GRID0.length > 1) {
        var data_grid = oData.GRID0;
        data_grid.shift();
        var sHtml = '';

        for (var i = 0; i < data_grid.length; i++) {
          var data = data_grid[i].split('|'),
              click_url = data[oData.IMAGE_CLICK_INDEX],
              img_title = data[oData.IMAGE_TITLE_INDEX],
              img_url = data[oData.IMAGE_URL_INDEX],
              banner_id = data[oData.ID_INDEX];

          if (img_url) {
            sHtml += '<div class="swiper-slide"><img class="image" src="' + img_url + '" data-title="' + img_title + '" data-banner-id="' + banner_id + '" data-url="' + click_url + '" onerror="$(this).parent().remove();"></div>';
          }
        }

        if (oVal.swiperBanner) {
          oVal.swiperBanner.destroy(false);
          oVal.swiperBanner = null;
        }
        var hdTypes = 3000;
        if ( oData.GRID0.length=='1') {
          hdTypes=false
        }else{
          hdTypes = 3000;
        }
        $(".swiper-container-banner .swiper-wrapper").html(sHtml);
        oVal.swiperBanner = new Swiper('.swiper-container-banner', {
          autoplay: hdTypes,
          //可选选项，自动滑动
          autoplayDisableOnInteraction: false,
          spaceBetween: 1,
          //用户操作swiper之后，是否禁止autoplay。默认为true：停止。
          observer: true,
          //图片加载失败会删除元素，需要更新swiper
          observerParents: true,
          loop: true,
          pagination: '.swiper-pagination-banner'
        });
        bannerEvent();
      } else {
        $('#banner-block').hide();
      }
    },
    oConfig: function oConfig(error) {}
  });
}
/**
 * banner点击事件
 * */


function bannerEvent() {
  $('.swiper-container-banner-old .swiper-slide img').off().on('click', function () {
    var url = $(this).attr('data-url');
    var bannerId = $(this).attr('data-banner-id');
    var title = $(this).attr('data-title');

    if (url) {
      T.fn.changeURL(url); //T.fn.action10061({url:url});
    }
  });
  $('.swiper-container-banner .swiper-slide img').off().on('click', function () {
    var url = $(this).attr('data-url');
    var bannerId = $(this).attr('data-banner-id');
    var title = $(this).attr('data-title');
    sa.track('bannerclick', {
      business_module: '业务类',
      first_module: '探索',
      second_module: '首页',
      third_module: '首页',
      page_name: '首页',
      banner_id: bannerId,
      banner_name: title,
      jump_url: url
    });

    if (url) {
      T.fn.changeURL(url); //T.fn.action10061({url:url});
    }
  });
}
/**
 * 获取悬浮窗
 * */


function getSuspensionInfo() {
  T.readMapMesg(['suspensionWindowFlag'], function (oLocal) {
    if (!oLocal.SUSPENSIONWINDOWFLAG || oLocal.SUSPENSIONWINDOWFLAG > oVal.nowDay) {
      $.getData({
        oSendData: {
          action: '49895',
          position: 'XFC',
          ReqlinkType: '2'
        },
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          // console.log(oData)
          if (oData.GRID0 && oData.GRID0.length > 1) {
            var data_grid = oData.GRID0;
            data_grid.shift();
            var sHtml = '';

            for (var i = 0; i < 1; i++) {
              var data = data_grid[i].split('|'),
                  click_url = data[oData.LINK_INDEX],
                  img_title = data[oData.ENTRYNAME_INDEX],
                  img_url = data[oData.ENTRYURL_INDEX];

              if (img_url) {
                /*onerror="$(this).parent().remove();"*/
                sHtml += '<img class="image" src="' + img_url + '" data-title="' + img_title + '" data-url="' + click_url + '" >';
              }
            }

            $('.suspension-window>div').html(sHtml);
            suspensionEvent();
            $('.suspension-window').show();
          } else {
            $('.suspension-window').hide();
          }
        },
        oConfig: function oConfig(error) {
          $('.suspension-window').hide();
        }
      });
    }
  });
}
/**
 * 获取当天日期
 * */


function getNowDay(callback) {
  $.getData({
    oSendData: {
      action: '5',
      needToken: '0',
      ReqlinkType: '1'
    },
    isToken: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      //data.TIME="2020-06-26 13:41:29";
      var nowDay = data.TIME.split(' ')[0];
      oVal.nowDay = nowDay.replace(/-/g, '');
      callback();
    },
    oConfig: function oConfig(error) {
      var nowDate = new Date();
      var nowDay = formatDate(nowDate, 'yyyy-mm-dd');
      oVal.nowDay = nowDay.replace(/-/g, '');
      callback();
    }
  });
}
/**
 * 悬浮窗点击事件
 * */


function suspensionEvent() {
  $('.suspension-window img').off().on('click', function () {
    var url = $(this).attr('data-url');

    if (url) {
      T.fn.changeURL(url); //T.fn.action10061({url:url});
    }
  });
  $('.suspension-window .icon-close').off().on('click', function () {
    $('.suspension-window').hide();
    T.saveMapMesg({
      suspensionWindowFlag: oVal.nowDay
    });
  });
}
/**
 * 获取快捷菜单
 * */


function getKJCD() {
  //清下缓存
  //T.saveFileMesg(" ", oVal.nineBoxFile, function () {});
  //return;
  T.readFileMesg(oVal.nineBoxFile, function (oDataNine) {
    try {
      if (oDataNine && decodeURIComponent(oDataNine) != ' ') {
        //有缓存
        oVal.nineBoxDataCache = JSON.parse(decodeURIComponent(oDataNine)); // console.log("缓存数据",oVal.nineBoxDataCache);
      } else {
        oVal.nineBoxDataCache = [];
      }
    } catch (error) {
      oVal.nineBoxDataCache = [];
    }

    $.getData({
      oSendData: {
        action: '49895',
        position: 'SY',
        ReqlinkType: 2
      },
      isload: false,
      fnSuccess: function fnSuccess(oData) {
        // console.log("新版首页快捷菜单",oData);
        oVal.nineBoxData = []; //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|

        if (oData && oData.GRID0 && oData.GRID0.length > 1) {
          var gData = oData.GRID0;

          for (var i = 1; i < gData.length; i++) {
            var _result = gData[i].split('|'),
                obj = {};

            obj.onlyName = 'nineData' + _result[oData.ENTRYNAME_INDEX || 0]; //手动拼接唯一id

            obj.name = _result[oData.ENTRYNAME_INDEX || 0]; //图片名称

            obj.url = _result[oData.ENTRYURL_INDEX || 2]; //图片地址

            obj.jumpUrl = _result[oData.LINK_INDEX || 4]; //跳转地址

            obj.lookLogin = _result[oData.LOGINSTATUS_INDEX || 5]; //登录查看

            obj.version = _result[oData.VERSION_INDEX || 6]; //版本限制

            obj.operationstatus = _result[oData.OPERATIONSTATUS_INDEX || 8]; //强制运营位

            obj.sort = i - 1; //排序

            obj.isCacheFlag = '0'; //缓存标志 0:否，1是

            if (obj.version) {
              if (commonFunction.compareVersion(oVal.currVersion, obj.version)) {
                oVal.nineBoxData.push(obj);
              }
            } else {
              oVal.nineBoxData.push(obj);
            }
          } // handleNineBox()


          getHotBox();
        } else {
          //快捷菜单无数据
          getHotBox();
        }
      },
      oConfig: function oConfig() {
        getHotBox();
      }
    });
  });
}
/**
 * 获取新手快捷菜单
 * */



function getNewKJCD() {
  $.getData({
    oSendData: {
      action: '49895',
      position: 'XS',
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      // console.log("新手首页快捷菜单",oData);
      oVal.nineBoxData_new = []; //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|
console.log(oData,'oData');
      if (oData && oData.GRID0 && oData.GRID0.length > 1) {
        var gData = oData.GRID0;
        var sHtml = '';
        sHtml += '<div class="swiper-slide"><div class="nine-chequer-group clear">';
        var gDln = 6; //默认显示前五个
        // oldType.typeVersion
        if (gData.length > 5&&oVal.HFFONTTYPE!='1') {
          gDln = 6;
         
        }else if(gData.length > 6&&oVal.HFFONTTYPE=='1'){
          gDln = 7;
        }
         else {
          gDln = gData.length;
        }

        for (var i = 1; i < gDln; i++) {
          var _result = gData[i].split('|'),
              obj = {};

          obj.onlyName = 'nineData' + _result[oData.ENTRYNAME_INDEX || 0]; //手动拼接唯一id

          obj.name = _result[oData.ENTRYNAME_INDEX || 0]; //图片名称

          obj.url = _result[oData.ENTRYURL_INDEX || 2]; //图片地址

          obj.jumpUrl = _result[oData.LINK_INDEX || 4]; //跳转地址

          obj.lookLogin = _result[oData.LOGINSTATUS_INDEX || 5]; //登录查看

          obj.version = _result[oData.VERSION_INDEX || 6]; //版本限制

          obj.sort = i - 1; //排序

          obj.isCacheFlag = '0'; //缓存标志 0:否，1是

          if (obj.version) {
            if (commonFunction.compareVersion(oVal.currVersion, obj.version)) {
              oVal.nineBoxData_new.push(obj);
              sHtml += '<div class="nine-chequer-list" data-url="' + obj.jumpUrl + '" data-title="' + obj.name + '">\n' + '       <i class="icon-img"><img src="' + obj.url + '""></i>\n' + '       <em>' + obj.name + '</em>\n' + '   </div>';
            }
          } else {
            oVal.nineBoxData_new.push(obj);
            sHtml += '<div class="nine-chequer-list" data-url="' + obj.jumpUrl + '" data-title="' + obj.name + '">\n' + '       <i class="icon-img"><img src="' + obj.url + '""></i>\n' + '       <em>' + obj.name + '</em>\n' + '   </div>';
          }
        }

        sHtml += '</div></div>';
        $('.swiper-container-nine .swiper-wrapper').html(sHtml);
        nineBoxEvent();
      } else {//快捷菜单无数据
      }
    },
    oConfig: function oConfig() {}
  });
}
/**
 * 获取热门数据
 * */


function getHotBox() {
  $.getData({
    oSendData: {
      action: '49897',
      position: 'SY',
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      //console.log("热门数据",oData);
      oVal.hotBoxData = []; //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|

      if (oData && oData.GRID0 && oData.GRID0.length > 1) {
        var gData = oData.GRID0;

        for (var i = 1; i < gData.length; i++) {
          var _result = gData[i].split('|'),
              obj = {};

          obj.onlyName = 'hotData' + _result[oData.ENTRYNAME_INDEX || 0]; //手动拼接唯一id

          obj.name = _result[oData.ENTRYNAME_INDEX || 0]; //图片名称

          obj.url = _result[oData.ENTRYURL_INDEX || 2]; //图片地址

          obj.jumpUrl = _result[oData.LINK_INDEX || 4]; //跳转地址

          obj.lookLogin = _result[oData.LOGINSTATUS_INDEX || 5]; //登录查看

          obj.version = _result[oData.VERSION_INDEX || 6]; //版本限制

          obj.sort = i - 1; //排序

          obj.isCacheFlag = '0'; //缓存标志 0:否，1是

          if (obj.version) {
            if (commonFunction.compareVersion(oVal.currVersion, obj.version)) {
              oVal.hotBoxData.push(obj);
            }
          } else {
            oVal.hotBoxData.push(obj);
          }
        } //handleHotBox()


        getMoreBox(); //加载更多数据
      } else {
        //快捷菜单无数据
        getMoreBox(); //加载更多数据
      }
    },
    oConfig: function oConfig() {
      getMoreBox(); //加载更多数据
    }
  });
}
/**
 * 获取更多数据
 * */


function getMoreBox() {
  oVal.moreBoxData = [];
  $.getData({
    oSendData: {
      action: '49896',
      position: 'SY',
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      if (oData.DATA) {
        // console.log("更多数据",JSON.parse(oData.DATA));
        var _result = JSON.parse(oData.DATA);

        if (_result.length > 0) {
          for (var i = 0; i < _result.length; i++) {
            var obj = {};
            obj.columnEntryName = _result[i].columnEntry.columnEntryName; //栏目名称

            obj.columnId = _result[i].columnEntry.columnId; //栏目id

            obj.columnSort = _result[i].columnEntry.columnSort; //栏目排序？

            obj.columnData = [];

            if (_result[i].entryList.length > 0) {
              for (var j = 0; j < _result[i].entryList.length; j++) {
                var columnDataObj = {
                  onlyName: 'allData' + _result[i].entryList[j].entryName,
                  //手动拼接唯一id
                  name: _result[i].entryList[j].entryName,
                  jumpUrl: _result[i].entryList[j].link,
                  version: _result[i].entryList[j].version,
                  lookLogin: _result[i].entryList[j].loginStatus,
                  url: _result[i].entryList[j].entryUrl,
                  sort: j,
                  operationStatus: _result[i].entryList[j].operationStatus,
                  //强制运营位
                  isCacheFlag: '0'
                };
                var htmlShowFlag = true;

                if (columnDataObj.version) {
                  if (commonFunction.compareVersion(oVal.currVersion, columnDataObj.version)) {
                    if (columnDataObj.lookLogin == '1') {
                      if (oVal.jylogin > 1) {
                        htmlShowFlag = true;
                      } else {
                        htmlShowFlag = false;
                      }
                    } else {
                      htmlShowFlag = true;
                    }
                  } else {
                    htmlShowFlag = false;
                  }
                } else {
                  if (columnDataObj.lookLogin == '1') {
                    if (oVal.jylogin > 1) {
                      htmlShowFlag = true;
                    } else {
                      htmlShowFlag = false;
                    }
                  } else {
                    htmlShowFlag = true;
                  }
                }

                if (htmlShowFlag) {
                  obj.columnData.push(columnDataObj);
                }
              }
            }

            oVal.moreBoxData.push(obj);
          }
        }

        handleData();
      } else {
        handleData();
      }
    },
    oConfig: function oConfig() {
      handleData();
    }
  });
}
/**
 * 处理默认+热门+更多数据
 * */


function handleData() {
  // console.log("我的应用可显示数据:",oVal.nineBoxData);
  // console.log("热门可显示数据:",oVal.hotBoxData);
  // console.log("更多可显示数据:",oVal.moreBoxData);
  //比对数据，确认缓存数据的可用性
  if (oVal.nineBoxDataCache) {
    //有缓存数据
    var usableData = [];
    var unmovableData = [];
    var nineBoxUseableData = [];
    var hotBoxUseableData = [];
    var moreBoxUseableData = [];

    for (var i = 0; i < oVal.nineBoxData.length; i++) {
      var name = oVal.nineBoxData[i].name;

      if (oVal.nineBoxData[i].operationstatus == '0') {
        oVal.nineBoxData[i].isCacheFlag = '1';
        unmovableData.push(oVal.nineBoxData[i]);
      }

      for (var j = 0; j < oVal.nineBoxDataCache.length; j++) {
        if (name == oVal.nineBoxDataCache[j].name) {
          oVal.nineBoxData[i].isCacheFlag = '1';

          if (oVal.nineBoxData[i].operationstatus != '0') {
            nineBoxUseableData.push(oVal.nineBoxData[i]);
          }

          break; // oVal.nineBoxData[i].isCacheFlag = "1";
          // oVal.nineBoxDataCache[j].isCacheFlag = "1";
          // oVal.nineBoxDataCache[j].url = oVal.nineBoxData[i].url;
          // oVal.nineBoxDataCache[j].jumpUrl = oVal.nineBoxData[i].jumpUrl;
          // usableData.push(oVal.nineBoxDataCache[j]);
        } else {
          oVal.nineBoxData[i].isCacheFlag = '0';
        }
      }
    }

    for (var i = 0; i < oVal.hotBoxData.length; i++) {
      var name = oVal.hotBoxData[i].name;

      for (var j = 0; j < oVal.nineBoxDataCache.length; j++) {
        if (name == oVal.nineBoxDataCache[j].name) {
          oVal.hotBoxData[i].isCacheFlag = '1';
          hotBoxUseableData.push(oVal.hotBoxData[i]);
          break; // oVal.hotBoxData[i].isCacheFlag = "1";
          // oVal.nineBoxDataCache[j].isCacheFlag = "1";
          // oVal.nineBoxDataCache[j].url = oVal.hotBoxData[i].url;
          // oVal.nineBoxDataCache[j].jumpUrl = oVal.hotBoxData[i].jumpUrl;
          // usableData.push(oVal.nineBoxDataCache[j]);
        } else {
          oVal.hotBoxData[i].isCacheFlag = '0';
        }
      }
    }

    for (var i = 0; i < oVal.moreBoxData.length; i++) {
      var columnData = oVal.moreBoxData[i].columnData;

      for (var j = 0; j < columnData.length; j++) {
        var name = columnData[j].name;

        if (columnData[j].operationStatus == '0') {
          columnData[j].isCacheFlag = '1';
          columnData[j].operationstatus = columnData[j].operationStatus;
          unmovableData.push(columnData[j]);
        }

        for (var k = 0; k < oVal.nineBoxDataCache.length; k++) {
          if (name == oVal.nineBoxDataCache[k].name) {
            columnData[j].isCacheFlag = '1';

            if (columnData[j].operationStatus != '0') {
              moreBoxUseableData.push(columnData[j]);
            }

            break; // columnData[j].isCacheFlag = "1";
            // oVal.nineBoxDataCache[k].isCacheFlag = "1";
            // oVal.nineBoxDataCache[k].url = columnData[j].url;
            // oVal.nineBoxDataCache[k].jumpUrl = columnData[j].jumpUrl;
            // usableData.push(oVal.nineBoxDataCache[k]);
          } else {
            columnData[j].isCacheFlag = '0';
          }
        }
      }
    } //强运营位数据去重


    for (var i = 0; i < unmovableData.length - 1; i++) {
      for (var j = i + 1; j < unmovableData.length; j++) {
        if (unmovableData[i].name == unmovableData[j].name) {
          unmovableData.splice(j, 1); //console.log(arr[j]);

          j--;
        }
      }
    } //去除缓存的九宫格强运营位数据


    var nineBoxDataCacheTemp = oVal.nineBoxDataCache.filter(function (item) {
      return item.operationstatus != '0';
    });
    var editableData = nineBoxUseableData.concat(hotBoxUseableData, moreBoxUseableData);

    for (var i = 0; i < nineBoxDataCacheTemp.length; i++) {
      for (var j = 0; j < editableData.length; j++) {
        if (nineBoxDataCacheTemp[i].name == editableData[j].name) {
          unmovableData.push(editableData[j]);
        }
      }
    } //数组去重


    for (var i = 0; i < unmovableData.length - 1; i++) {
      for (var j = i + 1; j < unmovableData.length; j++) {
        if (unmovableData[i].name == unmovableData[j].name) {
          unmovableData.splice(j, 1); //console.log(arr[j]);

          j--;
        }
      }
    }
    /*过滤冗余数据*/
    // usableData = usableData.filter(function (item) {
    //     return item.isCacheFlag == "1";
    // });


    oVal.nineBoxDataCache = unmovableData;
    T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {}); // console.log(oVal.nineBoxDataCache)
    // oVal.nineBoxDataCache = usableData;
    // oVal.nineBoxDataCache.sort(commonFunction.compare('sort'));
    // loadNineBox();

    handleNineBox();
  }
}
/**
 * 处理九宫格数据
 * */


function handleNineBox() {
  if (oVal.nineBoxDataCache.length > 0) {
    //缓存有数据
    if (oVal.nineBoxDataCache.length < 9) {
      //缓存数据不足9，默认栏目补充
      for (var i = 0; i < oVal.nineBoxData.length; i++) {
        oVal.nineBoxData[i].isCacheFlag = '1';

        for (var j = 0; j < oVal.moreBoxData[0].columnData.length; j++) {
          if (oVal.moreBoxData[0].columnData[j].isCacheFlag != '1') {
            oVal.moreBoxData[0].columnData[j].isCacheFlag = '1';
            oVal.nineBoxDataCache.push(oVal.moreBoxData[0].columnData[j]);
          }
        }
      }
    } else if (oVal.nineBoxDataCache.length > 9) {
      var nineBoxDataNew = [];

      for (var i = 0; i < 9; i++) {
        nineBoxDataNew.push(oVal.nineBoxDataCache[i]);
      }

      oVal.nineBoxDataCache = nineBoxDataNew;
    }

    T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {});
  } else {
    for (var i = 0; i < oVal.nineBoxData.length; i++) {
      if (i > 9) break;
      oVal.nineBoxData[i].isCacheFlag = '1';
      oVal.nineBoxDataCache.push(oVal.nineBoxData[i]);
    }

    T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {}); // oVal.nineBoxDataCache = oVal.nineBoxData.slice(0,9);
    // oVal.nineBoxDataCache.sort(commonFunction.compare('sort'));
    //加载数据
  }

  loadNineBox();
}
/**
 * 加载九宫格数据
 * */

 
function loadNineBox() {
 
  //加载数据
  // console.log("加载数据",oVal.nineBoxDataCache);
  var sHtml = '',
      cacheData = [];
  cacheData = cacheData.concat(oVal.nineBoxDataCache); // if(oVal.nineBoxDataCache.length < 9) {//缓存有数据数量少于9，需要从我的应用补充
  //     for(var i = 0;i < oVal.nineBoxData.length; i++){
  //         var diffFlag = true;
  //         for(var j = 0;j < oVal.nineBoxDataCache.length;j++){
  //             if(oVal.nineBoxDataCache[j].name === oVal.nineBoxData[i].name){
  //                 diffFlag = false;
  //                 break;
  //             }
  //         }
  //         if(diffFlag && cacheData.length < 9){
  //             cacheData.push(oVal.nineBoxData[i]);
  //         }
  //     }
  //     //需要更新缓存
  //     T.saveFileMesg(JSON.stringify(cacheData), oVal.nineBoxFile, function () {});
  // }
console.log('oVal',oVal,oVal.nineBoxDataCache ,oVal.HFFONTTYPE !='1');
  if (oVal.nineBoxDataCache.length >= 9 &&oVal.HFFONTTYPE !='1') {
    cacheData = oVal.nineBoxDataCache.slice(0, 9);
  }else{
    cacheData = oVal.nineBoxDataCache.slice(0, 8);
  }


  var moreObj = {
    name: '更多',
    url: '/home_new/images/gd.png',
    jumpUrl: '/home_new/home_newMenuMore.html',
    tzthiddentitle: '1',
    tztadjustnever: '1',
    statusBarDark: '1',
    fullscreen: '1'
  };
  cacheData.push(moreObj);

  if (cacheData.length > 9) {
    cacheData = cacheData.chunk(10); //分隔图片以5个为一组

    for (var i = 0; i < cacheData.length; i++) {
      sHtml += '<div class="swiper-slide"><div class="nine-chequer-group clear">';

      for (var j = 0; j < cacheData[i].length; j++) {
        var click_url = cacheData[i][j].jumpUrl,
            //跳转地址
        img_url = cacheData[i][j].url,
            //图片地址
        lookLogin = cacheData[i].lookLogin || '',
            //登录查看
        img_title = cacheData[i][j].name; //图片名称

        sHtml += '<div class="nine-chequer-list" data-url="' + click_url + '" data-title="' + img_title + '">\n' + '       <i class="icon-img"><img src="' + img_url + '""></i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
      }

      sHtml += '</div></div>';
    }
  } else {
    sHtml += '<div class="swiper-slide"><div class="nine-chequer-group clear">';

    for (var j = 0; j < cacheData.length; j++) {
      var click_url = cacheData[j].jumpUrl,
          //跳转地址
      img_url = cacheData[j].url,
          //图片地址
      img_title = cacheData[j].name; //图片名称

      sHtml += '<div class="nine-chequer-list" data-url="' + click_url + '" data-title="' + img_title + '">\n' + '       <i class="icon-img"><img src="' + img_url + '""></i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
    }

    sHtml += '</div></div>';
  }

  $('.swiper-container-nine .swiper-wrapper').html(sHtml);
  $('.swiper-pagination-nine').show();
  oVal.swiperNine = new Swiper('.swiper-container-nine', {
    slidesPerView: 'auto',
    pagination: '.swiper-pagination-nine',
    onTouchEnd: function onTouchEnd(swiper, event) {//console.log("数据已存储",swiper,event)
    }
  });

  if ($('.swiper-container-nine .swiper-slide').length <= 1) {
    $('.swiper-pagination-nine').hide();
  }

  nineBoxEvent();
}
/**
 * 九宫格跳转事件
 * */


function nineBoxEvent() {
  $('.swiper-container-nine .nine-chequer-list').off('click').on('click', function (e) {
    e.stopPropagation();

    var _this = $(this);

    var jumpUrl = _this.attr('data-url'),
        title = $(this).attr('data-title'),
        needLogin = $(this).attr('data-lookLogin');

    var hfzqSign = T.getUrlParameter('hfzqSign', jumpUrl); //快捷菜单事件埋点

    sa.track('icon_syclick', {
      business_module: '业务类',
      first_module: '探索',
      second_module: '首页',
      third_module: '首页',
      page_name: '首页',
      button_name: title,
      jump_url: jumpUrl
    });

    if (needLogin == '1' && oVal.jylogin < 2) {
      T.fn.action10090({
        logintype: 1
      });
    } else {
      if (title == '更多') {
        T.fn.action10061({
          url: jumpUrl,
          tzthiddentitle: '1',
          tztadjustnever: '1',
          statusBarDark: '1'
        });
      } else {
        if (title.indexOf('多元金融') >= 0) {
          versionsProcess('3.1.3', function (flag) {
            if (flag) {
              dyjrFunc(jumpUrl);
            } else {
              alert('当前客户端版本过低，请更新客户端至更高版本');
            }
          });
        } else {
          var needLogin = T.getUrlParameter('needLogin', jumpUrl),
              wtType = T.getUrlParameter('wtType', jumpUrl);

              var isThird = T.getUrlParameter('isThird',jumpUrl);

              if(isThird == 1) {
                  if(!!oVal.MOBILECODE && oVal.jylogin >= 1) { //第三种 已注册已登录
                      algorithmBusJump(jumpUrl);
                  }else{
                    if(T.judge('ISIOS')) {
                      T.fn.action10090({ jsfuncname: "algorithmBusJump('"+encodeURIComponent(jumpUrl)+"')"});
                    } else {
                        T.fn.action10090({ jsfuncname: "algorithmBusJump('"+jumpUrl+"')"});
                    }
                  }
                  return;
              }

          if (wtType) {
            //跳转网厅
            T.readLocalMesg(['MOBILECODE', 'jyloginflag'], function (oLocal) {
              jumpUrl = jumpUrl.replace('&wtType=1', ''); //dataUrl=encodeURIComponent(dataUrl);

              if (!!oLocal.MOBILECODE && oLocal.JYLOGINFLAG >= 1) {
                //第三种 已注册已登录
                wtJump(jumpUrl);
              } else {
                T.fn.action10090({
                  jsfuncname: "wtJump('" + jumpUrl + "')"
                });
              }
            });
          } else if (needLogin) {
            jumpUrl = jumpUrl.replace('&needLogin=1', '');

            if (oVal.jylogin < 2) {
              T.fn.action10090({
                logintype: 1
              });
            } else {
              T.fn.changeurl(jumpUrl);
            }
          } else {
            T.fn.changeurl(jumpUrl);
          }
          /*else if(!!hfzqSign && hfzqSign == "yearBill"){
          //年度账单
          if(oVal.jylogin >= 1) { //第三种 已注册已登录
              jumpNDZD(jumpUrl)
          }else{
              T.fn.action10090({ jsfuncname: "jumpNDZD('"+jumpUrl+"')"});
          }
          }*/

        }
      }
    }
  });
}
/**
 * 跳转年度账单
 * */


function jumpNDZD(dataUrl) {
  $.getData({
    oSendData: {
      action: 6771,
      ReqlinkType: '1'
    },
    fnSuccess: function fnSuccess(reg) {
      var SERVTICKET_ID = reg.SERVTICKET_ID;

      var _url = dataUrl.split('url=');

      if (!!SERVTICKET_ID) {
        T.fn.changeurl(_url[0] + 'url=' + encodeURIComponent(_url[1] + '&token=' + SERVTICKET_ID));
      } else {
        alert('未获取到token');
      }
    },
    oConfig: function oConfig(error) {
      alert(error.ERRORMESSAGE);
    }
  });
}
/**
 * 加载内容条
 * */


function loadTabHtml() {
  /*var loadUrl = "";
  if(oVal.pageType == "tuijian"){
      loadUrl = "./home_new_tuijian_tpl.html";
  }else if(oVal.pageType == "724"){
      loadUrl = "./home_new_724_tpl.html";
  }else if(oVal.pageType == "yaowen"){
      loadUrl = "./home_new_yaowen_tpl.html";
  }else if(oVal.pageType == "jiepan"){
      loadUrl = "./home_new_jiepan_tpl.html";
  } else if(oVal.pageType == "shiting"){
      loadUrl = "./home_new_shiting_tpl.html";
  } else if(oVal.pageType == "tougu"){
      loadUrl = "./home_new_tougu_tpl.html";
  }*/
  var loadUrl = './home_new_' + oVal.pageType + '_tpl.html';
  $('.page-content').html('');
  loadHtml(loadUrl, function (oData) {
    $('.page-content').html(oData);
    /*$('.page-content').css({
        opacity:"1",
        transition: "all 1s",
    });*/
  });
}
/**
 * 加载页面
 * */


function loadHtml(url, func) {
  //加载页面
  var v = '';

  if (typeof config != 'undefined') {
    v = config.version;
  } else {
    v = '0.0.1';
  }

  $.ajax({
    url: url + '?v=' + v,
    type: 'get',
    dataType: 'html',
    headers: {
      acessfr0mtztwebv1ew: 'acess-fr0m-andr0id-tzt-webv1ew'
    },
    beforeSend: function beforeSend() {},
    success: function success(data) {
      data ? func && func(data) : alert('网络连接断开!');
    },
    complete: function complete() {},
    error: function error() {
      alert('网络连接断开!');
    }
  });
}
/**
 * 导航栏悬浮
 * */


function stickyEvent() {
  sticky = new Sticky('.sticky-header');
}
/**
 * 页面点击事件
 * */


function pageEvent() {
  $('.nav-slide').off().on('click', function () {
    $(document).scrollTop(0);
    oVal.pageType = $(this).attr('data-type');
    loadTabHtml();
    $(this).addClass('active').siblings().removeClass('active'); // !TODO
    // pageSensors.reportClick('newsTabClick', {
    //     tab_name: $(this).find('span').text(),
    //     tab_area: $(this).find('span').text(),
    // });
  }); //消息中心跳转

  $('.scroll-info-tz').off().on('click', function () {
    var oSend = {
      url: '/dist/src/message-center/index.html#/index'
    };
    oSend.tzthiddentitle = 1; //客户端隐藏导航栏

    oSend.tztadjustnever = 0;
    oSend.TitleSkinType = 1; // pageSensors.reportClick('wordNoticeClick', {
    //     content_name: $(this).find('.swiper-slide-active span').text(),
    //     jump_type: '文字链',
    //     jump_url: oSend.url,
    // });

    T.fn.action10061(oSend);
  });
}
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
 *网厅跳转
 *
 * @param {string} dataUrl 跳转地址
 */


function wtJump(dataUrl) {
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
              isload: false,
              fnSuccess: function fnSuccess(oData) {
                var PUBLICK_KEY = oData.WSYYT,
                    MD5_KEY = oData.HSSTRING;
                var str = JSON.stringify({
                  token: SERVTICKET_ID,
                  from: 'sidi',
                  time: serverTime
                });
                var senddata = encryptRsaTWO(PUBLICK_KEY, MD5_KEY, str);
                var oUrl = dataUrl + '&data=' + senddata.data;
                T.fn.changeurl('http://action:58117/?url=' + encodeURIComponent(oUrl));
              }
            });
          },
          oConfig: function oConfig() {}
        });
      }
    },
    oConfig: function oConfig() {}
  });
}
/*多元金融*/


function dyjrFunc(thisurl) {
  //多元金融：传递客户身份3要素（姓名、证件类型和证件号码）给门户
  oCache.thisurl = thisurl;
  T.reqsofttodo({
    hf_dyjrurl: thisurl
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
        isload: false,
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
              hfReadLocalFile('dyjrauthorizeFile', 'hfReadLocalFileSyCallBack');
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
/**
 * 加密专用
 * */


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

function encryptRsaTWO(publickkey, md5key, str) {
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

window.GoBackOnLoad = function () {
  console.log('GoBackOnLoad刷新');
  T.fn.changeurl('http://action:10077/?');
  timestamp = 0;
  init(true);
  pageRefresh();
};