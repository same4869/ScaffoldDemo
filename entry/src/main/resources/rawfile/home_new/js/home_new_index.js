"use strict";

var zxStockCodes = [],
    stype = '',
    zxLength = '';
$(function () {
  T.attrUrl($('.more')); //T.attrUrl($('.tiaozhuan'));

  setStyle(); //getTuijian();
  //getSsgd();
});

function getZxStockCodes() {
  $('.zx_qb li.zx-list').remove();
  $('.zixuan .noZX').remove();
  var oVal = {};
  var oSendData = ['selfstocklist'];
  T.readLocalMesg(oSendData, function (data) {
    var str = [];

    if (!data.SELFSTOCKLIST) {} else {
      var aGrid = data.SELFSTOCKLIST.split(','),
          ln = aGrid.length;

      if (T.appversion.andriod()) {
        ln = ln - 1;
      }

      zxLength = ln;
      var stockcodes = [];

      for (var i = 0; i < ln; i++) {
        var aData = aGrid[i].split('|');
        var market = aData[1];

        if (!MakeIndexMarketHQ(market) && !MakeHKZhiShuMarketStock(market)) {
          str.push(aData[0].split('.')[0]);
        }
      }
    }

    zxStockCodes = str; //获取自选股

    $('.zixuan ul li').remove();
    $('.zixuan ul div').remove();

    if (zxLength) {
      getZiXuan();
    } else {
      $('<div class="noZX" style="display: block;"><span class="nodata"></span><p>暂无自选</p></div>').insertBefore('.zixuan .more');
    }
  });
}

function MakeIndexMarketHQ(x) {
  var HQ_STOCK_MARKET = 0x1000;
  var HQ_KIND_INDEX = 0x0000; // 指数

  var HQ_KIND_OtherIndex = 0x000e; // 第三方行情分类，如:中信指数

  return MakeMarket(x) == HQ_STOCK_MARKET && MakeMidMarket(x) != 0 && (MakeSubMarket(x) == HQ_KIND_INDEX || MakeSubMarket(x) == HQ_KIND_OtherIndex);
}

function MakeHKZhiShuMarketStock(x) {
  var HQ_INDEX_BOURSE = 0x0300;
  return MakeHKMarket(x) && MakeMidMarket(x) == HQ_INDEX_BOURSE;
}

function MakeHKMarket(x) {
  var HQ_HK_MARKET = 0x2000;
  return MakeMarket(x) == HQ_HK_MARKET;
}

function MakeMarket(x) {
  return x & 0xf000;
}

function MakeMidMarket(x) {
  return x & 0x0f00; // ∑÷¿‡µ⁄∂˛Œª
}

function MakeSubMarket(x) {
  return x & 0x000f;
}

function getTuijian() {
  //TODO:功能号和menuid不确定
  var oSendData = {
    action: '56118',
    nPage: 1,
    maxcount: 4,
    menu_id: 20001,
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
        aGrid = aGrid.slice(0, 4);
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
      } else {
        sHtml = '<div class="noZX" style="display: block;"><span class="nodata"></span><p>暂无数据</p></div>';
      }

      $('.tuijian .list-container ul').html(sHtml);
      tjpageUrl();
    }
  });
}

function loadDOM_Tuijian(data, index) {
  var readClass = '';
  var newDate = dateStr(data[index['日期']]);
  var sHtml = '<li class="zx-list" data-id="' + data[index['ID']] + '">' + '<img  src="' + data[index['图片']] + '"onload=this.nextSibling.style.display="none"; class="img">' + '<img  src="./images/moren.png" class="none">' + '<p class="zx-name ' + readClass + '">' + data[index['标题']] + '</p>' +
  /*'<p class="zx-date"><span>' + data[index['媒体']] + '</span><em>' + newDate + '</em></p>' +*/
  '<p class="zx-date"><em>' + newDate + '</em></p>' + '</li>';
  return sHtml;
}

function tjpageUrl() {
  var action = 'read.txt';
  $('.tuijian .zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        flags = $(this).attr('data-flag'),
        obj = {
      url: '/zx2/zx_zxxq.html?id=' + sId + '&type=tuijian&flags=' + flags
    };
    var oSend = {
      url: obj.url
    };
    oSend.secondtype = '98';
    oSend.secondtext = 'tzt_zx.png';
    oSend.secondjsfuncname = 'tztPageSecodeFun()';
    oSend.TitleSkinType = 1;
    TZT.fn.action10061(oSend);
  });
}

function getHuafu() {
  //TODO:功能号和menuid不确定
  var oSendData = {
    action: 47100,
    ReqlinkType: 2,
    Type: 1,
    bigType: 'ZX'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];
      var ln = aGrid.length;

      if (ln > 1) {
        aGrid = aGrid.slice(0, 5);
        var oIndex = {};
        var titleDate = '';
        oIndex['ID'] = data['ID_INDEX'];
        oIndex['日期'] = data['PUBLISHDATE_INDEX'];
        oIndex['标题'] = data['TITLE_INDEX'];
        oIndex['图片'] = data['PICURL_INDEX'];
        oIndex['媒体'] = data['AUTHOR_INDEX'];
        oIndex['ISJUMP'] = data['ISJUMP_INDEX'];
        oIndex['JUMPLINK'] = data['JUMPLINK_INDEX'];

        for (var i = 1; i < aGrid.length; i++) {
          var aData = aGrid[i].split('|');

          if (aData[oIndex['日期']].substr(0, 10) != titleDate) {
            titleDate = aData[oIndex['日期']].substr(0, 10);
            sHtml += loadDOM_DATE(titleDate);
          } //if($.inArray(aData[data['IDINDEX']], aTemp) == -1) aTemp.push(aData[data['IDINDEX']]); //存储id值


          sHtml += loadDOM_Huafu(aData, oIndex);
        }
      } else {
        sHtml = '<div class="noZX" style="display: block;"><span class="nodata"></span><p>暂无数据</p></div>';
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
  var newDate = data[index['日期']].split(' ')[1].substr(0, 5);
  var sHtml = '<li class="zx-list" data-id="' + data[index['ID']] + '" data-flag="' + data[index['ISJUMP']] + '" data-link="' + data[index['JUMPLINK']] + '">' + '<div class="img" style="background: url(' + data[index['图片']] + ') no-repeat center / 0.5rem 0.5rem;"></div>' + '<p class="zx-name ' + readClass + '">' + data[index['标题']] + '</p>' + // + '<span class="zx-media">' + data[index['媒体']] + '</span>'
  // + '<span class="zx-date">' + newDate + '</span>'
  '<p class="zx-date" style="padding-right:0;"><span>' + data[index['媒体']] + '</span><em>' + newDate + '</em></p>' + '</li>';
  return sHtml;
}

function hfpageUrl() {
  var action = 'read.txt';
  $('.huafu .zx-list').off().on('click', function () {
    var sFlag = $(this).attr('data-flag');

    if (sFlag == 1) {
      // TZT.fn.action10061({url:'/home_new/szxt_zxxq.html?link='+encodeURIComponent($(this).attr('data-link'))});
      TZT.fn.action10061({
        url: $(this).attr('data-link')
      });
    } else {
      var sId = $(this).attr('data-id'),
          obj = {
        url: '/zx2/zx_zxxq.html?id=' + sId + '&type=huafu'
      };
      var oSend = {
        url: obj.url
      };
      oSend.secondtype = '98';
      oSend.secondtext = 'tzt_zx.png';
      oSend.secondjsfuncname = 'tztPageSecodeFun()';
      TZT.fn.action10061(oSend);
    }
  });
}

function getSsgd() {
  var oSendData = {
    action: '56127',
    nPage: 1,
    maxcount: 4,
    ReqLinkType: '2'
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      console.log('快讯：', data);
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];
      /*if (aGrid) {
              var ln = aGrid.length;
              var oIndex = {},titleDate = "";
              // oIndex['ID'] = data['IDINDEX'];
              oIndex['ID'] = data['IDINDEX'];
              oIndex['日期'] = data['DATESINDEX'];
              oIndex['标题'] = data['CONTENTINDEX'];
              oIndex['MEDIA'] = data['MEDIAINDEX'];
              for (var i = 0; i < ln; i++) {
                  var aData = aGrid[i].split('|');
                  sHtml += loadDOM_SSGD(aData, oIndex);
              }
              
      }else{
      sHtml = '<div class="noZX" style="display: block;"><span class="nodata"></span><p>暂无数据</p></div>';
      }
      $('.ssgd .list-container ul').html(sHtml);
      $('.mescroll ul a').attr("href","Javascript:void(0);").css('text-decoration','none').css('color','#3C3759');
      $('#mescroll ul a').removeAttr('href').css({'color':'#3C3759'});
      xpageUrl();*/
    }
  });
}

function loadDOM_SSGDDATE(date) {
  var dates = [];
  $('.list_item_text').each(function () {
    dates.push($(this).text());
  });

  if (dates.indexOf(date) < 0) {
    var sHtml = '<li class="list_item_text">' + date + '</li>';
  } else {
    var sHtml = '';
  }

  return sHtml;
}

function loadDOM_SSGD(data, index) {
  var readClass = '';
  var dede = data[index['日期']].replace(/\s+/, '&').split('&'); //日期

  var dedeDate = dede[0].replace(/-/, '&').split('&')[1]; //日期

  var dedeTime = dede[1].substr(0, 5); //时间

  var dTitle = data[index['标题']]; //标题

  var dTime = dedeTime; //时间

  var sHtml = '<li class="list_item" data-id="' + data[index['ID']] + '">' + '<div class="list_item_hd">' + '<div class="hd_date">' + '<p class="date">' + dedeTime + '</p>' + '</div><div class="hd_line_cn"><em class="red_yd"></em></div>' + '</div>' + '<div class="list_item_bd">' + '<p class="one-line newstitle close">' + dTitle + '</p>' + '</div>' + '</li>';
  return sHtml;
}

function formatDate(date) {
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

function xpageUrl() {
  $('.list_item').delegate('.newstitle', 'click', function () {
    $(this).toggleClass('close');
  });
}

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

function setStyle() {
  $('.zx_title').delegate('li', 'click', function () {
    var jThis = $(this);
    var sClass = jThis.attr('data-type');
    jThis.addClass('active');
    jThis.children('span').addClass('tp_line');
    jThis.siblings().removeClass('active');
    jThis.siblings().children('span').removeClass('tp_line');
    $('.' + sClass).removeClass('none').siblings().addClass('none');

    if (sClass == 'tuijian') {
      getTuijian();
    } else if (sClass == 'huafu') {
      getHuafu();
    } else if (sClass == 'ssgd') {
      getSsgd();
    } else {
      getZxStockCodes();
    }
  });
}

function zxpageUrl(stype) {
  var action = 'read.txt';
  $('.zixuan .zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        menuid = $(this).data('menuid'),
        obj = {
      url: '/zx2/zx_zxxq.html?type=zxg&id=' + sId + '&menu_id=' + menuid,
      secondtype: '1'
    };
    var oSend = {
      url: obj.url
    };
    oSend.secondtype = '98';
    oSend.secondtext = 'tzt_zx.png';
    oSend.secondjsfuncname = 'tztPageSecodeFun()';
    TZT.fn.action10061(oSend);
  });
}

function zxloadDom_item(data, oIndex, flag) {
  var readClass = '',
      sHtml;
  sHtml = '<li class="zx-list" data-id="' + data[oIndex['IDINDEX']] + '" data-flag="' + data[oIndex['FLAGINDEX']] + '" data-menuid="' + data[oIndex['MENUIDINDEX']] + '">' + '<p class="zx-name ' + readClass + '">' + data[oIndex['INFOTITLEINDEX']] + '</p>' + '<p class="zx-date"><span class="xggp">' + data[oIndex['SECURITYNAME']] + '</span><em>' + dateStr(data[oIndex['DATESINDEX']]) + '</em></p>' + '</li>';
  return sHtml;
}

function getSratcolor(sratingcode) {
  if (sratingcode == '买入') {
    return 'color1';
  } else if (sratingcode == '增持') {
    return 'color2';
  } else if (sratingcode == '中性') {
    return 'color3';
  } else if (sratingcode == '减持') {
    return 'color4';
  } else if (sratingcode == '卖出') {
    return 'color5';
  }
}

function getZiXuan() {
  $('.zixuan ul li').remove();
  $('.zixuan ul div').remove();
  var oSendData = {
    action: '56116',
    menu_id: '',
    stockcode: zxStockCodes,
    nPage: 1,
    MaxCount: 4,
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
        aGrid = aGrid.slice(0, 4);
        var ln = aGrid.length;
        var oIndex = {};
        oIndex['IDINDEX'] = data['IDINDEX']; //资讯ID

        oIndex['DATESINDEX'] = dateStr(data['DATESINDEX']); //日期

        oIndex['INFOTITLEINDEX'] = data['INFOTITLEINDEX']; //标题

        oIndex['FLAGINDEX'] = data['FLAGINDEX'];
        oIndex['MENUIDINDEX'] = data['MENUIDINDEX'];
        oIndex['MEDIAINDEX'] = data['MEDIAINDEX'];
        oIndex['EMRATINGNAME'] = data['EMRATINGNAME'];
        oIndex['SECURITYNAME'] = data['SECURITYNAME'];

        for (var i = 0; i < ln; i++) {
          var aData = aGrid[i].split('|');
          sHtml += zxloadDom_item(aData, oIndex);
        }
      } else {
        sHtml = '<div class="noZX" style="display: block;"><span class="nodata"></span><p>暂无数据</p></div>';
      }

      $('.zixuan ul').html(sHtml);
      zxpageUrl(stype);
    }
  });
}

window.GoBackOnLoad = function () {
  /*getZxStockCodes();*/

  /*var isOn=$('.banner .swiper-wrapper').attr('data-on')||'';
  if(isO==''||isOn!=1){
  	window.location.href();
  }else{
  reqrolloffset();
  }*/

  /*if(isO==1||isOn=='1'){
  	reqrolloffset();
  }else{
  window.location.href();
  }*/
  console.log('index-页面返回加载？？？');
  setMsgSubscribe();
  getGDXX();

  if ($('.mychoose').hasClass('active')) {
    getZxStockCodes();
  } //todo:新增小白乐园判断，快捷菜单、banner图刷新判断，禅道版本408


  T.readLocalMesg(['mobilecode'], function (oData) {
    var MOBILECODE = oData.MOBILECODE;

    if (MOBILECODE == '' || !MOBILECODE || MOBILECODE == 'null') {
      $('.xbly').show();
      getXBLY();
    } else {
      $('.xbly').hide();
    }
  });
  getBanner(); //banner图

  getKJCD(); //快捷菜单
  //   	var action = "tzthome_newfirstflag.txt";
  // T.readFileMesg(action,function(oData){
  //        if(!oData){
  //        }else{
  //        }
  //    });
};

function reqrolloffset() {
  var obj = {};
  obj.offset = -$('#wapperTop').offset().top;
  var jsonobj = JSON.stringify(obj);
  T.readLocalMesg(['tztwkwebview'], function (data) {
    if (data.TZTWKWEBVIEW == 1) {
      window.webkit.messageHandlers.setContentParams.postMessage({
        func: 'reqrolloffset',
        //回调函数名
        data: jsonobj //数据

      });
    } else {
      window.MyWebView.setContentParams('reqrolloffset', jsonobj);
    }
  });
}