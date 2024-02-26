"use strict";

var sticky = null,
    //悬浮导航栏设置
ScrollTop_start = 0,
    //页面滚动距离顶部高度点（初始）
ScrollTop_end = 0,
    //页面滚动距离顶部高度点（结束）
scrollArr = [],
    //滚动锚点数据记录
swiperClick = true,
    pageClick = true,
    timer = null,
    // 定时器
oVal = {}; //全局变量存储

var oCache = {};
var el = document.getElementById('no-drag');

window.ondragenter = function () {
  return false;
};

oVal.nineBoxFile = 'appNineBoxFile.txt'; //首页九宫格缓存名称

oVal.nineBoxDataCache = ''; //首页九宫格缓存文件

oVal.htmlType = 'complete'; //edit(编辑)，complete(完成)

$(function () {
  T.readLocalMesg(['jyloginflag', 'logintype=1', 'MOBILECODE', 'statusBarHeight'], function (oData) {
    //判断登录
    oVal.jylogin = oData.JYLOGINFLAG;
    oVal.MOBILECODE = oData.MOBILECODE;
    init(); // const statusBarHeight = oData.STATUSBARHEIGHT || 44;
    // $('#statusBarHeight').css('height', statusBarHeight);
  });
});

function init() {
  sa.track('pageview', {
    business_module: '业务类',
    first_module: '探索',
    second_module: '首页',
    third_module: '首页',
    page_name: '全部宫格'
  });

  pageEvent();
  getNineBox();
}
/**
 * 拖拽功能
 * */

/**
 * 拖拽功能
 * */


function sortbaleEvent() {
  // 拖拽功能
  var el = document.getElementById('bar');
  new Sortable(el, {
    //handle:'.dis',           //指定的class能拖拽
    draggable: '.able',
    //指定的class 能够拖拽排序
    onAdd: function onAdd(evt) {//console.log('onAdd.bar:', evt.item);
    },
    onUpdate: function onUpdate(evt) {//console.log('onUpdate.bar:', evt.item);
    },
    onRemove: function onRemove(evt) {//console.log('onRemove.bar:', evt.item);
    },
    onStart: function onStart(evt) {//console.log('onStart.foo:', evt.item);
    },
    onEnd: function onEnd(evt) {//console.log('onEnd.foo:', evt);
    }
  });
}
/**
 * 导航栏悬浮
 * */


function stickyEvent() {
  var dom = document.querySelector('.sticky-header'),
      domTop = dom.offsetTop;
  console.log(dom.offsetTop);
  var scrollBox = document.querySelector('.more-page');
  console.log(scrollBox);
  scrollBox.addEventListener('scroll', scrollFunc);
  var top = $('#statusBarHeight').height() + $('.nav-header').height();

  function scrollFunc() {
    // 定位顶部
    if (scrollBox.scrollTop > domTop) {
      console.log(top);
      dom.style.position = 'fixed';
      dom.style.top = top + 'px';
    } else {
      dom.style.position = 'static';
    }
  }

  scrollFunc(); // sticky = new Sticky('.sticky-header', {
  //     stickyContainer: '.more-page',
  // });
}
/**
 * 获取九宫格数据
 * */


function getNineBox() {
  T.readLocalMesg(['softversion', 'jyloginflag'], function (oLocal) {
    // 限制3.2.1及以后版本出现指纹/面容登录入口
    oVal.currVersion = oLocal.SOFTVERSION;
    oVal.jylogin = oLocal.JYLOGINFLAG; //清下缓存
    //T.saveFileMesg(" ", oVal.nineBoxFile, function () {});

    T.readFileMesg(oVal.nineBoxFile, function (oDataNine) {
      if (oDataNine && decodeURIComponent(oDataNine) != ' ') {
        //有缓存
        oVal.nineBoxDataCache = JSON.parse(decodeURIComponent(oDataNine)); // console.log("缓存数据",oVal.nineBoxDataCache);
      } else {
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
          // console.log("我的应用：",oData);
          oVal.nineBoxData = []; //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|
          //中台新增字段： operationStatus 是否为强运营位标识。 0是1否

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
                  if (obj.lookLogin == '1') {
                    if (oVal.jylogin > 1) {
                      oVal.nineBoxData.push(obj);
                    }
                  } else {
                    oVal.nineBoxData.push(obj);
                  }
                }
              } else {
                if (obj.lookLogin == '1') {
                  if (oVal.jylogin > 1) {
                    oVal.nineBoxData.push(obj);
                  }
                } else {
                  oVal.nineBoxData.push(obj);
                }
              }
            } // console.log(oVal.nineBoxData)
            //handleNineBox()


            getHotBox(); //加载热门数据
          } else {
            //快捷菜单无数据
            getHotBox(); //加载热门数据
          }
        },
        oConfig: function oConfig() {
          getHotBox(); //加载热门数据
        }
      });
    });
  });
}
/**
 * 处理九宫格数据
 * */


function handleNineBox() {
  // console.log(oVal.nineBoxDataCache)
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

      for (var i = 0; i < oVal.nineBoxDataCache.length; i++) {
        if (i < 9) {
          nineBoxDataNew.push(oVal.nineBoxDataCache[i]);
        } else {// for(var j = 0;j < oVal.nineBoxData.length; j++){
          //     if(oVal.nineBoxDataCache[i].name == oVal.nineBoxData[j].name) {
          //         oVal.nineBoxData[i].isCacheFlag = '0';
          //     }
          // }
        }
      }

      oVal.nineBoxDataCache = nineBoxDataNew;
    }

    T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {});
  } else {
    //正常来说不会进入
    oVal.nineBoxDataCache = [];

    for (var i = 0; i < oVal.nineBoxData.length; i++) {
      if (i > 9) break;
      oVal.nineBoxDataCache.push(oVal.nineBoxData[i]);
    }

    T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {});
  } //数据排序处理


  sortNineBox();
}
/**
 * 数据排序处理
 * */


function sortNineBox() {
  // oVal.nineBoxDataCache.sort(commonFunction.compare('sort'));
  loadNineBox();
}
/**
 * 加载九宫格数据
 * htmlType=edit(编辑)，complete(完成)
 * */


function loadNineBox() {
  var htmlType = oVal.htmlType; //加载数据
  // console.log("我的应用展示：",oVal.nineBoxDataCache);

  var sHtml = '',
      cacheData = [];
  cacheData = oVal.nineBoxDataCache; //当前-我的应用显示数据
  // if (htmlType == 'edit') {

  sHtml += '<div class="application-group-list clear" id="bar">'; // } else {
  //     sHtml += '<div class="application-group-list-small application-group-list clear">';
  // }

  for (var j = 0; j < cacheData.length; j++) {
    var img_url = cacheData[j].url,
        //图片地址
    isCacheFlag = cacheData[j].isCacheFlag,
        jumpUrl = cacheData[j].jumpUrl,
        lookLogin = cacheData[j].lookLogin,
        version = cacheData[j].version,
        sort = cacheData[j].sort,
        operationstatus = cacheData[j].operationstatus,
    img_title = cacheData[j].name; //图片名称
    // if (htmlType == 'edit') {

    if (operationstatus == '0') {
      //强制运营位没有删除图标
      // console.log(operationstatus)
      sHtml += '<div class="group-list-item" data-name="' + img_title + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + img_url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '" data-operationstatus="' + operationstatus + '">\n' + '       <i class="icon-img">' + '           <img src="' + img_url + '" alt="">';
    } else {
      sHtml += '<div class="group-list-item ' + (htmlType == 'edit' ? 'able' : '') + '" data-name="' + img_title + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + img_url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '" data-operationstatus="' + operationstatus + '">\n' + '       <i class="icon-img">' + '           <img src="' + img_url + '" alt="">';

      if (htmlType == 'edit') {
        sHtml += '<i class="icon-minus"></i>\n';
      }
    }

    sHtml += '</i><em>' + img_title + '</em></div>'; // } else {
    //     sHtml += '<i class="icon-img"><img src="' + img_url + '" alt=""></i>';
    // }
  }

  sHtml += '</div>'; // if (htmlType == 'edit') {

  $('.my-group .application-group-title-list').html('').hide();
  $('.my-group .application-group-lists').html(sHtml).show();
 
  $('.my-group-tips').show();
  $('.my-group').addClass('wdyy')
  sortbaleEvent();
  nineBoxEvent(); // } else {
  // $('.my-group-tips').hide();
  // $('.my-group .application-group-lists').html('').hide();
  // $('.my-group .application-group-title-list').html(sHtml);
  // }
}
/**
 * 我的应用点击事件
 * */


function nineBoxEvent() {
  $('.wdyy .application-group-lists .group-list-item').off().on('click', function (e) {
 
    var currData = $(this);
    var name = currData.attr('data-name'),
        isCacheFlag = currData.attr('data-isCacheFlag'),
        jumpUrl = currData.attr('data-jumpUrl'),
        lookLogin = currData.attr('data-lookLogin'),
        version = currData.attr('data-version'),
        sort = currData.attr('data-sort'),
        url = currData.attr('data-url');
    sa.track('icon_syclick', {
      business_module: '业务类',
      first_module: '探索',
      second_module: '首页',
      third_module: '首页',
      page_name: '全部宫格',
      column_name: '我的应用',
      button_name: name,
      jump_url: jumpUrl
    });
    if (oVal.htmlType == 'edit') return;

    if (lookLogin == '1' && oVal.jylogin < 2) {
      T.fn.action10090({
        logintype: 1
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
          jumpUrl = jumpUrl.replace('&wtType=1', ''); //dataUrl=encodeURIComponent(dataUrl);

          if (!!oVal.MOBILECODE && oVal.jylogin >= 1) {
            //第三种 已注册已登录
            wtJump(jumpUrl);
          } else {
            T.fn.action10090({
              jsfuncname: "wtJump('" + jumpUrl + "')"
            });
          }
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
      
       
    }
  });
  $('.able .icon-img>i').off('touchstart').on('touchstart', function (e) {
    console.log('22222222',e);
    e.preventDefault();
    e.stopPropagation();
    var name = $(this).parent().parent().attr('data-name'),
        self = $(this);
    $('.group-list-item').each(function () {
      if ($(this).attr('data-name') == name && !$(this).hasClass('able')) {
        $(this).find('.icon-img>i').removeClass('icon-minus').addClass('icon-add');
        self.parent().parent().remove();
        return;
      }
    });
  });
}
/**
 * 滚动事件
 * */


function scrollEvent() {
  var screenHeight = $('body').height(),
      titleHeight = $('.nav-header')[0].clientHeight,
      stickHeight = $('.nav-group-position').height(),
      marginbtHeight = Number($('.application-group').css('marginBottom').replace('px', ''));
  var scrollTopHeight = titleHeight - 10; //console.log(screenHeight,titleHeight,stickHeight,marginbtHeight);

  $('.all-application-group>div:last-child').height(screenHeight - titleHeight - stickHeight + marginbtHeight + 5); //加点数值，有误差

  $('.scroll-group').each(function () {
    var obj = {};
    obj.name = $(this).find('.application-group-list').attr('data-name'); //obj.value = $(this).find(".application-group-list").offset().top;

    if ($(this).index() == '0') {
      obj.value = $(this).offset().top - scrollTopHeight;
    } else {
      obj.value = $(this).offset().top - scrollTopHeight - 10;
    }

    scrollArr.push(obj);
    $('.slide-' + obj.name).attr('data-scrollTop', obj.value);
    $(this).attr('data-scrollTop', obj.value);
  });
  $('.nav-slide').off().on('click', function () {
    if (swiperClick) {
      $(this).addClass('active').siblings().removeClass('active');
      var slideScrollTop = $(this).attr('data-scrollTop');
      if (!slideScrollTop) return;
      swiperClick = false;
      slideLeftFn($(this).index());
      $('.more-page').scrollTop(slideScrollTop - scrollTopHeight);
      setTimeout(function () {
        swiperClick = true;
      }, 1000);
    }
  }); //console.log(scrollArr);
  // scroll监听

  $('.more-page')[0].onscroll = function () {
    //clearTimeout(timer);
    ScrollTop_start = getScrollTop(); //timer = setTimeout(isScrollEnd, 500);

    isScrollEnd(); //console.log(getScrollTop(),$(".my-group").height(),$(".hot-group").height())
  };

  function isScrollEnd() {
    ScrollTop_end = getScrollTop();

    if (ScrollTop_end === ScrollTop_start) {
      //console.log('滚动结束了',$(document).scrollTop());
      var topValue = scrollArr[0].name;

      for (var i = 0; i < scrollArr.length; i++) {
        if ($('.more-page').scrollTop() + scrollTopHeight > scrollArr[i].value) {
          topValue = scrollArr[i].name;
        }
      }

      if (topValue && swiperClick) {
        //console.log("滚动，title居中定位");
        slideLeftFn($('.slide-' + topValue).index());
      } else {
        swiperClick = true;
      }
    }
  }

  function getScrollTop() {
    return $('.more-page').scrollTop();
  }

  function slideLeftFn(activeIndex) {
    $('.nav-slide').eq(activeIndex).addClass('active').siblings().removeClass('active');
    /*.removeAttr("class")*/

    var that = $('.nav-slide').eq(activeIndex); //当前选中元素距离屏幕左侧距离

    var aLeft = that.offset().left; //当前元素宽度 一半

    var aWidth = that.width() / 2; //屏幕宽度一半

    var widths = $(window).width() / 2; //当前滚动条滚动的距离

    var scrollL = $('.nav-group').scrollLeft(); //滚动条滚动距离

    $('.nav-group').animate({
      scrollLeft: scrollL + (aLeft - widths) + aWidth
    }, 0); //延迟效果不理想，暂时移除
  }
}
/**
 * 获取热门数据
 * */


function getHotBox() {
  oVal.hotBoxData = [];
  $.getData({
    oSendData: {
      action: '49897',
      position: 'SY',
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      // console.log("热门数据",oData);
      //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|
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
              if (obj.lookLogin == '1') {
                if (oVal.jylogin > 1) {
                  oVal.hotBoxData.push(obj);
                }
              } else {
                oVal.hotBoxData.push(obj);
              }
            }
          } else {
            if (obj.lookLogin == '1') {
              if (oVal.jylogin > 1) {
                oVal.hotBoxData.push(obj);
              }
            } else {
              oVal.hotBoxData.push(obj);
            }
          }
        } // console.log(oVal.hotBoxData)
        //handleHotBox()


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
 * 处理热门数据
 * */


function handleHotBox() {
  if (oVal.hotBoxData.length > 0) {
    //数据排序处理
    sortHotBox();
  }
}
/**
 * 数据排序处理
 * */


function sortHotBox() {
  //接口排序

  /*oVal.hotBoxData.sort(commonFunction.compare('sort'));*/
  loadHotBox();
}
/**
 * 加载热门数据
 * htmlType=edit(编辑)，complete(完成)
 * */


function loadHotBox() {
  var htmlType = oVal.htmlType; //加载数据
  //console.log("热门数据",oVal.hotBoxData);

  var sHtml = '',
      cacheData = oVal.hotBoxData;
  sHtml += '<div class="application-group-title">热门</div>';
  sHtml += '<div class="application-group-list clear">';

  for (var j = 0; j < cacheData.length; j++) {
    var img_url = cacheData[j].url,
        //图片地址
    isCacheFlag = cacheData[j].isCacheFlag,
        jumpUrl = cacheData[j].jumpUrl,
        lookLogin = cacheData[j].lookLogin,
        version = cacheData[j].version,
        sort = cacheData[j].sort,
        img_title = cacheData[j].name; //图片名称

    if (htmlType == 'edit') {
      if (cacheData[j].isCacheFlag == '1') {
        sHtml += '<div class="group-list-item" data-name="' + img_title + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + img_url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">\n' + '           <img src="' + img_url + '" alt="">\n' + '           <i class="icon-minus"></i>\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
      } else {
        sHtml += '<div class="group-list-item" data-name="' + img_title + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + img_url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">\n' + '           <img src="' + img_url + '" alt="">\n' + '           <i class="icon-add"></i>\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
      }
    } else {
      sHtml += '<div class="group-list-item" data-name="' + img_title + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + img_url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">\n' + '           <img src="' + img_url + '" alt="">\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
    }
  }

  sHtml += '</div>';
  $('.hot-group').html(sHtml);
  hotEvent();
}
/**
 * 热门点击事件
 * */


function hotEvent() {



  $('.hot-group .group-list-item .icon-img>i').off().on('click', function (e) {
    e.stopPropagation();
    if (!pageClick) return;
    var currData = $(this).parent().parent(),
        sHtml = '';
    var name = currData.attr('data-name'),
        isCacheFlag = currData.attr('data-isCacheFlag'),
        jumpUrl = currData.attr('data-jumpUrl'),
        lookLogin = currData.attr('data-lookLogin'),
        version = currData.attr('data-version'),
        sort = currData.attr('data-sort'),
        url = currData.attr('data-url');

    if ($(this).hasClass('icon-add')) {
      if ($('.my-group .group-list-item').length >= 9) {
        $('.little-info-tips>span').html('当前添加已达到添加上限，请先移除后再添加');
        $('.little-info-tips').show();
        pageClick = false;
        setTimeout(function () {
          $('.little-info-tips').hide();
          pageClick = true;
        }, 2000);
        return;
      }

      $(this).removeClass('icon-add').addClass('icon-minus');
      $('.all-application-group .group-list-item').each(function () {
        if ($(this).find('em').html() == name) {
          $(this).find('.icon-img>i').removeClass('icon-add').addClass('icon-minus');
        }
      });
      sHtml += '<div class="group-list-item able" data-name="' + name + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">' + '           <img src="' + url + '" alt="">' + '           <i class="icon-minus"></i>\n' + '       </i>\n' + '       <em>' + name + '</em>\n' + '   </div>';
      $('.my-group .application-group-list').append(sHtml);
      nineBoxEvent();
    } else {
      $(this).removeClass('icon-minus').addClass('icon-add');
      $('.all-application-group .group-list-item').each(function () {
        if ($(this).find('em').html() == name) {
          $(this).find('.icon-img>i').removeClass('icon-minus').addClass('icon-add');
        }
      });
      $('.able').each(function () {
        if ($(this).attr('data-name') == name) {
          $(this).remove();
        }
      });
    }
  });
  $('.hot-group .group-list-item').off().on('click', function () {
    var currData = $(this);
    var name = currData.attr('data-name'),
        isCacheFlag = currData.attr('data-isCacheFlag'),
        jumpUrl = currData.attr('data-jumpUrl'),
        lookLogin = currData.attr('data-lookLogin'),
        version = currData.attr('data-version'),
        sort = currData.attr('data-sort'),
        url = currData.attr('data-url');
    sa.track('icon_syclick', {
      business_module: '业务类',
      first_module: '探索',
      second_module: '首页',
      third_module: '首页',
      page_name: '全部宫格',
      column_name: '热门',
      button_name: name,
      jump_url: jumpUrl
    });
    if (oVal.htmlType == 'edit') return;

    if (lookLogin == '1' && oVal.jylogin < 2) {
      T.fn.action10090({
        logintype: 1
      });
    } else {
      if (currData.find('em').text().indexOf('多元金融') >= 0) {
        T.readLocalMesg(['softversion'], function (oData) {
          if (versionfunegt(oData.SOFTVERSION, '3.1.3')) {
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
          jumpUrl = jumpUrl.replace('&wtType=1', ''); //dataUrl=encodeURIComponent(dataUrl);

          if (!!oVal.MOBILECODE && oVal.jylogin >= 1) {
            //第三种 已注册已登录
            wtJump(jumpUrl);
          } else {
            T.fn.action10090({
              jsfuncname: "wtJump('" + jumpUrl + "')"
            });
          }
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
      }
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
 * 处理更多数据
 * */


function handleMoreBox() {
  var sHtml = '',
      nHtml = '',
      cacheData = oVal.moreBoxData;
  /*oVal.moreBoxData.sort(commonFunction.compare('columnSort'));*/

  /*for(var item = 0 ; item < cacheData.length; item++){
      cacheData[item].columnData.reverse()
  }*/

  for (var i = 0; i < cacheData.length; i++) {
    var columnEntryName = cacheData[i].columnEntryName,
        //栏目名称
    columnId = cacheData[i].columnId,
        //栏目id
    columnData = cacheData[i].columnData,
        //栏目数据
    columnSort = cacheData[i].columnSort; //栏目排序？

    var firstFlag = true;

    if (i == 0) {
      firstFlag = false;
      nHtml += '<div class="nav-slide slide-' + columnId + ' active" data-name="' + columnId + '">' + columnEntryName + '</div>';
    } else {
      nHtml += '<div class="nav-slide slide-' + columnId + ' data-name="' + columnId + '">' + columnEntryName + '</div>';
    }

    if (columnData.length > 0) {
      if (firstFlag) {
        sHtml += '<div class="application-group scroll-group">' + '<div class="application-group-title">' + columnEntryName + '</div>' + '<div data-name="' + columnId + '" class="application-group-list clear">';
      } else {
        sHtml += '<div class="application-group scroll-group">' + '<div data-name="' + columnId + '" class="application-group-list clear">';
      }

      for (var j = 0; j < columnData.length; j++) {
        var name = columnData[j].name,
            isCacheFlag = columnData[j].isCacheFlag,
            jumpUrl = columnData[j].jumpUrl,
            lookLogin = columnData[j].lookLogin,
            version = columnData[j].version,
            sort = columnData[j].sort,
            operationStatus = columnData[j].operationStatus,
            url = columnData[j].url;
        var isoperationStatusStyle = '';

        if (operationStatus == '0') {
          isoperationStatusStyle = 'display:none';
        }

        if (oVal.htmlType == 'edit') {
          if (isCacheFlag == '1') {
            sHtml += '<div class="group-list-item" data-name="' + name + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">\n' + '           <img src="' + url + '" alt="">\n' + '           <i class="icon-minus" style="' + isoperationStatusStyle + '"></i>\n' + '       </i>\n' + '       <em>' + name + '</em>\n' + '   </div>';
          } else {
            sHtml += '<div class="group-list-item" data-name="' + name + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">\n' + '           <img src="' + url + '" alt="">\n' + '           <i class="icon-add" style="' + isoperationStatusStyle + '"></i>\n' + '       </i>\n' + '       <em>' + name + '</em>\n' + '   </div>';
          }
        } else {
          if (url) {
            sHtml += '<div class="group-list-item" data-name="' + name + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">\n' + '           <img src="' + url + '" alt="">\n' + '       </i>\n' + '       <em>' + name + '</em>\n' + '   </div>';
          }
        }
      }

      sHtml += '</div></div>';
    }
  }

  $('.nav-group').html(nHtml);
  $('.all-application-group').html(sHtml);
  scrollEvent();
  stickyEvent();
  moreEvent();
}
/**
 * 更多点击事件
 * */


function moreEvent() {
  $('.all-application-group .group-list-item .icon-img>i').off().on('click', function (e) {
    e.stopPropagation();
    if (!pageClick) return;
    var currData = $(this).parent().parent(),
        sHtml = '';
    var name = currData.attr('data-name'),
        isCacheFlag = currData.attr('data-isCacheFlag'),
        jumpUrl = currData.attr('data-jumpUrl'),
        lookLogin = currData.attr('data-lookLogin'),
        version = currData.attr('data-version'),
        sort = currData.attr('data-sort'),
        url = currData.attr('data-url');

    if ($(this).hasClass('icon-add')) {
      if ($('..my-group .group-list-item').length >= 9) {
        $('.little-info-tips>span').html('当前添加已达到添加上限，请先移除后再添加');
        $('.little-info-tips').show();
        pageClick = false;
        setTimeout(function () {
          $('.little-info-tips').hide();
          pageClick = true;
        }, 2000);
        return;
      }

      $(this).removeClass('icon-add').addClass('icon-minus');
      $('.hot-group .group-list-item').each(function () {
        if ($(this).find('em').html() == name) {
          $(this).find('.icon-img>i').removeClass('icon-add').addClass('icon-minus');
        }
      });
      sHtml += '<div class="group-list-item able" data-name="' + name + '" data-isCacheFlag="' + isCacheFlag + '" data-url="' + url + '" data-jumpUrl="' + jumpUrl + '" data-lookLogin="' + lookLogin + '" data-version="' + version + '" data-sort="' + sort + '">\n' + '       <i class="icon-img">' + '           <img src="' + url + '" alt="">' + '           <i class="icon-minus"></i>\n' + '       </i>\n' + '       <em>' + name + '</em>\n' + '   </div>';
      $('.my-group .application-group-list').append(sHtml);
      nineBoxEvent();
    } else {
      $(this).removeClass('icon-minus').addClass('icon-add');
      $('.hot-group .group-list-item').each(function () {
        if ($(this).find('em').html() == name) {
          $(this).find('.icon-img>i').removeClass('icon-minus').addClass('icon-add');
        }
      });
      $('.able').each(function () {
        if ($(this).attr('data-name') == name) {
          $(this).remove();
        }
      });
    }
  });
  $('.all-application-group .group-list-item').off().on('click', function () {
    var currData = $(this);
    var data_html = '';
    var names = $(this).parent().attr('data-name');
    console.log('$(this)', names);
    var name = currData.attr('data-name'),
        isCacheFlag = currData.attr('data-isCacheFlag'),
        jumpUrl = currData.attr('data-jumpUrl'),
        lookLogin = currData.attr('data-lookLogin'),
        version = currData.attr('data-version'),
        sort = currData.attr('data-sort'),
        url = currData.attr('data-url');

    if (names == '1415949793141833729') {
      data_html = '特色';
    } else if (names == '595036516841947136') {
      data_html = '交易';
    } else if (names == '595036537012355072') {
      data_html = '数据';
    } else if (names == '596194085807587328') {
      data_html = '行情';
    } else if (names == '596194157811204096') {
      data_html = '资讯';
    } else if (names == '596194178480734208') {
      data_html = '理财';
    } else if (names == '596194380159647744') {
      data_html = '业务办理';
    }

    sa.track('icon_syclick', {
      business_module: '业务类',
      first_module: '探索',
      second_module: '首页',
      third_module: '首页',
      page_name: '全部宫格',
      column_name: data_html,
      button_name: name,
      jump_url: jumpUrl
    });
    if (oVal.htmlType == 'edit') return;

    if (lookLogin == '1' && oVal.jylogin < 2) {
      T.fn.action10090({
        logintype: 1
      });
    } else {
      if (currData.find('em').text().indexOf('多元金融') >= 0) {
        T.readLocalMesg(['softversion'], function (oData) {
          if (versionfunegt(oData.SOFTVERSION, '3.1.3')) {
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
          jumpUrl = jumpUrl.replace('&wtType=1', ''); //dataUrl=encodeURIComponent(dataUrl);

          if (!!oVal.MOBILECODE && oVal.jylogin >= 1) {
            //第三种 已注册已登录
            wtJump(jumpUrl);
          } else {
            T.fn.action10090({
              jsfuncname: "wtJump('" + jumpUrl + "')"
            });
          }
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
      }
    }
  });
}
/**
 * 处理数据
 * */


function handleData() {
  // console.log("我的应用可显示数据:",oVal.nineBoxData);
  // console.log("热门可显示数据:",oVal.hotBoxData);
  // console.log("更多可显示数据:",oVal.moreBoxData);
  // console.log(oVal.nineBoxDataCache)

  /*过滤冗余数据*/
  oVal.moreBoxData = oVal.moreBoxData.filter(function (item) {
    return item.columnData.length > 0;
  }); //比对数据，确认缓存数据的可用性

  if (oVal.nineBoxDataCache) {
    //有缓存数据
    // var usableData = [];
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
          // oVal.nineBoxDataCache[j].operationstatus = oVal.nineBoxData[i].operationstatus;
          // oVal.nineBoxDataCache[j].operationstatusnew = oVal.nineBoxData[i].operationstatus;
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
            // oVal.nineBoxDataCache[k].operationstatusnew = columnData[j].operationstatus;
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
    T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {}); //oVal.nineBoxDataCache.sort(commonFunction.compare('sort'));
  } // console.log(oVal.nineBoxDataCache)


  handleNineBox();
  handleHotBox();
  handleMoreBox();
}
/**
 * 页面事件
 * */


function pageEvent() {
  $('.nav-back').off().on('click', function () {
    if ($('.nav-right').text() == '保存') {

      $('.nav-group').hide();
      popupConfirm({
        title: '温馨提示',
        cueYes: '继续编辑',
        cueNo: '直接离开',
        hasCloseBtn: 'false',
        //是否显示关闭按钮
        message: '您的编辑内容还未保存，确定要现在离开吗？',
        yesBtn: function yesBtn() {
          $('.nav-group').show();
        },
        noBtn: function noBtn() {
          T.fn.action10002();
        }
      });
    } else {
      T.fn.action10002();
    } // T.fn.action10002();

  });
  $('.application-edit').off().on('click', function () {
    if (!pageClick) return;

    if ($(this).text() == '编辑') {
     
    
     
      sa.track('sy_qbgg_dhl_bj_click', {
        business_module: '业务类',
        first_module: '探索',
        second_module: '首页',
        third_module: '首页',
        page_name: '全部宫格'
      });
      oVal.htmlType = 'edit';
      $('.application-group-title-list').hide();
      handleData(); // handleNineBox();
      // handleHotBox();
      // handleMoreBox();

      $('*').css('user-select', 'auto');
      $('img').css('pointer-events', 'auto');
      $('.my-group').removeClass("wdyy")
      $(this).text('保存');
    } else {
    
      $('.my-group').addClass("wdyy")
   

      if ($('.my-group .group-list-item').length < 9) {
        $('.little-info-tips>span').html('最少要定制9个功能');
        $('.little-info-tips').show();
        pageClick = false;
        setTimeout(function () {
          $('.little-info-tips').hide();
          pageClick = true;
        }, 2000);
        return;
      }

      $('.application-group-title-list').show();
      var currData = [];
      $('.my-group .group-list-item').each(function () {
        var obj = {
          name: $(this).attr('data-name'),
          url: $(this).attr('data-url'),
          jumpUrl: $(this).attr('data-jumpUrl'),
          lookLogin: $(this).attr('data-lookLogin'),
          sort: $(this).index(),
          isCacheFlag: $(this).attr('data-isCacheFlag'),
          version: $(this).attr('data-version'),
          operationstatus: $(this).attr('data-operationstatus')
        };
        currData.push(obj);
      });
      oVal.htmlType = 'complete';
      oVal.nineBoxDataCache = currData; //需要更新缓存

      T.saveFileMesg(JSON.stringify(oVal.nineBoxDataCache), oVal.nineBoxFile, function () {});
      handleData();
      $(this).text('编辑');
    }
  });
}
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
          },
          oConfig: function oConfig() {}
        });
      }
    },
    oConfig: function oConfig() {}
  });
} //页面返回触发


window.GoBackOnLoad = function () {//
}; //右上角点击触发


window.tztPageSecodeFun = function () {//
};

function encryptRsa2(publickkey, md5key, str) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(publickkey);
  var encrypted = encrypt.encrypt(str); //rsa加密

  var odata = encrypt.debase64(encrypted); //把base64转成16进制

  return {
    data: encrypted
  };
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
}

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