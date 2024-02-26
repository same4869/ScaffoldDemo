"use strict";

/**
 * Created by zztzt on 2016/10/20.
 */
var home_new = [];
$(function () {
  init();
});

function init() {
  loadData();
  pageEvent();
}

function loadData() {
  var readmap = ['C_NAME'];
  T.readMapMesg(readmap, function (oData) {
    var oContent = JSON.parse(oData.C_NAME);
    console.log(oContent.Namearr);
    $(".home_new_main .home_new_list").each(function (index, element) {
      var className = $(this).find("i").attr("class");

      if ($.inArray(className, oContent.Namearr) > -1) {
        $(this).find(".home_new_g").addClass("home_new_gs");
      }
    });
  });
}

function pageEvent() {
  $(".home_new_main").delegate('li', "click", function () {
    if ($(this).find(".home_new_g").hasClass("home_new_gs")) {
      $(this).find(".home_new_g").removeClass("home_new_gs");
    } else {
      $(this).find(".home_new_g").addClass("home_new_gs");
    }
  });
  $(".buttons").on("click", function () {
    var action = 'home_new.txt';
    var parameters = {};
    $(".home_new_main .home_new_list").each(function (index, element) {
      var className = $(this).find("i").attr("class");
      var classtext = $(this).find("p").text();

      if ($(this).find(".home_new_g").hasClass("home_new_gs")) {
        parameters[className] = classtext;
      }
    });
    console.log(parameters);
    T.saveFileMesg(JSON.stringify(parameters), action, function (oData) {
      T.readFileMesg(action, function (oData) {
        var objex = JSON.parse(decodeURIComponent(oData));
        console.log(objex);
        T.fn.action10002();
      });
    });
  });
}