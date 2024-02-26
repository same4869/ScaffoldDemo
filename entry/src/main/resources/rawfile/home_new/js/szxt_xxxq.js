"use strict";

window.GoBackOnLoad = function () {
  init();
};

var id = T.getUrlParameter('id');
var type = T.getUrlParameter('type'); //var title = T.getUrlParameter('title');

var itemType = ''; //下拉刷新 

var mescroll = new MeScroll("mescroll", {
  down: {
    callback: init,
    use: true,
    auto: false
  }
});
$(function () {
  init();
});

function init() {
  if (id == '2' && type == 'tjdsx') {
    //投教特色-投教大事讯
    changetitle("投教大事讯");
    itemType = '81';
    getXQ(itemType);
  } else if (id == '1' && type == 'xhs') {
    //投教特色-小红伞
    changetitle("小红伞");
    itemType = '82';
    getXQ(itemType);
  } else if (id == 1 && type == 'qyzcjd') {
    //权益-政策解读
    changetitle("政策解读");
    itemType = '85';
    getXQ(itemType);
  } else if (id == 2 && type == 'qyqtal') {
    //权益-其他案例
    changetitle("其他案例");
    itemType = '86';
    getXQ(itemType);
  } else if (id == 1 && type == 'ztdf') {
    //专题-打非
    changetitle("打非");
    itemType = '87';
    getXQ(itemType);
  } else if (id == 2 && type == 'ztsdx') {
    //专题-适当性
    changetitle("适当性");
    itemType = '88';
    getXQ(itemType);
  } else if (id == 3 && type == 'ztmgz') {
    //专题-明规则
    changetitle("明规则");
    itemType = '89';
    getXQ(itemType);
  } else if (id == 1 && type == 'jdggj') {
    //基地-国家级
    changetitle("国家级");
    itemType = '90';
    getXQ(itemType);
  } else if (id == 2 && type == 'jdsj') {
    //基地-省级
    changetitle("省级");
    itemType = '91';
    getXQ(itemType);
  } else if (id == 1 && type == 'ktjjrm') {
    //华福课堂-基础入门
    changetitle("基础入门");
    itemType = '80';
    getXQ(itemType);
  } else if (id == 2 && type == 'ktjjbb') {
    //华福课堂-进阶必备
    changetitle("进阶必备");
    itemType = '181';
    getXQ(itemType);
  } else if (id == 3 && type == 'ktgsxt') {
    //华福课堂-高手学堂
    changetitle("高手学堂");
    itemType = '83';
    getXQ(itemType);
  } else if (id == 4 && type == 'ktmyddc') {
    //华福课堂-满意度调查
    changetitle("满意度调查");
    itemType = '84';
    getXQ(itemType);
  }
} //守正学堂各栏目详情


function getXQ(itemType) {
  var oSendData = {
    'action': '47100',
    'bigType': 'SZXY',
    'Type': itemType,
    'ReqlinkType': '2',
    'pageSize': 10000,
    'needtoken': 0
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    isToken: false,
    fnSuccess: function fnSuccess(data) {
      console.log(data);
      mescroll.endSuccess();
      var aGrid = data.GRID0,
          sHtml = '',
          aTemp = [];
      var ln = aGrid.length;

      if (ln > 1) {
        $('.none').hide();
        var oIndex = {},
            titleDate = "";
        oIndex['ID'] = data['ID_INDEX'];
        oIndex['日期'] = data['PUBLISHDATE_INDEX'];
        oIndex['标题'] = data['TITLE_INDEX'];
        oIndex['图片'] = data['PICURL_INDEX'];
        oIndex['媒体'] = data['AUTHOR_INDEX'];
        oIndex['ISJUMP'] = data['ISJUMP_INDEX'];
        oIndex['JUMPLINK'] = data['JUMPLINK_INDEX'];

        for (var i = 1; i < ln; i++) {
          var aData = aGrid[i].split('|');

          if (aData[oIndex['日期']].substr(0, 10) != titleDate) {
            titleDate = aData[oIndex['日期']].substr(0, 10);
            sHtml += loadDOM_DATE(titleDate);
          }

          sHtml += loadDOM_SSGD(aData, oIndex);
        }
      }

      $('#mescroll ul').html(sHtml);
      pageUrl();
    }
  });
}

function formatDate(date) {
  var num = getDays(date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2));

  if (num == 0) {
    //今日
    return "今日" + date.substr(5, 5);
  } else if (num == 1) {
    //昨日
    return "昨日" + date.substr(5, 5);
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

function loadDOM_DATE(date) {
  var dates = [];
  $('.list_item_text').each(function () {
    dates.push($(this).text());
  });

  if (dates.indexOf(date) < 0) {
    //var sHtml = '<li class="list_item_text">' + date + '</li>';
    var sHtml = "";
  } else {
    var sHtml = "";
  }

  return sHtml;
}

function loadDOM_SSGD(data, index) {
  var readClass = '';
  var newDate = dateStr(data[index['日期']]);
  var sHtml = '<li class="zx-list" data-id="' + data[index['ID']] + '" data-isjump="' + data[index['ISJUMP']] + '" data-jumplink="' + data[index['JUMPLINK']] + '">' + '<div class="img" style="background: url(' + data[index['图片']] + ') no-repeat center / 0.5rem 0.5rem;"></div>' + '<p class="zx-name ' + readClass + '">' + data[index['标题']] + '</p>' + '<span class="zx-media">' + data[index['媒体']] + '</span>' + '<span class="zx-date">' + newDate + '</span>' + '</li>';
  return sHtml;
}

;

function pageUrl() {
  // var action='read.txt';
  $('.zx-list').off().on('click', function () {
    var sId = $(this).attr('data-id'),
        sJump = $(this).attr('data-isjump'),
        sLink = $(this).attr('data-jumplink');

    if (sJump == '1') {
      obj = {
        'url': sLink
      };
      var oSend = {
        url: obj.url
      };
      oSend.secondtype = '9';
    } else {
      obj = {
        'url': '/zx2/zx_zxxq.html?id=' + sId + '&type=huafu'
      };
      var oSend = {
        url: obj.url
      };
      oSend.secondtype = '98';
      oSend.secondtext = 'tzt_zx.png';
      oSend.secondjsfuncname = 'tztPageSecodeFun()';
    } // $(this).find(".zx-name").addClass('zx-read-name');


    TZT.fn.action10061(oSend);
  });
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
    if (year == nowyear) {
      return date.substr(5, 5);
    } else {
      return date.split(" ")[0];
    }
  }
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
/**
 * 功能：修改页面标题TITLE；
 *
 * 解释：调用客户端方法reqsyncchangetitle动态修改页面TITLE；
 */


function changetitle(title) {
  var obj = {};
  obj = {
    title: title
  };
  var jsonobj = JSON.stringify(obj);
  T.readLocalMesg(["tztwkwebview"], function (data) {
    if (data.TZTWKWEBVIEW == 1) {
      window.webkit.messageHandlers.setContentParams.postMessage({
        func: "reqsyncchangetitle",
        //回调函数名
        data: jsonobj //数据

      });
    } else {
      window.MyWebView.setContentParams("reqsyncchangetitle", jsonobj);
    }

    ;
  });
}