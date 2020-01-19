"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
exports.generateGuid = generateGuid;
var ConnectEvent;
(function(ConnectEvent) {
  ConnectEvent["HELLO"] = "hello";
  ConnectEvent["WELCOME_BACK"] = "welcome_back";
  ConnectEvent["MESSAGE"] = "message";
})((ConnectEvent = exports.ConnectEvent || (exports.ConnectEvent = {})));
var ListenerEvent;
(function(ListenerEvent) {
  ListenerEvent["OPEN"] = "open";
  ListenerEvent["MESSAGE"] = "message";
  ListenerEvent["ERROR"] = "error";
  ListenerEvent["CLOSE"] = "close";
})((ListenerEvent = exports.ListenerEvent || (exports.ListenerEvent = {})));
