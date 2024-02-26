"use strict";

function mm() {
  //这是网上的一张图片链接
  var url = "https://tech.sina.cn/2018-03-29/detail-ifysstsp2430475.d.html?from=wap";
  getBase64(url).then(function (base64) {
    console.log(base64); //处理成功打印在控制台
  }, function (err) {
    console.log(err); //打印异常信息
  });
} //传入图片路径，返回base64


function getBase64(img) {
  function getBase64Image(img, width, height) {
    //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
  }

  var image = new Image();
  image.crossOrigin = '';
  image.src = img;
  var deferred = $.Deferred();

  if (img) {
    image.onload = function () {
      deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
    };

    return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
  }
}
/*处理缓存数据*/


function _getBanner(data, fn) {
  //console.log(oData);
  var oData = data; //jkpostcount++;

  if (oData.GRID0) {
    //saveDataFile('tggszb',oData);
    var ln = oData.GRID0.length,
        sHtml = '';

    if (ln > 1) {
      for (var i = 1; i < ln; i++) {
        var oItem = oData.GRID0[i].split('|');
        sHtml += "<div class=\"swiper-slide\" data-url=\"".concat(oItem[oData.IMAGE_CLICK_INDEX], "\"><img class=\"image\" src=\"").concat(oItem[oData.IMAGE_URL_INDEX], "\"></div>");
      }

      $('.banner .swiper-wrapper').html(sHtml);
    } else {
      sHtml += "<div class=\"swiper-slide\"><img class=\"image\" src=\"/home_new/images/banner.png\"></div>";
      $('.banner .swiper-wrapper').html(sHtml);
    }

    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      autoplay: 3000
    });
  }

  fn && fn();
}

function saveDataFile(type, data) {
  ocdata[type] = JSON.stringify(data);
  T.saveFileMesg(encodeURIComponent(JSON.stringify(ocdata)), 'SYDATA', function (data) {});
}