/*
 * @Author: kinght
 * @Date: 2019-01-14
 * @Editors:  yyj
 * @Description: 为了方便项目中弹窗的规范，特整合弹窗，如有需要，可自定义相应风格的弹窗。
 */

/**
 * @description: 弹窗
 * @param : obj
 * @return: fn
 * @example: popupAlert({
			 	title: '系统提示',
			 	message: '<span style="display:inline-block;height:.94rem;line-height:.94rem">自定义的内容显示</span>',
			 	cueYes: '确定',
			 	cueNo: '取消',
				pictype: '',
			 	yesBtn: function yesBtn() {},
			 	noBtn: function noBtn() {},
			})
 */
var popupAlertCommon = function popupAlert(obj) {
    // 弹框的默认设置
    var setting = {
        title: '', // 标题，默认为空时不显示
        message: '', // 自定义弹框内容显示，默认不显示
        cueYes: '确认', // 确认按钮
        cueNo: '', // 取消按钮，默认为空，不显示
        pictype: null, // success、 fail或图片路径，默认不传，不显示icon
        yesBtn: function yesBtn() {}, // 点击cueYes后的回调函数
        noBtn: function noBtn() {}, // 点击cueNo后的回调函数
        closeBtn: null, // 默认无右上角关闭按钮，需要按钮时传function closeBtn() {}
        popupId: 'common-popup', // id
    };

    for (x in setting) {
        if (obj[x]) {
            setting[x] = obj[x];
        }
    }

    function popupDom() {
        var ln = $('head link').length,
            b = false,
            url = './popup/popup.css';
        for (var i = 0; i < ln; i++) {
            if ($('head link').eq(i).attr('href') == url) {
                b = true;
            }
        }
        if (!b) {
            $('head').append('<link type="text/css" rel="stylesheet" href="' + url + '" media="all" />');
        }

        var sHtml = '';
        sHtml = '<div class="pass-tc" id='+ setting['popupId'] +'>' +
            '<div class="pass-tc-bg"></div>' +
            '<div class="pass-tc-box">' +
            '<div class="pass-tc-pic"></div>' +
            '<div class="pass-tc-message">' + setting['message'] + '</div>' +
            '<div class="pass-tc-line"></div>';
        var style = "'width: 100%'";
        if (setting['cueNo']) { // 有取消按钮，则显示
            style = "'width: 50%'";
            sHtml += '<div class="pass-tc-no" style=' + style + '>' + setting['cueNo'] + '</div>';
        }
        sHtml += '<div class="pass-tc-yes" + style=' + style + '>' + setting['cueYes'] + '</div>' +
            '</div>' +
            '</div>';

        $('body').append(sHtml);

        //标题
        if (setting['title']) {
            $(".pass-tc-box").prepend('<div class="pass-tc-title">' + setting['title'] + '</div>');
        } else {
            $('pass-tc-title').remove();
        }
        //提示显示的图片
        if (setting['pictype']) {
            if (setting['pictype'] == 'fail') {
                $(".pass-tc-pic").addClass("fail");
            } else if (setting['pictype'] == 'success') {
                $(".pass-tc-pic").addClass('success');
			} else{ // 处理用户自定义样式
				$(".pass-tc-pic").addClass(setting['pictype']+'');
            }
        } else {
            $(".pass-tc-pic").hide();
        }
        //是否显示关闭按钮
        if (typeof setting['closeBtn'] === 'function') {
            $(".pass-tc-box").append('<span class="pass-close-btn"></span>');
            //关闭按钮事件
            $('.pass-close-btn').on('click', function() {
                if (setting.closeBtn) {
                    setting.closeBtn();
                }
                $('.pass-tc').remove();
            });
        } else {
            $('.pass-close-btn').remove();
        }

        if (setting['cueNo']) {
            //取消按钮事件
            $('.pass-tc-no').on('click', function() {
                $('.pass-tc').remove();
                if (setting.noBtn) {
                    setting.noBtn();
                }
            });
        }

        //确定按钮事件
        $('.pass-tc-yes').on('click', function() {
            $('.pass-tc').remove();
            if (setting.yesBtn) {
                setting.yesBtn();
            }
        });

    };
    popupDom();
};

//有添加自选按钮的弹窗
var popupAlertAddZixuan = function popupAlert(obj) {
    // 弹框的默认设置
    var setting = {
        title: '', // 标题，默认为空时不显示
        message: '', // 自定义弹框内容显示，默认不显示
        cueYes: '确认', // 确认按钮
        cueNo: '', // 取消按钮，默认为空，不显示
        pictype: null, // success、 fail或图片路径，默认不传，不显示icon
        yesBtn: function yesBtn() {}, // 点击cueYes后的回调函数
        noBtn: function noBtn() {}, // 点击cueNo后的回调函数
        closeBtn: null, // 默认无右上角关闭按钮，需要按钮时传function closeBtn() {}
        popupId: 'common-popup', // id
    };

    for (x in setting) {
        if (obj[x]) {
            setting[x] = obj[x];
        }
    }

    function popupDom() {
        var ln = $('head link').length,
            b = false,
            url = '/common/components/popup/popup.css';
        for (var i = 0; i < ln; i++) {
            if ($('head link').eq(i).attr('href') == url) {
                b = true;
            }
        }
        if (!b) {
            $('head').append('<link type="text/css" rel="stylesheet" href="' + url + '" media="all" />');
        }

        var sHtml = '';
        sHtml = '<div class="pass-tc" id='+ setting['popupId'] +'>' +
            '<div class="pass-tc-bg"></div>' +
            '<div class="pass-tc-box">' +
            '<div class="pass-tc-pic"></div>' +
            '<div class="pass-tc-message">' + setting['message'] + '</div>' +
            '<div class="pass-tc-zx-content"><span class="xz-btn"></span><div class="pass-tc-group">购买后自动加入自选</div></div>' +
            '<div class="pass-tc-line"></div>';
        var style = "'width: 100%'";
        if (setting['cueNo']) { // 有取消按钮，则显示
            style = "'width: 50%'";
            sHtml += '<div class="pass-tc-no" style=' + style + '>' + setting['cueNo'] + '</div>';
        }
        sHtml += '<div class="pass-tc-yes" + style=' + style + '>' + setting['cueYes'] + '</div>' +
            '</div>' +
            '</div>';

        $('body').append(sHtml);

        T.readLocalMesg(['autoaddtomall'],function(oLocal){
            if (oLocal.AUTOADDTOMALL == "1" || !oLocal.AUTOADDTOMALL) {
                $('.pass-tc-zx-content .xz-btn').addClass("xz-btn-active");
            }else{
                //不做处理
            }
        });
        $('.pass-tc-zx-content .xz-btn').off().on("click",function () {
            if($(this).hasClass("xz-btn-active")){
                $(this).removeClass("xz-btn-active");
                T.reqsofttodo({ "autoaddtomall" : "0"}, function (result) {
                    console.log(result)
                });
            }else{
                $(this).addClass("xz-btn-active");
                T.reqsofttodo({ "autoaddtomall" : "1"}, function (result) {
                    console.log(result)
                });
            }
        });


        //标题
        if (setting['title']) {
            $(".pass-tc-box").prepend('<div class="pass-tc-title">' + setting['title'] + '</div>');
        } else {
            $('pass-tc-title').remove();
        }
        //提示显示的图片
        if (setting['pictype']) {
            if (setting['pictype'] == 'fail') {
                $(".pass-tc-pic").addClass("fail");
            } else if (setting['pictype'] == 'success') {
                $(".pass-tc-pic").addClass('success');
            } else{ // 处理用户自定义样式
                $(".pass-tc-pic").addClass(setting['pictype']+'');
            }
        } else {
            $(".pass-tc-pic").hide();
        }
        //是否显示关闭按钮
        if (typeof setting['closeBtn'] === 'function') {
            $(".pass-tc-box").append('<span class="pass-close-btn"></span>');
            //关闭按钮事件
            $('.pass-close-btn').on('click', function() {
                if (setting.closeBtn) {
                    setting.closeBtn();
                }
                $('.pass-tc').remove();
            });
        } else {
            $('.pass-close-btn').remove();
        }

        if (setting['cueNo']) {
            //取消按钮事件
            $('.pass-tc-no').on('click', function() {
                $('.pass-tc').remove();
                if (setting.noBtn) {
                    setting.noBtn();
                }
            });
        }

        //确定按钮事件
        $('.pass-tc-yes').on('click', function() {
            $('.pass-tc').remove();
            if (setting.yesBtn) {
                setting.yesBtn();
            }
        });

    };
    popupDom();
}
