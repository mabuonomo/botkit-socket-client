Botkit=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),r=n(2),i=function(){function e(e){this.config=e,this.connectWebsocket()}return e.prototype.getGuid=function(){return this.config.userGuid||(this.config.userGuid=r.generateGuid()),this.config.userGuid},e.prototype.send=function(e){return this.deliverMessage({type:r.ConnectEvent.MESSAGE,text:e,user:this.getGuid(),channel:"websocket"}),!1},e.prototype.deliverMessage=function(e){console.log(e),this.socket.send(JSON.stringify(e))},e.prototype.connectWebsocket=function(){this.socket=new o.default(this.config.ws_url),this.socket.addEventListener(r.ListenerEvent.OPEN,(function(e){console.log("CONNECTED TO SOCKET"),this.deliverMessage({type:void 0===this.config.userGuid?r.ConnectEvent.HELLO:r.ConnectEvent.WELCOME_BACK,user:this.getGuid(),channel:"socket"})})),this.socket.addEventListener(r.ListenerEvent.ERROR,(function(e){console.error("ERROR",e)})),this.socket.addEventListener(r.ListenerEvent.CLOSE,(function(e){console.log("SOCKET CLOSED!")})),this.socket.addEventListener(r.ListenerEvent.MESSAGE,(function(e){try{console.log("Response: ",e.data),JSON.parse(e.data)}catch(e){return}}))},e}();t.BotKitClient=i},function(e,t,n){"use strict";e.exports=function(){throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.generateGuid=function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},function(e){e.HELLO="hello",e.WELCOME_BACK="welcome_back",e.MESSAGE="message"}(t.ConnectEvent||(t.ConnectEvent={})),function(e){e.OPEN="open",e.MESSAGE="message",e.ERROR="error",e.CLOSE="close"}(t.ListenerEvent||(t.ListenerEvent={}))}]);