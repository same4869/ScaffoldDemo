"use strict";

window.GoBackOnLoad = function () {
  init();
};

var swiper = '',
    swiper1 = '';
var oldDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; //七天后时间
//下拉刷新

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
  getBanner(); //轮播图

  getHDZQ(); //华福课堂

  getTJTS(); //投教特色
}

function loadDown() {
  getTJQY(); //权益

  getTJZT(); //专题

  getTJJD(); //基地
} //轮播图


function getBanner() {
  T.readFileMesg('SZBANNERDOM', function (data) {
    var nowDate = new Date().getTime();

    if (data && parseInt(nowDate) < parseInt(JSON.parse(decodeURIComponent(data))[1].dateStr)) {
      var bannerDom = JSON.parse(decodeURIComponent(data))[0].sHtml;
      $('.szxt-banner .swiper-wrapper').html(bannerDom).attr('data-on', '1');

      if (swiper == '') {
        swiper = new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          autoplay: 3000,
          autoplayDisableOnInteraction: false
        });
      }

      var oSendData = {
        'action': '41500',
        'type': 'SZXT',
        'ReqlinkType': '2'
      };
      $.getData({
        oSendData: oSendData,
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          mescroll.endSuccess();

          if (oData.ERRORNO >= 0) {
            var ln = oData.GRID0.length,
                sHtml = '';

            if (ln > 1) {
              for (var i = 1; i < ln; i++) {
                var oItem = oData.GRID0[i].split('|');
                sHtml += '<div class="swiper-slide" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '"><img class="image" src="' + oItem[oData.IMAGE_URL_INDEX] + '"></div>';
              }

              $('.bannerdom').html(sHtml);
            } else {
              sHtml += '<div class="swiper-slide"><img class="image" src="/home_new/images/banner.png"></div>';
              $('.bannerdom').html(sHtml);
            }

            T.saveFileMesg(JSON.stringify([{
              'sHtml': sHtml
            }, {
              'dateStr': oldDate
            }]), 'SZBANNERDOM', function () {});
            bannerEvent();
          }
        }
      });
    } else {
      var oSendData = {
        'action': '41500',
        'type': 'SZXT',
        'ReqlinkType': '2'
      };
      $.getData({
        oSendData: oSendData,
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          console.log(oData);
          mescroll.endSuccess();

          if (oData.ERRORNO >= 0) {
            var ln = oData.GRID0.length,
                sHtml = '';

            if (ln > 1) {
              for (var i = 1; i < ln; i++) {
                var oItem = oData.GRID0[i].split('|');
                sHtml += '<div class="swiper-slide" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '"><img class="image" src="' + oItem[oData.IMAGE_URL_INDEX] + '"></div>';
              }

              $('.szxt-banner .swiper-wrapper').html(sHtml).attr('data-on', '1');
            } else {
              sHtml += '<div class="swiper-slide"><img class="image" src="/home_new/images/banner.png"></div>';
              $('.szxt-banner .swiper-wrapper').html(sHtml).attr('data-on', '1');
            } //$('.szxt-banner .swiper-slide').css("height", Number($(document).width()) / 750 * 330 + "px");


            T.saveFileMesg(JSON.stringify([{
              'sHtml': sHtml
            }, {
              'dateStr': oldDate
            }]), 'SZBANNERDOM', function () {});

            if (swiper == '') {
              swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                autoplay: 3000,
                autoplayDisableOnInteraction: false
              });
            }

            bannerEvent();
          }
        }
      });
    }
  });
}

function bannerEvent() {
  $('.szxt-banner .swiper-wrapper .swiper-slide').unbind().on('click', function () {
    var url = $(this).attr('data-url');

    if (url) {
      T.fn.action10061({
        url: url
      });
    }
  });
} //华福课堂


function getHDZQ() {
  T.readFileMesg('HFKTDOM', function (data) {
    var nowDate = new Date().getTime();

    if (data && parseInt(nowDate) < parseInt(JSON.parse(decodeURIComponent(data))[1].dateStr)) {
      var bannerDom = JSON.parse(decodeURIComponent(data))[0].sHtml;
      $('.hfkt-box .swiper-container1 .swiper-wrapper').html(bannerDom).attr('data-on', '1');

      if (swiper1 == '') {
        swiper1 = new Swiper('.swiper-container1', {
          slidesPerView: 'auto' // spaceBetween: 10

        });
      }

      var oSendData = {
        'action': '41500',
        'type': 'HFKT',
        'ReqlinkType': '2'
      };
      $.getData({
        oSendData: oSendData,
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          mescroll.endSuccess();

          if (oData.ERRORNO >= 0) {
            var ln = oData.GRID0.length,
                sHtml = '';

            if (ln > 1) {
              for (var i = 1; i < ln; i++) {
                var oItem = oData.GRID0[i].split('|');
                sHtml += '<div class="swiper-slide item1" style="width: 1.28rem;" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '">' + '<img class="box-item" src="' + oItem[oData.IMAGE_URL_INDEX] + '"/>' + '<p class="item-title">' + oItem[oData.IMAGE_TITLE_INDEX] + '</p></div>';
              }

              $('.hfkt-boxDom').html(sHtml);
            }

            T.saveFileMesg(JSON.stringify([{
              'sHtml': sHtml
            }, {
              'dateStr': oldDate
            }]), 'HFKTDOM', function () {});
            HDZQEvent();
          }
        }
      });
    } else {
      var oSendData = {
        'action': '41500',
        'type': 'HFKT',
        'ReqlinkType': '2'
      };
      $.getData({
        oSendData: oSendData,
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          console.log(oData);
          mescroll.endSuccess();

          if (oData.ERRORNO >= 0) {
            var ln = oData.GRID0.length,
                sHtml = '';

            if (ln > 1) {
              for (var i = 1; i < ln; i++) {
                var oItem = oData.GRID0[i].split('|');
                sHtml += '<div class="swiper-slide item1" style="width: 1.28rem;" data-url="' + oItem[oData.IMAGE_CLICK_INDEX] + '">' + '<img class="box-item" src="' + oItem[oData.IMAGE_URL_INDEX] + '"/>' + '<p class="item-title">' + oItem[oData.IMAGE_TITLE_INDEX] + '</p></div>';
              }

              $('.hfkt-box .swiper-container1 .swiper-wrapper').html(sHtml);
            }

            T.saveFileMesg(JSON.stringify([{
              'sHtml': sHtml
            }, {
              'dateStr': oldDate
            }]), 'HFKTDOM', function () {});

            if (swiper1 == '') {
              swiper1 = new Swiper('.swiper-container1', {
                slidesPerView: 'auto' // spaceBetween: 10

              });
            }

            HDZQEvent();
          }
        }
      });
    }
  });
}

function HDZQEvent() {
  $('.hfkt-box .swiper-container1 .swiper-wrapper .swiper-slide').unbind().on('click', function () {
    T.fn.action10061({
      url: $(this).attr('data-url')
    });
  });
} //投教特色


function getTJTS() {
  T.readFileMesg('TJTSDOM', function (data) {
    var nowDate = new Date().getTime();

    if (data && parseInt(nowDate) < parseInt(JSON.parse(decodeURIComponent(data))[1].dateStr)) {
      var tjtsDom = JSON.parse(decodeURIComponent(data))[0].sHtml;
      $('.tjts .tjts-box').html(tjtsDom);
      var oSendData = {
        'action': '47100',
        'bigType': 'SZXY',
        'Type': '93',
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
              var picurl_index = oData.PICURL_INDEX; //图片路径

              var title_index = oData.TITLE_INDEX; //标题

              var crtai_summary_index = oData.CRTAI_SUMMARY_INDEX; //文章摘要

              var id = oData.ID_INDEX; //资讯ID

              for (var i = 1; i < ln; i++) {
                var oItem = oData.GRID0[i].split('|');
                sHtml += '<div class="box-item" data-id="' + i + '"><img src="' + oItem[picurl_index] + '" ><p class="title">' + oItem[title_index] + '</p><p class="subtitle">' + oItem[crtai_summary_index] + '</p></div>';
              }

              $('.tjts .tjts-boxDom').html(sHtml);
              T.saveFileMesg(JSON.stringify([{
                'sHtml': sHtml
              }, {
                'dateStr': oldDate
              }]), 'TJTSDOM', function () {});
              TJTSEvent();
            }
          }
        }
      });
    } else {
      var oSendData = {
        'action': '47100',
        'bigType': 'SZXY',
        'Type': '93',
        'ReqlinkType': '2'
      };
      $.getData({
        oSendData: oSendData,
        isload: false,
        fnSuccess: function fnSuccess(oData) {
          console.log(oData);

          if (oData.ERRORNO >= 0) {
            var ln = oData.GRID0.length,
                sHtml = '';

            if (ln > 1) {
              if (ln > 1) {
                var picurl_index = oData.PICURL_INDEX; //图片路径

                var title_index = oData.TITLE_INDEX; //标题

                var crtai_summary_index = oData.CRTAI_SUMMARY_INDEX; //文章摘要

                var id = oData.ID_INDEX; //资讯ID

                for (var i = 1; i < ln; i++) {
                  var oItem = oData.GRID0[i].split('|');
                  sHtml += '<div class="box-item" data-id="' + i + '"><img src="' + oItem[picurl_index] + '" ><p class="title">' + oItem[title_index] + '</p><p class="subtitle">' + oItem[crtai_summary_index] + '</p></div>';
                }

                $('.tjts .tjts-box').html(sHtml);
              }

              T.saveFileMesg(JSON.stringify([{
                'sHtml': sHtml
              }, {
                'dateStr': oldDate
              }]), 'TJTSDOM', function () {});
              TJTSEvent();
            }
          }
        }
      });
    }
  });
} //跳转投教特色详情


function TJTSEvent() {
  $('.tjts .tjts-box .box-item').unbind().on('click', function () {
    var id = $(this).attr('data-id');

    if (id == '2') {
      T.fn.action10061({
        url: '/home_new/szxt_xxxq.html?id=' + id + '&type=tjdsx'
      });
    } else if (id == '1') {
      T.fn.action10061({
        url: '/home_new/szxt_xxxq.html?id=' + id + '&type=xhs'
      });
    }
  });
  loadDown();
} //权益


function getTJQY() {
  var oSendData = {
    'action': '41500',
    'Type': 'TJQY',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      console.log(oData);

      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';

        if (ln > 1) {
          $('.qy-box .box-item').each(function (i, item) {
            var that = $(this);
            var oItem = oData.GRID0[i + 1].split('|');
            that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain');
            that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX]);
          });
          var tjqyNext = $('.qy-box').html();
          T.saveFileMesg(JSON.stringify([{
            'sHtml': tjqyNext
          }, {
            'dateStr': oldDate
          }]), 'TJQYDOM', function () {});
          TJQYEvent();
        }
      }
    }
  }); // T.readFileMesg('TJQYDOM', function (data) {
  // 	var nowDate = new Date().getTime();
  // 	if (data && parseInt(nowDate) < parseInt(JSON.parse(decodeURIComponent(data))[1].dateStr)) {
  // 		var tjqyDom = JSON.parse(decodeURIComponent(data))[0].sHtml;
  // 		$('.qy-box').html(tjqyDom);
  // 		var oSendData = {
  // 			'action': '41500',
  // 			'Type': 'TJQY',
  // 			'ReqlinkType': '2'
  // 		};
  // 		$.getData({
  // 			oSendData: oSendData,
  // 			isload: false,
  // 			fnSuccess: function (oData) {
  // 				if (oData.ERRORNO >= 0) {
  // 					var ln = oData.GRID0.length,
  // 						sHtml = '';
  // 					if (ln > 1) {
  // 						$('.qy-boxDom .box-item').each(function (i, item) {
  // 							var that = $(this);
  // 							var oItem = oData.GRID0[i + 1].split('|');
  // 							that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain')
  // 							that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX])
  // 						})
  // 						var tjqyNext = $('.qy-boxDom').html();
  // 						T.saveFileMesg(JSON.stringify([{
  // 							'sHtml': tjqyNext
  // 						}, {
  // 							'dateStr': oldDate
  // 						}]), 'TJQYDOM', function () {})
  // 						TJQYEvent();
  // 					}
  // 				}
  // 			}
  // 		})
  // 	} else {
  // 		var oSendData = {
  // 			'action': '41500',
  // 			'Type': 'TJQY',
  // 			'ReqlinkType': '2'
  // 		};
  // 		$.getData({
  // 			oSendData: oSendData,
  // 			isload: false,
  // 			fnSuccess: function (oData) {
  // 				console.log(oData);
  // 				if (oData.ERRORNO >= 0) {
  // 					var ln = oData.GRID0.length,
  // 						sHtml = '';
  // 					if (ln > 1) {
  // 						$('.qy-box .box-item').each(function (i, item) {
  // 							var that = $(this);
  // 							var oItem = oData.GRID0[i + 1].split('|');
  // 							that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain')
  // 							that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX])
  // 						})
  // 						var tjqyNext = $('.qy-box').html();
  // 						T.saveFileMesg(JSON.stringify([{
  // 							'sHtml': tjqyNext
  // 						}, {
  // 							'dateStr': oldDate
  // 						}]), 'TJQYDOM', function () {})
  // 						TJQYEvent();
  // 					}
  // 				}
  // 			}
  // 		})
  // 	}
  // })
} //跳转权益模块详情


function TJQYEvent() {
  $('.qy-box .box-item').unbind().on('click', function () {
    T.fn.action10061({
      url: $(this).attr('data-url')
    });
  });
} //专题


function getTJZT() {
  var oSendData = {
    'action': '41500',
    'type': 'TJZT',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      console.log(oData);

      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';

        if (ln > 1) {
          $('.zt-box .box-item').each(function (i, item) {
            var that = $(this);
            var oItem = oData.GRID0[i + 1].split('|');
            that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain');
            that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX]);
          });
          var tjztNext = $('.zt-box').html();
          T.saveFileMesg(JSON.stringify([{
            'sHtml': tjztNext
          }, {
            'dateStr': oldDate
          }]), 'TJZTDOM', function () {});
          TJZTEvent();
        }
      }
    }
  }); // T.readFileMesg('TJZTDOM', function (data) {
  // 	var nowDate = new Date().getTime();
  // 	if (data && parseInt(nowDate) < parseInt(JSON.parse(decodeURIComponent(data))[1].dateStr)) {
  // 		var tjztDom = JSON.parse(decodeURIComponent(data))[0].sHtml;
  // 		$('.zt-box').html(tjztDom);
  // 		var oSendData = {
  // 			'action': '41500',
  // 			'type': 'TJZT',
  // 			'ReqlinkType': '2'
  // 		};
  // 		$.getData({
  // 			oSendData: oSendData,
  // 			isload: false,
  // 			fnSuccess: function (oData) {
  // 				if (oData.ERRORNO >= 0) {
  // 					var ln = oData.GRID0.length,
  // 						sHtml = '';
  // 					if (ln > 1) {
  // 						$('.zt-boxDom .box-item').each(function (i, item) {
  // 							var that = $(this);
  // 							var oItem = oData.GRID0[i + 1].split('|');
  // 							that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain')
  // 							that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX])
  // 						})
  // 						var tjztNext = $('.zt-boxDom').html();
  // 						T.saveFileMesg(JSON.stringify([{
  // 							'sHtml': tjztNext
  // 						}, {
  // 							'dateStr': oldDate
  // 						}]), 'TJZTDOM', function () {})
  // 						TJZTEvent();
  // 					}
  // 				}
  // 			}
  // 		})
  // 	} else {
  // 		var oSendData = {
  // 			'action': '41500',
  // 			'type': 'TJZT',
  // 			'ReqlinkType': '2'
  // 		};
  // 		$.getData({
  // 			oSendData: oSendData,
  // 			isload: false,
  // 			fnSuccess: function (oData) {
  // 				console.log(oData);
  // 				if (oData.ERRORNO >= 0) {
  // 					var ln = oData.GRID0.length,
  // 						sHtml = '';
  // 					if (ln > 1) {
  // 						$('.zt-box .box-item').each(function (i, item) {
  // 							var that = $(this);
  // 							var oItem = oData.GRID0[i + 1].split('|');
  // 							that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain')
  // 							that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX])
  // 						})
  // 						var tjztNext = $('.zt-box').html();
  // 						T.saveFileMesg(JSON.stringify([{
  // 							'sHtml': tjztNext
  // 						}, {
  // 							'dateStr': oldDate
  // 						}]), 'TJZTDOM', function () {})
  // 						TJZTEvent();
  // 					}
  // 				}
  // 			}
  // 		})
  // 	}
  // })
}

function TJZTEvent() {
  $('.zt-box .box-item').unbind().on('click', function () {
    T.fn.action10061({
      url: $(this).attr('data-url')
    });
  });
} //基地


function getTJJD() {
  var oSendData = {
    'action': '41500',
    'type': 'TJJD',
    'ReqlinkType': '2'
  };
  $.getData({
    oSendData: oSendData,
    isload: false,
    fnSuccess: function fnSuccess(oData) {
      console.log(oData);

      if (oData.ERRORNO >= 0) {
        var ln = oData.GRID0.length,
            sHtml = '';

        if (ln > 1) {
          $('.jd_box .box-item').each(function (i, item) {
            var that = $(this);
            var oItem = oData.GRID0[i + 1].split('|');
            that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain');
            that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX]);
          });
          var tjjdNext = $('.jd_box').html();
          T.saveFileMesg(JSON.stringify([{
            'sHtml': tjjdNext
          }, {
            'dateStr': oldDate
          }]), 'TJJDDOM', function () {});
          TJJDEvent();
        }
      }
    }
  }); // T.readFileMesg('TJJDDOM', function (data) {
  // 	var nowDate = new Date().getTime();
  // 	if (data && parseInt(nowDate) < parseInt(JSON.parse(decodeURIComponent(data))[1].dateStr)) {
  // 		var tjjdDom = JSON.parse(decodeURIComponent(data))[0].sHtml;
  // 		$('.jd_box').html(tjjdDom);
  // 		var oSendData = {
  // 			'action': '41500',
  // 			'type': 'TJJD',
  // 			'ReqlinkType': '2'
  // 		};
  // 		$.getData({
  // 			oSendData: oSendData,
  // 			isload: false,
  // 			fnSuccess: function (oData) {
  // 				if (oData.ERRORNO >= 0) {
  // 					var ln = oData.GRID0.length,
  // 						sHtml = '';
  // 					if (ln > 1) {
  // 						$('.jd_boxDom .box-item').each(function (i, item) {
  // 							var that = $(this);
  // 							var oItem = oData.GRID0[i + 1].split('|');
  // 							that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain')
  // 							that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX])
  // 						})
  // 						var tjjdNext = $('.jd_boxDom').html();
  // 						T.saveFileMesg(JSON.stringify([{
  // 							'sHtml': tjjdNext
  // 						}, {
  // 							'dateStr': oldDate
  // 						}]), 'TJJDDOM', function () {})
  // 						TJJDEvent();
  // 					}
  // 				}
  // 			}
  // 		})
  // 	} else {
  // 		var oSendData = {
  // 			'action': '41500',
  // 			'type': 'TJJD',
  // 			'ReqlinkType': '2'
  // 		};
  // 		$.getData({
  // 			oSendData: oSendData,
  // 			isload: false,
  // 			fnSuccess: function (oData) {
  // 				console.log(oData);
  // 				if (oData.ERRORNO >= 0) {
  // 					var ln = oData.GRID0.length,
  // 						sHtml = '';
  // 					if (ln > 1) {
  // 						$('.jd_box .box-item').each(function (i, item) {
  // 							var that = $(this);
  // 							var oItem = oData.GRID0[i + 1].split('|');
  // 							that.css('background', 'url(' + oItem[oData.IMAGE_URL_INDEX] + ') no-repeat center / contain')
  // 							that.attr("data-url", oItem[oData.IMAGE_CLICK_INDEX])
  // 						})
  // 						var tjjdNext = $('.jd_box').html();
  // 						T.saveFileMesg(JSON.stringify([{
  // 							'sHtml': tjjdNext
  // 						}, {
  // 							'dateStr': oldDate
  // 						}]), 'TJJDDOM', function () {})
  // 						TJJDEvent();
  // 					}
  // 				}
  // 			}
  // 		})
  // 	}
  // })
}

function TJJDEvent() {
  $('.jd_box .box-item').unbind().on('click', function () {
    T.fn.action10061({
      url: $(this).attr('data-url')
    });
  });
}