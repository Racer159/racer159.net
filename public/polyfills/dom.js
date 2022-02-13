//  dom.js
//  2022-02-13
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

"use strict";

// Fixup document.getElementById on older browsers
if (!document.getElementById) {
  document.getElementById = function(id) {
    return document.all[id];
  }
}

// Handle IE attachEvent and W3C DOM addEventListener
function addEvent(evnt, elem, func) {
  if (elem.addEventListener) { // W3C DOM
    elem.addEventListener(evnt, func, false);
  } else if (elem.attachEvent) { // IE DOM
    elem.attachEvent("on" + evnt, func);
  } else {
    elem["on" + evnt] = func;
  }
}