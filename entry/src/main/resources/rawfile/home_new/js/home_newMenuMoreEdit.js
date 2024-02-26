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
    timer = null,
    // 定时器
oVal = {}; //全局变量存储

oVal.nineBoxFile = 'appNineBoxFile.txt'; //首页九宫格缓存名称

oVal.nineBoxDataCache = ""; //首页九宫格缓存文件

$(function () {
  init();
});

function init() {
  pageEvent();
  getNineBox();
  getHotBox();
  getMoreBox();
}
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
    onAdd: function onAdd(evt) {
      console.log('onAdd.bar:', evt.item);
    },
    onUpdate: function onUpdate(evt) {
      console.log('onUpdate.bar:', evt.item);
    },
    onRemove: function onRemove(evt) {
      console.log('onRemove.bar:', evt.item);
    },
    onStart: function onStart(evt) {
      console.log('onStart.foo:', evt.item);
    },
    onEnd: function onEnd(evt) {
      console.log('onEnd.foo:', evt.item);
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
 * 获取九宫格数据
 * */


function getNineBox() {
  T.readLocalMesg(["softversion", 'jyloginflag'], function (oLocal) {
    // 限制3.2.1及以后版本出现指纹/面容登录入口
    oVal.currVersion = oLocal.SOFTVERSION;
    oVal.jylogin = oLocal.JYLOGINFLAG; //清下缓存
    //T.saveFileMesg("", oVal.nineBoxFile, function () {});
    //return;

    T.readFileMesg(oVal.nineBoxFile, function (oDataNine) {
      if (oDataNine) {
        //有缓存
        oVal.nineBoxDataCache = JSON.parse(decodeURIComponent(oDataNine));
      }

      $.getData({
        oSendData: {
          action: "49895",
          position: "SY",
          ReqlinkType: 2
        },
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          console.log("新版首页快捷菜单", oData);
          oVal.nineBoxData = []; //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|

          if (oData && oData.GRID0 && oData.GRID0.length > 1) {
            var gData = oData.GRID0;

            for (var i = 1; i < gData.length; i++) {
              var _result = gData[i].split("|"),
                  obj = {};

              obj.name = _result[oData.ENTRYNAME_INDEX || 0]; //图片名称

              obj.url = _result[oData.ENTRYURL_INDEX || 2]; //图片地址

              obj.jumpUrl = _result[oData.LINK_INDEX || 4]; //跳转地址

              obj.lookLogin = _result[oData.LOGINSTATUS_INDEX || 5]; //登录查看

              obj.version = _result[oData.VERSION_INDEX || 6]; //版本限制

              obj.Sort = _result[oData.ENTRYSORT_INDEX || 7]; //排序

              obj.isCacheFlag = "0"; //缓存标志 0:否，1是

              if (obj.version) {
                if (commonFunction.compareVersion(oVal.currVersion, obj.version)) {
                  if (obj.lookLogin == "1") {
                    if (oVal.jylogin > 1) {
                      oVal.nineBoxData.push(obj);
                    }
                  } else {
                    oVal.nineBoxData.push(obj);
                  }
                }
              } else {
                if (obj.lookLogin == "1") {
                  if (oVal.jylogin > 1) {
                    oVal.nineBoxData.push(obj);
                  }
                } else {
                  oVal.nineBoxData.push(obj);
                }
              }
            }

            handleNineBox();
          } else {//快捷菜单无数据
          }
        },
        oConfig: function oConfig() {}
      });
    });
  });
}
/**
 * 处理九宫格数据
 * */


function handleNineBox() {
  if (oVal.nineBoxDataCache.length > 0) {
    //缓存有数据
    var cacheFlag = true,
        //有可用缓存数据标志
    cacheData = [],
        //缓存数据
    loadData = []; //移除缓存数据后的加载数据

    for (var i = 0; i < oVal.nineBoxDataCache.length; i++) {
      for (var j = 0; j < oVal.nineBoxData.length; j++) {
        if (oVal.nineBoxDataCache[i].name == oVal.nineBoxData[j].name) {
          cacheFlag = false;
          oVal.nineBoxData[j].isCacheFlag = "1";
        }
      }
    }

    if (cacheFlag) {
      //极端情况:有缓存且缓存数据与接口数据无一相同
      if (oVal.nineBoxData.length > 9) {
        //超过九个
        for (var i = 0; i < 9; i++) {
          oVal.nineBoxData[i].isCacheFlag = "1";
        }
      } else {
        for (var i = 0; i < oVal.nineBoxData.length; i++) {
          oVal.nineBoxData[i].isCacheFlag = "1";
        }
      } //数据排序处理


      sortNineBox();
      return;
    } //数据排序处理


    for (var i = 0; i < oVal.nineBoxData.length; i++) {
      if (oVal.nineBoxData[i].isCacheFlag == "1") {
        //oVal.nineBoxData[i].lastSort = Math.floor((Math.random()*10)+1);
        cacheData.push(oVal.nineBoxData[i]);
      } else {
        loadData.push(oVal.nineBoxData[i]);
      }
    }

    cacheData.sort(commonFunction.compare('sort'));
    loadData.sort(commonFunction.compare('sort'));
    oVal.nineBoxData = cacheData.concat(loadData);
    loadNineBox();
  } else {
    if (oVal.nineBoxData.length > 9) {
      //超过九个
      for (var i = 0; i < oVal.nineBoxData.length; i++) {
        if (i > 19) break;
        oVal.nineBoxData[i].isCacheFlag = "1";
      }

      T.saveFileMesg(JSON.stringify(oVal.nineBoxData.slice(0, 19)), oVal.nineBoxFile, function () {});
    } else {
      for (var i = 0; i < oVal.nineBoxData.length; i++) {
        oVal.nineBoxData[i].isCacheFlag = "1";
      }

      T.saveFileMesg(JSON.stringify(oVal.nineBoxData), oVal.nineBoxFile, function () {});
    } //数据排序处理


    sortNineBox();
  }
}
/**
 * 数据排序处理
 * */


function sortNineBox() {
  oVal.nineBoxData.sort(commonFunction.compare('sort'));
  loadNineBox();
}
/**
 * 加载九宫格数据
 * htmlType=edit(编辑)，complete(完成)
 * */


function loadNineBox(htmlType) {
  //加载数据
  console.log("九宫格数据", oVal.nineBoxData);
  var sHtml = "",
      cacheData = [];

  for (var i = 0; i < oVal.nineBoxData.length; i++) {
    if (oVal.nineBoxData[i].isCacheFlag == "1") {
      cacheData.push(oVal.nineBoxData[i]);
    }
  }

  if (htmlType == "edit") {
    sHtml += '<div class="application-group-list clear" id="bar">';
  } else {
    sHtml += '<div class="application-group-list-small application-group-list clear">';
  }

  for (var j = 0; j < cacheData.length; j++) {
    var click_url = cacheData[j].jumpUrl,
        //跳转地址
    img_url = cacheData[j].url,
        //图片地址
    img_title = cacheData[j].name; //图片名称

    if (htmlType == "edit") {
      sHtml += '<div class="group-list-item able">\n' + '       <i class="icon-img">' + '           <img src="' + img_url + '" alt="">' + '           <i class="icon-minus"></i>\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
    } else {
      sHtml += '<i class="icon-img"><img src="' + img_url + '" alt=""></i>';
    }
  }

  sHtml += '</div>';
  $('.my-group .application-group-lists').html(sHtml);

  if (htmlType == "edit") {
    sortbaleEvent();
  }
}
/**
 * 滚动事件
 * */


function scrollEvent() {
  $(".scroll-group").each(function () {
    var obj = {};
    obj.name = $(this).find(".application-group-list").attr("data-name"); //obj.value = $(this).find(".application-group-list").offset().top;

    if ($(this).index() == "0") {
      obj.value = $(this).offset().top;
    } else {
      obj.value = $(this).offset().top - 20;
    }

    scrollArr.push(obj);
    $(".slide-" + obj.name).attr("data-scrollTop", obj.value);
    $(this).attr("data-scrollTop", obj.value);
  });
  $(".nav-slide").off().on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");
    var slideScrollTop = $(this).attr("data-scrollTop");
    if (!slideScrollTop) return; //console.log(slideScrollTop , $(".head").height());

    /*$(document).animate({
        scrollTop: slideScrollTop
    }, 200);*/

    swiperClick = false;
    $(document).scrollTop(slideScrollTop - 60);
    setTimeout(function () {
      swiperClick = true;
    }, 1000);
  });
  console.log(scrollArr); // scroll监听

  $("body")[0].onscroll = function () {
    clearTimeout(timer);
    ScrollTop_start = getScrollTop();
    timer = setTimeout(isScrollEnd, 500); //console.log(getScrollTop(),$(".my-group").height(),$(".hot-group").height())
  };

  function isScrollEnd() {
    ScrollTop_end = getScrollTop();

    if (ScrollTop_end === ScrollTop_start) {
      console.log('滚动结束了');
      var topValue = scrollArr[0].name;

      for (var i = 0; i < scrollArr.length; i++) {
        if ($(document).scrollTop() > scrollArr[i].value) {
          topValue = scrollArr[i].name;
        }
      }

      if (topValue && swiperClick) {
        /*$(".nav-slide").removeClass("active");
        $('.slide-' + topValue).addClass("active");*/
        //swiperObj.slideTo($('.slide-' + topValue).index(), 300, false);
        slideLeftFn($('.slide-' + topValue).index());
      } else {
        swiperClick = true;
      }
    }
  }

  function getScrollTop() {
    return $(document).scrollTop();
  }

  function slideLeftFn(activeIndex) {
    $('.nav-slide').eq(activeIndex).addClass("active").siblings().removeClass("active");
    /*.removeAttr("class")*/

    var that = $('.nav-slide').eq(activeIndex); //当前选中元素距离屏幕左侧距离

    var aLeft = that.offset().left; //当前元素宽度 一半

    var aWidth = that.width() / 2; //屏幕宽度一半

    var widths = $(window).width() / 2; //当前滚动条滚动的距离

    var scrollL = $('.nav-group').scrollLeft(); //滚动条滚动距离

    $('.nav-group').animate({
      scrollLeft: scrollL + (aLeft - widths) + aWidth
    }, 200);
  }
}
/**
 * 获取热门数据
 * */


function getHotBox() {
  $.getData({
    oSendData: {
      action: "49897",
      position: "SY",
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      console.log("热门数据", oData);
      oVal.hotBoxData = []; //快捷入口名称|快捷入口位置|快捷入口图片链接|角标标识|跳转链接|登录查看|版本号|排序|

      if (oData && oData.GRID0 && oData.GRID0.length > 1) {
        var gData = oData.GRID0;

        for (var i = 1; i < gData.length; i++) {
          var _result = gData[i].split("|"),
              obj = {};

          obj.name = _result[oData.ENTRYNAME_INDEX || 0]; //图片名称

          obj.url = _result[oData.ENTRYURL_INDEX || 2]; //图片地址

          obj.jumpUrl = _result[oData.LINK_INDEX || 4]; //跳转地址

          obj.lookLogin = _result[oData.LOGINSTATUS_INDEX || 5]; //登录查看

          obj.version = _result[oData.VERSION_INDEX || 6]; //版本限制

          obj.Sort = _result[oData.ENTRYSORT_INDEX || 7]; //排序

          obj.isCacheFlag = "0"; //缓存标志 0:否，1是

          if (obj.version) {
            if (commonFunction.compareVersion(oVal.currVersion, obj.version)) {
              if (obj.lookLogin == "1") {
                if (oVal.jylogin > 1) {
                  oVal.hotBoxData.push(obj);
                }
              } else {
                oVal.hotBoxData.push(obj);
              }
            }
          } else {
            if (obj.lookLogin == "1") {
              if (oVal.jylogin > 1) {
                oVal.hotBoxData.push(obj);
              }
            } else {
              oVal.hotBoxData.push(obj);
            }
          }
        }

        handleHotBox();
      } else {//快捷菜单无数据
      }
    },
    oConfig: function oConfig() {}
  });
}
/**
 * 处理热门数据
 * */


function handleHotBox() {
  if (oVal.nineBoxDataCache.length > 0) {
    //缓存有数据
    var cacheFlag = true; //有可用缓存数据标志

    for (var i = 0; i < oVal.nineBoxDataCache.length; i++) {
      for (var j = 0; j < oVal.hotBoxData.length; j++) {
        if (oVal.nineBoxDataCache[i].name == oVal.hotBoxData[j].name) {
          cacheFlag = false;
          oVal.hotBoxData[j].isCacheFlag = "1";
        }
      }
    }
  } //数据排序处理


  sortHotBox();
}
/**
 * 数据排序处理
 * */


function sortHotBox() {
  oVal.hotBoxData.sort(commonFunction.compare('Sort'));
  loadHotBox();
}
/**
 * 加载热门数据
 * htmlType=edit(编辑)，complete(完成)
 * */


function loadHotBox(htmlType) {
  //加载数据
  console.log("热门数据", oVal.hotBoxData);
  var sHtml = "",
      cacheData = oVal.hotBoxData;
  sHtml += '<div class="application-group-title">热门</div>';
  sHtml += '<div class="application-group-list clear">';

  for (var j = 0; j < cacheData.length; j++) {
    var img_url = cacheData[j].url,
        //图片地址
    img_title = cacheData[j].name; //图片名称

    if (htmlType == "edit") {
      if (cacheData[j].isCacheFlag == "1") {
        sHtml += '<div class="group-list-item">\n' + '       <i class="icon-img">\n' + '           <img src="' + img_url + '" alt="">\n' + '           <i class="icon-minus"></i>\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
      } else {
        sHtml += '<div class="group-list-item">\n' + '       <i class="icon-img">\n' + '           <img src="' + img_url + '" alt="">\n' + '           <i class="icon-add"></i>\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
      }
    } else {
      sHtml += '<div class="group-list-item">\n' + '       <i class="icon-img">\n' + '           <img src="' + img_url + '" alt="">\n' + '       </i>\n' + '       <em>' + img_title + '</em>\n' + '   </div>';
    }
  }

  sHtml += '</div>';
  $('.hot-group').html(sHtml);
}
/**
 * 获取更多数据
 * */


function getMoreBox() {
  $.getData({
    oSendData: {
      action: "49896",
      position: "SY",
      ReqlinkType: 2
    },
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      if (oData.DATA) {
        console.log("更多数据", JSON.parse(oData.DATA));

        var _result = JSON.parse(oData.DATA),
            sHtml = "",
            nHtml = "";

        if (_result.length > 0) {
          for (var i = 0; i < _result.length; i++) {
            var columnEntryName = _result[i].columnEntry.columnEntryName,
                //栏目名称
            columnId = _result[i].columnEntry.columnId,
                //栏目id
            columnSort = _result[i].columnEntry.columnSort; //栏目排序？

            var firstFlag = true;

            if (i == 0) {
              firstFlag = false;
              nHtml += '<div class="nav-slide slide-' + columnId + ' active" data-name="' + columnId + '">' + columnEntryName + '</div>';
            } else {
              nHtml += '<div class="nav-slide slide-' + columnId + ' data-name="' + columnId + '">' + columnEntryName + '</div>';
            }

            if (_result[i].entryList.length > 0) {
              if (firstFlag) {
                sHtml += '<div class="application-group scroll-group">' + '<div class="application-group-title">' + columnEntryName + '</div>' + '<div data-name="' + columnId + '" class="application-group-list clear">';
              } else {
                sHtml += '<div class="application-group scroll-group">' + '<div data-name="' + columnId + '" class="application-group-list clear">';
              }

              for (var j = 0; j < _result[i].entryList.length; j++) {
                var entryName = _result[i].entryList[j].entryName,
                    link = _result[i].entryList[j].link,
                    version = _result[i].entryList[j].version,
                    loginStatus = _result[i].entryList[j].loginStatus,
                    entryUrl = _result[i].entryList[j].entryUrl;
                var htmlShowFlag = true;

                if (version) {
                  if (commonFunction.compareVersion(oVal.currVersion, version)) {
                    if (loginStatus == "1") {
                      if (oVal.jylogin > 1) {
                        htmlShowFlag = true;
                      } else {
                        htmlShowFlag = false;
                      }
                    } else {
                      htmlShowFlag = true;
                    }
                  }
                } else {
                  if (loginStatus == "1") {
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
                  sHtml += '<div class="group-list-item">\n' + '        <i class="icon-img"><img src="' + entryUrl + '" alt=""></i>\n' + '        <em>' + entryName + '</em>\n' + '    </div>';
                }
              }

              sHtml += '</div></div>';
            }
          }

          $(".nav-group").html(nHtml);
          $(".all-application-group").html(sHtml);
          scrollEvent();
          stickyEvent();
        }
      }
    },
    oConfig: function oConfig() {}
  });
}
/**
 * 页面事件
 * */


function pageEvent() {
  $(".nav-back").off().on("click", function () {
    T.fn.action10002();
  });
  $(".nav-right").off().on("click", function () {
    if ($(this).text() == "编辑") {
      loadNineBox("edit");
      $(this).text("完成");
    } else {
      loadNineBox("complete");
      $(this).text("编辑");
    }
  });
} //页面返回触发


window.GoBackOnLoad = function () {//
}; //右上角点击触发


window.tztPageSecodeFun = function () {//
};