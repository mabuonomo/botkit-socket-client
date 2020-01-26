Botkit=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),r=function(){function e(e){this.config=e,this.connectWebsocket()}return e.prototype.getGuid=function(){return this.config.userGuid||(this.config.userGuid=o.generateGuid()),this.config.userGuid},e.prototype.getSocket=function(){return this.socket},e.prototype.send=function(e){return this.deliverMessage({type:o.ConnectEvent.MESSAGE,text:e,user:this.getGuid(),channel:"websocket"}),!1},e.prototype.deliverMessage=function(e){console.log(e),this.socket.send(JSON.stringify(e))},e.prototype.connectWebsocket=function(){this.socket=new WebSocket(this.config.ws_url);var e=this;this.socket.addEventListener(o.ListenerEvent.OPEN,(function(t){console.log("CONNECTED TO SOCKET"),e.deliverMessage({type:void 0===e.config.userGuid?o.ConnectEvent.HELLO:o.ConnectEvent.WELCOME_BACK,user:e.getGuid(),channel:"socket"})})),this.socket.addEventListener(o.ListenerEvent.ERROR,(function(e){console.error("ERROR",e)})),this.socket.addEventListener(o.ListenerEvent.CLOSE,(function(e){console.log("SOCKET CLOSED!")})),this.socket.addEventListener(o.ListenerEvent.MESSAGE,(function(e){try{console.log("Response: ",e.data),JSON.parse(e.data)}catch(e){return}}))},e}();t.BotKitClient=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.generateGuid=function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},function(e){e.HELLO="hello",e.WELCOME_BACK="welcome_back",e.MESSAGE="message"}(t.ConnectEvent||(t.ConnectEvent={})),function(e){e.OPEN="open",e.MESSAGE="message",e.ERROR="error",e.CLOSE="close"}(t.ListenerEvent||(t.ListenerEvent={}))}]);