"use strict";

var mescroll = "",
    kx_list = {};
$(function () {
  init(9);
  pageEvent(); //getkx724();
  //getStock(600000);
  // getkx724_sp();
});

function init(typeid) {
  mescroll = '';
  upCallback({
    num: 0,
    size: 10,
    time: null,
    id: typeid
  });
  /*mescroll = new MeScroll("mescroll", {//创建MeScroll对象
      up: {
          auto:true,//初始化完毕,是否自动触发上拉加载的回调
          isBoth: true,
          isBounce: false, 
          page:{num:0,size:10,time:null,id:typeid},
          callback: upCallback, //上拉加载的回调
      },
      down:{
          auto:false,
          use:false,
          callback: downCallback,
      }
  });*/

  function downCallback(obj) {
    //console.log(obj.options.up.page)
    console.log("下拉刷新"); //$('.box ul').html(' ');
    //obj.options.up.page.num=0;
    //upCallback({num:1,size:10,time:null,id:obj.options.up.page.id});

    /*getkx724({num:1,size:10,time:null,id:obj.options.up.page.id});*/
  }
}

function pageEvent() {
  $('.ssgd').delegate(".newstitle", "click", function () {
    $(this).toggleClass("close");
  });
  $('.ssgd').delegate(".share", "click", function (event) {
    event.stopPropagation();
    var time = $(this).attr('data-time');
    var cont = $(this).attr('data-cont');
    var fl = $(this).attr('data-fl').split(";");
    var flHtml = '';

    for (var i = 0; i < fl.length; i++) {
      if (fl[i] == 9) {
        flHtml += "7X24快讯 ";
      } else if (fl[i] == 469) {
        flHtml += "利好 ";
      } else if (fl[i] == 10) {
        flHtml += "大新闻 ";
      } else if (fl[i] == 35) {
        flHtml += "盘中异动 ";
      } else if (fl[i] == 723) {
        flHtml += "公告 ";
      }
    }

    var bq = $(this).attr('data-bq');
    var bt = $(this).attr('data-bt');
    $('.captime').html(time);
    $(".caphead b").html(flHtml);
    $(".caphead p").html(bq);
    $(".capcentertitle").html(bt);
    $('.capcenter .capcontent').html(cont); //$('.capcenter').append('<div style="position: absolute;bottom: 0;background: #fff;width: 100%;height: .1rem;left:0;"></div>');

    /*html2canvas(document.querySelector("#capture")).then(canvas => {
        var imgUri = canvas.toDataURL("image/png",0.8); // 获取生成的图片的url
        //document.querySelector('#canvasImg').src=imgUri;
        var contentImg=imgUri.split('base64,')[1];
        //图片下载
        //var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        //window.location.href=imgUri;
        T.fn.changeurl('http://action:10055/?contenttype=1&&image='+encodeURIComponent(contentImg));
    });*/

    html2canvas(document.querySelector("#capture")).then(function (canvas) {
      var imgUri = canvas.toDataURL("image/png", 1); // 获取生成的图片的url
      //document.querySelector('#canvasImg').src=imgUri;

      var contentImg = imgUri.split('base64,')[1]; //图片下载
      //var imgUri = canvas.toDataURL("image/png",1).replace("image/png", "image/octet-stream");
      //window.location.href=imgUri;

      T.fn.changeurl('http://action:10055/?contenttype=1&&image=' + encodeURIComponent(contentImg));
    });
  });
  $('.ssgd .ssgd-tab').delegate("div", "click", function (event) {
    event.stopPropagation(); //console.log(mescroll);

    if ($(this).html() == "全部") {
      if ($(this).hasClass("active")) {
        if ($(this).siblings().hasClass("active")) {
          $(this).removeClass("active");
          /*$(".all").hide();*/
        } else {//你是最后一个了不可以取消
          //alert("你是最后一个了不可以取消")
        }
      } else {
        $(".all").show().siblings().hide(); //init($(this).data('id'));

        if (mescroll) {
          kx_list = {};
          mescroll.options.up.page.id = kx_list;
          mescroll.options.up.page.num = 1; //$(".all").html('')

          upCallback(mescroll.options.up.page);
        }

        $(this).addClass("active").siblings().removeClass("active");
      }
    } else {
      if ($(this).hasClass("active")) {
        if ($(this).siblings().hasClass("active")) {
          $(this).removeClass("active");
          /*$('.box ul').eq($(this).index()).hide();*/

          if (mescroll) {
            var key = $(this).data('id');
            delete kx_list[key];
            mescroll.options.up.page.id = kx_list;
            mescroll.options.up.page.num = 1; //$('.box ul').eq($(this).index()).html('');

            upCallback(mescroll.options.up.page);
          }
        } else {//你是最后一个了不可以取消
          //alert("你是最后一个了不可以取消")
        }
      } else {
        $(this).addClass("active"); //init($(this).data('id'));

        if (mescroll) {
          var key1 = $(this).data('id');
          kx_list[key1] = key1;
          mescroll.options.up.page.id = kx_list;
          mescroll.options.up.page.num = 1; //$('.box ul').eq($(this).index()).html('');

          upCallback(mescroll.options.up.page);
        }
        /*$('.box ul').eq($(this).index()).show();*/


        $(this).siblings().each(function () {
          if ($(this).html() == "全部" && $(this).hasClass("active")) {
            $(this).removeClass("active");
            /*$(".all").hide();*/
          }
        });
      }
    }
  });
  $('.ssgd').delegate('.hd_title', 'click', function () {
    /*var sId = $(this).attr('data-id');
    var obj = {
        'url':'/zx2/zx_zxxq.html?id=' + sId + '&&menu_id=003'+"&&type=hejzx"
    };
    var oSend = {url:obj.url};
    TZT.fn.action10061(oSend);*/
  }); //跳转个股行情页

  $('.ssgd').delegate('.list_item_bottom span', 'click', function (event) {
    T.stopBubble();
    /*console.log($(this).find(".code").attr('data-id'))*/

    var stockcode = $(this).find(".code").attr('data-id');
    var stocktype = $(this).find(".code").attr('data-market');
    onJsOverrideUrlLoading("http://action:12051/?stockcode=" + stockcode + "&&stocktype=" + stocktype);
  }); //跳转个股行情页

  $('.ssgd').delegate('.hd_date span', 'click', function (event) {
    T.stopBubble();
    console.log($(this).attr('data-id'));
    var sId = $(this).attr('data-id');

    if (!sId) {
      return;
    }

    var obj = {
      'url': '/hq/zt_xq.html?id=' + sId + ''
    };
    var oSend = {
      url: obj.url
    };
    TZT.fn.action10061(oSend);
  });
}

function upCallback(page) {
  //上拉加载的回调
  //console.log("上拉加载",page)
  if (page.num == 1) {
    //切换列表时，注意清空下列表数据，否则顶部日期会被隐藏（因为下面做了判断）
    $('#mescroll ul.all').html('');
    /*if(page.id==9){
        $('#mescroll ul.all').html('')
    }else if(page.id==469){
        $('#mescroll ul.lh').html('')
    }else if(page.id==10){
        $('#mescroll ul.dxw').html('')
    }else if(page.id==35){
        $('#mescroll ul.pzyd').html('')
    }else if(page.id==723){
        $('#mescroll ul.gg').html('')
    }*/
  }

  console.log("切换列表：", kx_list, page);
  var oSendData = '';

  if ($.isEmptyObject(kx_list)) {
    //判断对象是否为空
    oSendData = {
      action: '50050',

      /*46118*/
      channel_num: '1',
      //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
      menu_id: '20145',
      nPage: page.num,
      maxcount: page.size,
      ReqLinkType: '2'
      /*type_id:'10,35',*/

    };
  } else {
    var arr = [];

    for (var key in kx_list) {
      arr.push(kx_list[key]);
    }

    oSendData = {
      action: '50050',

      /*46118*/
      channel_num: '1',
      //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
      menu_id: '20145',
      nPage: page.num,
      maxcount: page.size,
      ReqLinkType: '2',
      type_id: arr.join(",") //数组转字符串

    };
  } //console.log("22222",oSendData);


  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      console.log("7*24快讯：", data);
      /*标题|日期|摘要|配图|标签|利好标签(-2，-1，0，1，2)正值好，负值空|url|相关股票代码,股票名称 (涨跌幅取行情)*/

      var aGrid = data.GRID0,
          sHtml = '',
          titleDate = "";

      if (aGrid && aGrid.length >= 1) {
        var _title = data.TITLE,
            //标题
        _date = data.DATE,
            //日期
        _summary = data.SUMMARY,
            //摘要
        _image = data.IMAGE,
            //配图
        _null = data.PLATE,
            //标签
        _impact = data.IMPACT,
            //利好标签
        _url = data.URL,
            //url
        _stocks = data.STOCKS,
            //相关股票
        _infocode = data.INFOCODE,
            //infocode
        _subjects = data.SUBJECTS,
            //对应分类
        _plateid = data.PLATEID; //对应主题id

        try {
          //防止后台数据错误
          var _rq = '',
              _dateWeek = ''; //9=全部、469=利好、10=大新闻、35=盘中异动、723=公告

          for (var i = 0; i < aGrid.length; i++) {
            var oData = aGrid[i].split("|");
            var reg = / style\s*=(['\"\s]?)[^'\"]*?\1/gi;

            var dTitle = oData[_title].trim().replace(reg, '').replace(/  /g, '|').replace(/http:\/\/stock:/g, 'http://action:12051/?stockcode='); //标题


            var _class = oData[_impact] > 0 ? " " : "none"; //利好标识是否显示


            var _dxwclass = oData[_subjects].indexOf("10") > -1 ? "big_news" : " "; //大新闻标识


            var timehtml = '';

            if (oData[_date] != '') {
              oData[_date] = setDateTime(oData[_date]).format("yyyy-MM-dd hh:mm:ss");
              timehtml = oData[_date].split(" ")[1].split(":")[0] + ":" + oData[_date].split(" ")[1].split(":")[1];
            } //处理日期


            _rq = oData[_date].split(" ")[0];
            _dateWeek = _rq + " " + isWeek(_rq);

            if (_dateWeek != titleDate) {
              var dates = [];
              $('.all .list_item_text .list_date').each(function () {
                dates.push($(this).text());
              });

              if (dates.indexOf(_dateWeek) < 0) {
                titleDate = _dateWeek;
                sHtml += '<li class="list_item_text">\n' + '                    <span class="list_date">' + titleDate + '</span>\n' + '                    <span class="list_item_source">\n' + '                        来源：华尔街见闻\n' + '                    </span>\n' + '                </li>';
              } else {//sHtml += "";
              }
            } //处理标签


            var bqData = oData[_null],
                bqhtml = '',
                bqPlateid = ''; //bqData="环保;园林";

            if (_plateid) bqPlateid = oData[_plateid];

            if (bqData) {
              bqData = bqData.split(";"); //分号区分

              if (_plateid) {
                bqPlateid = bqPlateid.split(";");
              } else {//bqPlateid=[1,2,3,4]
              }

              for (var j = 0; j < bqData.length; j++) {
                if (_plateid) {
                  bqhtml += '<span data-id=' + bqPlateid[j] + '>#' + bqData[j] + '</span>';
                } else {
                  bqhtml += "<span data-id=''>#" + bqData[j] + "</span>";
                }
              }
            } //处理股票


            var gpData = oData[_stocks],
                gphtml = ''; //gpData="首创股份,600008;飞乐音响,600651;飞乐音响1,600652";

            if (gpData) {
              gpData = gpData.split(";"); //还不确定是不是以分号,逗号区分，先默认分号,逗号;类似：（勤上股份,002638;飞乐音响,600651）

              for (var k = 0; k < gpData.length; k++) {
                if (k < 2) {
                  //默认只取前两支股票
                  gphtml += '<span><i class="code" data-market="' + gpData[k].split(',')[2] + '" data-id="' + gpData[k].split(',')[1] + '">' + gpData[k].split(',')[0] + '</i><i class="range"> --%</i></span>'; //关于涨幅等dom加载完后再获取
                } else {
                  continue;
                }
              }
            } //分享时间


            var share_time = '';

            if (oData[_date] != '') {
              share_time = kxDate(oData[_date]);
            }
            /*2019-08-07 04:22:15 格林尼治时间，*/


            if (oData[_title].indexOf("---") > -1) {
              console.log("含有---：", oData);
              oData[_title] = oData[_title].replace(/---/, "|");
            }

            sHtml += '<li class="list_item" data-id="">\n' + '                    <div class="list_item_hd">\n' + '                        <div class="hd_line_cn">\n' + '                            <em class="red_yd"></em>\n' + '                        </div>\n' + '                    </div>\n' + '                    <div class="list_item_bd">\n' + '                        <div class="hd_date"><p class="date ' + _dxwclass + '">' + timehtml + '</p>' + bqhtml + '</div>\n' + '                        <p class="hd_title ' + _dxwclass + '" data-id="' + oData[_infocode] + '">' + oData[_title] + ' <img class="' + _class + '" src="./img/lh.png" alt="lh"></p>\n' + '                        <p class="one-line newstitle close ' + _dxwclass + '">\n' + '                            ' + oData[_summary] + '\n' + '                        </p>\n' + '                        <div class="list_item_bottom">\n' + '                            <p class="item_bottom clear">' + gphtml + '</p>\n' + '                            <div class="share" data-bt="' + oData[_title] + '" data-fl="' + oData[_subjects] + '" data-bq="' + bqhtml + '" data-time="' + share_time + '" data-cont="' + oData[_summary] + '"><i></i></div>\n' + '                        </div>\n' + '                    </div>\n' + '                </li>';
          } //sHtml +='';


          if (page.num == 1) {
            $('#mescroll ul.all').html(sHtml);
            $('#mescroll').scrollTop(0);
            $(".all .item_bottom span").each(function () {
              getStock($(this).find(".code").attr("data-id"), $(this).find(".range"));
            });
          } else {
            $('#mescroll ul.all').append(sHtml);
            $(".all .item_bottom span").each(function () {
              getStock($(this).find(".code").attr("data-id"), $(this).find(".range"));
            });
          }
        } catch (e) {
          //mescroll.endErr();
          console.log("错误信息：", e);
        }
      } else {
        $('#mescroll ul').append("没有数据");
      } //mescroll.endSuccess();
      //mescroll.endErr();

    },
    oConfig: function oConfig(data) {
      alert(data); //mescroll.endErr();
    }
  }); //getkx724(page);
}

function formatDate(date) {
  var num = getDays(date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2));

  if (num == 0) {
    //今日
    return "今日 " + date.substr(5, 5);
  } else if (num == 1) {
    //昨日
    return "昨日 " + date.substr(5, 5);
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
    var sHtml = '<li class="list_item_text">' + date + '</li>';
  } else {
    var sHtml = "";
  }

  return sHtml;
}

function loadDOM_SSGD(data, index) {
  var readClass = '';
  var dede = data[index['日期']].replace(/\s+/, "&").split("&"); //日期

  var dedeDate = dede[0].replace(/-/, "&").split("&")[1]; //日期

  var dedeTime = dede[1].substr(0, 5); //时间

  var reg = / style\s*=(['\"\s]?)[^'\"]*?\1/gi;
  var dTitle = data[index['标题']].trim().replace(reg, '').replace(/  /g, '|').replace(/http:\/\/stock:/g, 'http://action:12051/?stockcode='); //标题

  var dTime = dedeTime; //时间

  var sHtml = '<li class="list_item" data-id="' + data[index['ID']] + '">' + '<div class="list_item_hd">' + '<div class="hd_date">' + '<p class="date">' + dedeTime + '</p>' + '</div><div class="hd_line_cn"><em class="red_yd"></em></div>' + '</div>' + '<div class="list_item_bd">' + '<p class="one-line newstitle close">' + dTitle + '</p>' + '<div class="share" data-time="' + kxDate(data[1]) + '" data-cont="' + dTitle + '"><i></i></div>' + '</div>' + '</li>';
  return sHtml;
}

;

function kxDate(data) {
  //快讯分享时间转换
  var date = data.toString().split(' ');
  var day = date[0].substring(5).replace('-', '月') + '日';
  var time = date[1].substring(0, 5);
  return day + ' ' + time;
}
/*获取7*24快讯*/


function getkx724(page) {
  console.log("!!!!!!!!", page);
  page = {
    num: 1,
    size: 10
  };
  var oSendData = {
    action: '50050',

    /*46118*/
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '20150',
    nPage: page.num,
    maxcount: page.size,
    ReqLinkType: '2',
    type_id: page.id
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      console.log("7*24快讯：", data);
      /*标题|日期|摘要|配图|标签|利好标签(-2，-1，0，1，2)正值好，负值空|url|相关股票代码,股票名称 (涨跌幅取行情)*/
      //$('#mescroll ul').append("sHtml");

      var aGrid = data.GRID0,
          sHtml = '';

      if (aGrid && aGrid.length >= 1) {
        var _title = data.TITLE,
            //标题
        _date = data.DATE,
            //日期
        _summary = data.SUMMARY,
            //摘要
        _image = data.IMAGE,
            //配图
        _null = data.NULL,
            //标签
        _impact = data.IMPACT,
            //利好标签
        _url = data.URL,
            //url
        _stocks = data.STOCKS,
            //相关股票
        _infocode = data.INFOCODE;

        var _rq = aGrid[0].split("|")[_date].split(" ")[0]; //var _today=isToday(_rq);


        var week = isWeek(_rq);
        $(".ssgd .list_item_text span.list_date").html(_rq + " " + week);

        if (page.id == 9) {
          //全部
          for (var i = 0; i < aGrid.length; i++) {
            var oData = aGrid[i].split("|");
            var reg = / style\s*=(['\"\s]?)[^'\"]*?\1/gi;

            var dTitle = oData[_title].trim().replace(reg, '').replace(/  /g, '|').replace(/http:\/\/stock:/g, 'http://action:12051/?stockcode='); //标题


            var _class = oData[_impact] > 0 ? " " : "none"; //利好标识是否显示


            var timehtml = oData[_date].split(" ")[1].split(":")[0] + ":" + oData[_date].split(" ")[1].split(":")[1];

            sHtml += '<li class="list_item" data-id="">\n' + '                    <div class="list_item_hd">\n' + '                        <div class="hd_line_cn">\n' + '                            <em class="red_yd"></em>\n' + '                        </div>\n' + '                    </div>\n' + '                    <div class="list_item_bd">\n' + '                        <div class="hd_date">\n' + '                            <p class="date">' + timehtml + '</p>\n' + '                            <span>#园林</span>\n' + '                            <span>#环保</span>\n' + '                        </div>\n' + '                        <p class="hd_title">' + oData[_title] + ' <img class="' + _class + '" src="./img/lh.png" alt="lh"></p>\n' + '                        <p class="one-line newstitle close">\n' + '                            ' + oData[_summary] + '\n' + '                        </p>\n' + '                        <div class="list_item_bottom">\n' + '                            <p class="item_bottom clear">\n' + '                                <span class="left">兴发集团 +4.89%</span>\n' + '                                <span class="right">澄星股份 -0.89%</span>\n' + '                            </p>\n' + '                            <div class="share" data-time="' + kxDate(oData[_date]) + '" data-cont="' + dTitle + '"><i></i></div>\n' + '                        </div>\n' + '                    </div>\n' + '                </li>';
          }

          sHtml += '';

          if (page.num == 1) {
            $('#mescroll ul.all').html(sHtml);
          } else {
            $('#mescroll ul.all').append(sHtml);
          }
        }
      } else {
        $('#mescroll ul').append("没有数据");
      } //mescroll.endSuccess();


      mescroll.endErr();
    }
  });
}

;
/*获取股票涨跌幅*/

function getStock(stockcode, oDom) {
  if (stockcode) {
    oSendData = {
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
/**/

function isToday(str) {
  return new Date().toDateString() === new Date(str.replace(/-/g, '/')).toDateString(); //ios中时间转换new Date()不兼容横杆'-'问题，转为斜杠‘/’
}
/*日期转换成星期*/


function isWeek(str) {
  var array = new Array();
  var date = str; //日期为输入日期，格式为 2016-8-10

  array = date.split('-');
  var ndate = new Date(array[0], parseInt(array[1] - 1), array[2]);
  var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"); //var weekDay = weekArray[ndate.getDay()];

  return weekArray[ndate.getDay()];
}
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
/*获取7*24快讯 收评*/


function getkx724_sp(page) {
  console.log("!!!!!!!!", page);
  page = {
    num: 1,
    size: 10
  };
  var oSendData = {
    action: '50050',

    /*46118*/
    channel_num: '1',
    //渠道识别，备注：可以在配置文件里面改，要和华福约定，暂时先用1
    menu_id: '20150',
    nPage: page.num,
    maxcount: page.size,
    ReqLinkType: '2',
    type_id: page.id
  };
  $.getData({
    oSendData: oSendData,
    copyIsArray: false,
    isload: false,
    fnSuccess: function fnSuccess(data) {
      console.log("7*24快讯 收评：", data);
      /*标题|日期|摘要|配图|标签|利好标签(-2，-1，0，1，2)正值好，负值空|url|相关股票代码,股票名称 (涨跌幅取行情)*/
      //$('#mescroll ul').append("sHtml");

      var aGrid = data.GRID0,
          sHtml = '';

      if (aGrid && aGrid.length >= 1) {} else {}
    }
  });
}

;