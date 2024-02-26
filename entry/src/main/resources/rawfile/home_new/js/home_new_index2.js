"use strict";

var tjreadId = [],
    hfreadId = [],
    xreadId = [],
    zxreadId = [];
$(function () {
  T.attrUrl($('.more,.tztui-grid'));
  setNewsList();
  setStyle();
  var stype = $('.avbar__item_on').data("type");
  getZiXuan(stype);
});

function getTuijian() {
  //TODO:功能号和menuid不确定
  var oSendData = {
    'action': '46118',
    'nPage': 1,
    'maxcount': 3,
    'menu_id': 20020,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];

      if (aGrid) {
        var ln = aGrid.length;
        var oIndex = {};
        oIndex['ID'] = data['IDINDEX'];
        oIndex['日期'] = data['DATESINDEX'];
        oIndex['标题'] = data['INFOTITLEINDEX'];
        oIndex['图片'] = data['PICURLINDEX'];
        oIndex['媒体'] = data['MEDIAINDEX'];

        for (var i = 0; i < ln; i++) {
          var aData = aGrid[i].split('|');
          if ($.inArray(aData[data['IDINDEX']], aTemp) == -1) aTemp.push(aData[data['IDINDEX']]);
          sHtml += loadDOM_Tuijian(aData, oIndex);
        }
      }

      $('.tuijian .list-container ul').html(sHtml);
      tjpageUrl();
    }
  });
}

function loadDOM_Tuijian(data, index) {
  var readClass = '';

  if (tjreadId.toString().indexOf(data[index['ID']]) > -1) {
    readClass = 'zx-read-name';
  }

  var newDate = dateStr(data[index['日期']]);
  var sHtml = '<li class="zx-list" style="padding-left: 1rem;" data-id="' + data[index['ID']] + '">' + '<img  src="' + data[index['图片']] + '"onload=this.nextSibling.style.display="none"; class="img">' + '<img  src="./images/moren.png" class="none">' + '<p class="zx-name ' + readClass + '">' + data[index['标题']] + '</p>' + '<p class="zx-date">' + data[index['媒体']] + '<span>' + newDate + '</span></p>' + '</li>';
  return sHtml;
}

function tjpageUrl() {
  var action = 'read.txt';
  $('.tuijian .zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        flags = $(this).attr('data-flag'),
        obj = {
      'url': '/zx/a_zx_zxxq.html?id=' + sId + '&type=tuijian&flags=' + flags,
      'secondtype': '1'
    };
    $(this).find(".zx-name").addClass('zx-read-name');

    if (tjreadId.toString().indexOf(sId) == -1) {
      tjreadId.push(sId);
    }

    T.saveFileMesg(tjreadId, action, function (oData) {
      T.readFileMesg(action, function (oData) {
        TZT.fn.action10061(obj);
      });
    });
  });
}

;

function getHuafu() {
  //TODO:功能号和menuid不确定
  var oSendData = {
    'action': '46118',
    'nPage': 1,
    'maxcount': 3,
    'menu_id': 20020,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];

      if (aGrid) {
        aGrid = data.GRID0.slice(0, 3);
        var ln = aGrid.length;
        var oIndex = {};
        var titleDate = "";
        oIndex['ID'] = data['IDINDEX'];
        oIndex['日期'] = data['DATESINDEX'];
        oIndex['标题'] = data['INFOTITLEINDEX'];
        oIndex['图片'] = data['PICURLINDEX'];
        oIndex['媒体'] = data['MEDIAINDEX'];

        for (var i = 0; i < ln; i++) {
          var aData = aGrid[i].split('|');

          if (aData[data['DATESINDEX']].substr(0, 10) != titleDate) {
            titleDate = aData[data['DATESINDEX']].substr(0, 10);
            sHtml += loadDOM_DATE(titleDate);
          }

          if ($.inArray(aData[data['IDINDEX']], aTemp) == -1) aTemp.push(aData[data['IDINDEX']]); //存储id值

          sHtml += loadDOM_Huafu(aData, oIndex);
        }
      }

      $('.huafu .list-container ul').html(sHtml);
      hfpageUrl();
    }
  });
}

function loadDOM_DATE(date) {
  var sHtml = '<div class="zx-list-date">' + date + '</div>';
  return sHtml;
}

function loadDOM_Huafu(data, index) {
  var readClass = '';

  if (hfreadId.toString().indexOf(data[index['ID']]) > -1) {
    readClass = 'zx-read-name';
  }

  var imgsrc = getImgSrc(data[index['日期']]);
  var newDate = dateStr(data[index['日期']]);
  var sHtml = '<li class="zx-list" style="padding-left: 0.8rem;" data-id="' + data[index['ID']] + '">' + '<div class="img ' + imgsrc + '"></div>' + '<p class="zx-name ' + readClass + '">' + data[index['标题']] + '</p>' + '<p class="zx-date">' + data[index['媒体']] + '<span>' + newDate + '</span></p>' + '</li>';
  return sHtml;
}

function hfpageUrl() {
  var action = 'read.txt';
  $('.huafu .zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        flags = $(this).attr('data-flag'),
        obj = {
      'url': '/zx/a_zx_zxxq.html?id=' + sId + '&type=huafu&flags=' + flags,
      'secondtype': '1'
    };
    $(this).find(".zx-name").addClass('zx-read-name');

    if (hfreadId.toString().indexOf(sId) == -1) {
      hfreadId.push(sId);
    }

    oVal.Reflash = false;
    T.saveFileMesg(hfreadId, action, function (oData) {
      T.readFileMesg(action, function (oData) {
        TZT.fn.action10061(obj);
      });
    });
  });
}

;

function getSsgd() {
  var oSendData = {
    'action': '46118',
    'nPage': 1,
    'maxcount': 3,
    'menu_id': 20034,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];

      if (aGrid) {
        var ln = aGrid.length;
        var oIndex = {};
        var titleDate = "";
        oIndex['ID'] = data['IDINDEX'];
        oIndex['日期'] = dateStr(data['DATESINDEX']);
        oIndex['标题'] = data['INFOTITLEINDEX'];
        oIndex['MEDIA'] = data['MEDIAINDEX'];

        for (var i = 0; i < ln; i++) {
          var aData = aGrid[i].split('|');
          if ($.inArray(aData[data['IDINDEX']], aTemp) == -1) aTemp.push(aData[data['IDINDEX']]); //存储id值

          sHtml += loadDOM_ssgd(aData, oIndex);
        }

        ;
      }

      ;
      $('.ssgd .list-container ul').html(sHtml);
      xpageUrl();
    }
  });
}

;

function loadDOM_ssgd(data, index) {
  var readClass = '';

  if (xreadId.toString().indexOf(data[index['ID']]) > -1) {
    readClass = 'zx-read-name';
  }

  var dede = data[index['日期']].replace(/\s+/, "&").split("&"); //日期

  var dedeDate = dede[0].replace(/-/, "&").split("&")[1]; //日期

  var dedeTime = dede[1].substring(0, dede[1].lastIndexOf(':')); //时间

  var dTitle = data[index['标题']]; //标题

  var dTime = dedeTime; //时间

  var sHtml = '<li class="list_item">' + '<div class="list_item_hd">' + '<div class="hd_date">' + '<p class="date">' + dedeTime + '</p>' + '</div><div class="hd_line_cn"><em class="red_yd"></em></div>' + '</div>' + '<div class="list_item_bd">' + '<p class="one-line newstitle">' + dTitle + '</p>' + '<p class="one-line">' + dTitle + '</p>' + '</div>' + '</li>';
  return sHtml;
}

;

function xpageUrl() {
  var action = 'read.txt';
  $('.ssgd .zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        flags = $(this).attr('data-flag'),
        obj = {
      'url': '/zx/conts.html?id=' + sId + '&type=' + oVal.sType + '&flags=' + flags,
      'secondtype': '1'
    };
    $(this).find(".zx-name").addClass('zx-read-name');

    if (xreadId.toString().indexOf(sId) == -1) {
      xreadId.push(sId);
    }

    T.saveFileMesg(xreadId, action, function (oData) {
      T.readFileMesg(action, function (oData) {
        TZT.fn.action10061(obj);
      });
    });
  });
}

;

function getImgSrc(date) {
  var hour = Number(date.substr(11, 2));

  if (hour <= 10) {
    return 'zao';
  } else if (hour <= 14 && hour > 10) {
    return 'wu';
  } else {
    return 'wan';
  }
}

function dateStr(date) {
  var time = new Date().getTime(); // var date= '2018-03-16 10:30:50';

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
    return s + "分钟前";
  } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
    //超过1小时少于24小时
    s = Math.floor(time / 60 / 60);
    return s + "小时前";
  } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
    //超过1天少于3天内
    s = Math.floor(time / 60 / 60 / 24);
    return s + "天前";
  } else {
    //超过3天
    return date;
  }
}

function setNewsList() {
  $.fn.extend({
    Scroll: function Scroll(opt, callback) {
      if (!opt) var opt = {}; //参数初始化

      var _this = this.eq(0).find("ul:first");

      var lineH = _this.find("li:first").height(),
          //获取行高
      line = opt.line ? parseInt(opt.line, 10) : parseInt(this.height() / lineH, 10),
          //每次滚动的行数，默认为一屏，即父容器高度
      speed = opt.speed ? parseInt(opt.speed, 10) : 500,
          //卷动速度，数值越大，速度越慢（毫秒）
      timer = opt.timer ? parseInt(opt.timer, 10) : 3000; //滚动的时间间隔（毫秒）


      if (line == 0) line = 1;
      var upHeight = 0 - line * lineH; //滚动函数

      scrollUp = function scrollUp() {
        _this.animate({
          marginTop: upHeight
        }, speed, function () {
          for (i = 1; i <= line; i++) {
            _this.find("li:first").appendTo(_this);
          }

          _this.css({
            marginTop: 0
          });
        });
      }; //鼠标事件绑定


      _this.hover(function () {
        clearInterval(timerID);
      }, function () {
        timerID = setInterval("scrollUp()", timer);
      }).mouseout();
    }
  });
  $(function () {
    $('#donate_carousel').Scroll({
      line: 1,
      speed: 800,
      timer: 2000
    });
  });
}

function setStyle() {
  var itemWidth = $('.hdzq-box .box-item').width() + 1;
  var items = $('.hdzq-box .box-item').length;
  var scrollWidth = items * itemWidth + items * 12 + 5;
  $('.hdzq-box .scroll-box').css("width", scrollWidth + "px");
  var itemWidth2 = $('.nrgd-box .box-item').width() + 1;
  var items2 = $('.nrgd-box .box-item').length;
  var scrollWidth2 = items2 * itemWidth2 + items2 * 12 + 5;
  $('.nrgd-box .scroll-box').css("width", scrollWidth2 + "px");
  $('.nrgd-box .box-title .title-attent').unbind().on('click', function () {
    $(this).toggleClass("title-gz");
  });
  $('.zx_title').delegate('li', 'click', function () {
    var jThis = $(this);
    var sClass = jThis.attr('data-type');
    jThis.addClass('active');
    jThis.children('span').addClass('tp_line');
    jThis.siblings().removeClass('active');
    jThis.siblings().children('span').removeClass('tp_line');
    $('.' + sClass).removeClass('none').siblings().addClass('none');

    if (sClass == "tuijian") {
      getTuijian();
    } else if (sClass == "huafu") {
      getHuafu();
    } else if (sClass == "ssgd") {
      getSsgd();
    }
  });
  $('.zx_title').delegate('li', 'click', function () {
    var jThis = $(this);
    var sClass = jThis.attr('data-type');
    jThis.addClass('active');
    jThis.children('span').addClass('tp_line');
    jThis.siblings().removeClass('active');
    jThis.siblings().children('span').removeClass('tp_line');
    $('.' + sClass).removeClass('none').siblings().addClass('none');

    if (sClass == "tuijian") {
      getTuijian();
    } else if (sClass == "huafu") {
      getHuafu();
    } else if (sClass == "ssgd") {
      getSsgd();
    }
  });
  var newSwiper = new Swiper('.swiper-container3', {
    paginationClickable: false,
    onSlideChangeStart: function onSlideChangeStart(swiper) {
      var activeNode = $('.navbar .navbar__item')[swiper.activeIndex];
      $(activeNode).addClass('navbar__item_on');
      $(activeNode).siblings().removeClass('navbar__item_on');
    }
  });
  $('.navbar .navbar__item').unbind().on('click', function (e) {
    var _this = $(this),
        nIndex = _this.index(),
        sClass = _this.attr('data-type');

    _this.removeClass('navbar__item_on').addClass('navbar__item_on');

    _this.siblings().removeClass('navbar__item_on');

    getZiXuan(sClass);
    newSwiper && newSwiper.slideTo(nIndex);
  });
}

function zxpageUrl() {
  var action = 'read.txt';
  $('.zixuan .zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        flags = $(this).attr('data-flag'),
        menu_id = $(this).attr('data-menuid'),
        obj = {
      'url': '/zx/cont.html?id=' + sId + '&type=' + oVal.sType + '&flags=' + flags + (!!menu_id ? '&menu_id=' + menu_id : ''),
      'secondtype': '1'
    };
    $(this).find(".zx-name").addClass('zx-read-name');

    if (zxreadId.toString().indexOf(sId) == -1) {
      zxreadId.push(sId);
    }

    T.saveFileMesg(zxreadId, action, function (oData) {
      T.readFileMesg(action, function (oData) {
        TZT.fn.action10061(obj);
      });
    });
  });
}

;

function htmlAppend(stype, sHtml) {
  if (stype == 'zx_xw') {
    $('.zx_xw').html(sHtml);
  } else if (stype == 'zx_gg') {
    $('.zx_gg').html(sHtml);
  } else if (stype == 'zx_yb') {
    $('.zx_yb').html(sHtml);
  } else {
    $('.zx_qb').html(sHtml);
  }
}

function zxloadDom_item(data, oIndex, flag) {
  var readClass = '',
      sHtml;

  if (zxreadId.toString().indexOf(data[oIndex['IDINDEX']]) > -1) {
    readClass = 'zx-read-name';
  }

  if (flag == 1) {
    sHtml = '<li class="zx-list" data-id="' + data[oIndex['IDINDEX']] + '" data-flag="' + data[oIndex['FLAGINDEX']] + '" ' + (!!oIndex['MENUIDINDEX'] ? 'data-menuid="' + data[oIndex['MENUIDINDEX']] + '"' : '') + '>' + '<p class="zx-name ' + readClass + '">' + data[oIndex['INFOTITLEINDEX']] + '</p>' + '<p class="zx-date">' + data[oIndex['DATESINDEX']] + '</p>' + '</li>';
  } else {
    sHtml = '<li class="zx-list zx-list2" data-id="' + data[oIndex['IDINDEX']] + '" data-flag="' + data[oIndex['FLAGINDEX']] + '" ' + (!!oIndex['MENUIDINDEX'] ? 'data-menuid="' + data[oIndex['MENUIDINDEX']] + '"' : '') + '>' + '<p class="zx-name ' + readClass + '">' + data[oIndex['INFOTITLEINDEX']] + '</p>' + '<p class="zx-date"><span class="zx_media"><em>' + data[oIndex['SRATINGCODEINDEX']] + '</em> | <em>' + data[oIndex['MEDIAINDEX']] + '</em></span><span class="zx_time">' + data[oIndex['DATESINDEX']] + '<span></p>' + '</li>';
  }

  return sHtml;
}

function stypeToMunuid(stype) {
  if (stype == 'zx_xw') {
    return '20001';
  } else if (stype == 'zx_gg') {
    return '20002';
  } else if (stype == 'zx_yb') {
    return '20003';
  } else {
    return '20003';
  }
}

function getZiXuan(stype) {
  var oSendData = {
    'action': '46101',
    'menu_id': stypeToMunuid(stype),
    'Stockcode': 600600,
    'nPage': 1,
    // StockCodeType:4553,
    'MaxCount': 3,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];

      if (aGrid) {
        var ln = aGrid.length;
        var oIndex = {};
        oIndex['IDINDEX'] = data['IDINDEX']; //资讯ID

        oIndex['DATESINDEX'] = dateStr(data['DATESINDEX']); //日期

        oIndex['INFOTITLEINDEX'] = data['INFOTITLEINDEX']; //标题

        oIndex['FLAGINDEX'] = data['FLAGINDEX'];
        oIndex['MENUIDINDEX'] = data['MENUIDINDEX'];
        oIndex['MEDIAINDEX'] = data['MEDIAINDEX'];
        oIndex['SRATINGCODEINDEX'] = data['SRATINGCODEINDEX'];

        for (var i = 0; i < ln; i++) {
          var aData = aGrid[i].split('|');
          if ($.inArray(aData[data['IDINDEX']], aTemp) == -1) aTemp.push(aData[data['IDINDEX']]); //存储id值

          if (aData[data['SRATINGCODEINDEX']] != "") {
            sHtml += zxloadDom_item(aData, oIndex, 2);
          } else {
            sHtml += zxloadDom_item(aData, oIndex, 1);
          }
        }

        ;
      }

      htmlAppend(stype, sHtml);
      zxpageUrl();
    }
  });
}