"use strict";

function setHeight() {
  var obj = {};
  obj.contentheight = Number($(".main").height());
  var jsonobj = JSON.stringify(obj);
  T.readLocalMesg(["tztwkwebview"], function (data) {
    if (data.TZTWKWEBVIEW == 1) {
      window.webkit.messageHandlers.setContentParams.postMessage({
        func: "reqwebcontentparam",
        //回调函数名
        data: jsonobj //数据

      });
    } else {
      window.MyWebView.setContentParams("reqwebcontentparam", jsonobj);
    }

    ;
  });
}