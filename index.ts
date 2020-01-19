/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// var converter = new showdown.Converter();
// converter.setOption("openLinksInNewWindow", true);
const WebSocketWS = require("ws");

var Botkit = {
  config: {
    ws_url: "ws://localhost:3000",
    reconnect_timeout: 3000,
    max_reconnect: 5,
    enable_history: false
  },
  options: {
    use_sockets: true
  },
  reconnect_count: 0,
  guid: null,
  current_user: null,
  on: function(event, handler) {
    // this.message_window.addEventListener(event, function(evt) {
    //   handler(message_wevt.detail);
    // });
  },
  request: function(url, body) {
    var that = this;
    return new Promise(function(resolve, reject) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          if (xmlhttp.status == 200) {
            var response = xmlhttp.responseText;
            if (response != "") {
              var message = null;
              try {
                message = JSON.parse(response);
              } catch (err) {
                reject(err);
                return;
              }
              resolve(message);
            } else {
              resolve([]);
            }
          } else {
            reject(new Error("status_" + xmlhttp.status));
          }
        }
      };

      xmlhttp.open("POST", url, true);
      xmlhttp.setRequestHeader("Content-Type", "application/json");
      xmlhttp.send(JSON.stringify(body));
    });
  },
  send: function(text, e) {
    var that = this;

    that.deliverMessage({
      type: "message",
      text: text,
      user: this.guid,
      channel: this.options.use_sockets ? "websocket" : "webhook"
    });

    return false;
  },
  deliverMessage: function(message) {
    if (this.options.use_sockets) {
      console.log(message);
      this.socket.send(JSON.stringify(message));
    } else {
      this.webhook(message);
    }
  },
  getHistory: function(guid) {
    var that = this;
    if (that.guid) {
      that
        .request("/botkit/history", {
          user: that.guid
        })
        .then(function(history) {
          if (history.success) {
          } else {
          }
        })
        .catch(function(err) {});
    }
  },
  webhook: function(message) {
    var that = this;

    that
      .request("/api/messages", message)
      .then(function(messages) {
        messages.forEach(message => {});
      })
      .catch(function(err) {});
  },
  connect: function(user_guid) {
    var that = this;
    console.log("here");

    this.guid = that.generate_guid();

    // connect to the chat server!
    if (that.options.use_sockets) {
      that.connectWebsocket(that.config.ws_url);
    } else {
      that.connectWebhook();
    }
  },
  connectWebhook: function() {
    var that = this;
    var connectEvent = "hello";

    // if (Botkit.getCookie("botkit_guid")) {
    //   that.guid = Botkit.getCookie("botkit_guid");
    //   connectEvent = "welcome_back";
    // } else {
    //   that.guid = that.generate_guid();
    //   Botkit.setCookie("botkit_guid", that.guid, 1);
    // }

    if (this.options.enable_history) {
      that.getHistory();
    }

    // connect immediately
    that.webhook({
      type: connectEvent,
      user: that.guid,
      channel: "webhook"
    });
  },
  connectWebsocket: function(ws_url) {
    var that = this;
    // Create WebSocket connection.
    that.socket = new WebSocketWS(ws_url);

    console.log(ws_url);

    var connectEvent = "hello";
    // if (Botkit.getCookie("botkit_guid")) {
    //   that.guid = Botkit.getCookie("botkit_guid");
    //   connectEvent = "welcome_back";
    // } else {
    //   that.guid = that.generate_guid();
    //   Botkit.setCookie("botkit_guid", that.guid, 1);
    // }

    if (this.options.enable_history) {
      that.getHistory();
    }

    // Connection opened
    that.socket.addEventListener("open", function(event) {
      console.log("CONNECTED TO SOCKET");

      Botkit.send("prova", null);

      that.reconnect_count = 0;
      that.deliverMessage({
        type: connectEvent,
        user: that.guid,
        channel: "socket",
        user_profile: that.current_user ? that.current_user : null
      });
    });

    that.socket.addEventListener("error", function(event) {
      console.error("ERROR", event);
    });

    that.socket.addEventListener("close", function(event) {
      console.log("SOCKET CLOSED!");
      if (that.reconnect_count < that.config.max_reconnect) {
        setTimeout(function() {
          console.log("RECONNECTING ATTEMPT ", ++that.reconnect_count);
          that.connectWebsocket(that.config.ws_url);
        }, that.config.reconnect_timeout);
      } else {
        that.message_window.className = "offline";
      }
    });

    // Listen for messages
    that.socket.addEventListener("message", function(event) {
      var message = null;
      try {
        console.log("Response: ", event.data);
        message = JSON.parse(event.data);
      } catch (err) {
        return;
      }
    });
  },
  quickReply: function(payload) {
    this.send(payload);
  },
  triggerScript: function(script, thread) {
    this.deliverMessage({
      type: "trigger",
      user: this.guid,
      channel: "socket",
      script: script,
      thread: thread
    });
  },
  identifyUser: function(user) {
    user.timezone_offset = new Date().getTimezoneOffset();

    this.guid = user.id;
    // Botkit.setCookie("botkit_guid", user.id, 1);

    this.current_user = user;

    this.deliverMessage({
      type: "identify",
      user: this.guid,
      channel: "socket",
      user_profile: user
    });
  },
  receiveCommand: function(event) {
    switch (event.data.name) {
      case "trigger":
        // tell Botkit to trigger a specific script/thread
        console.log("TRIGGER", event.data.script, event.data.thread);
        Botkit.triggerScript(event.data.script, event.data.thread);
        break;
      case "identify":
        // link this account info to this user
        console.log("IDENTIFY", event.data.user);
        Botkit.identifyUser(event.data.user);
        break;
      case "connect":
        // link this account info to this user
        Botkit.connect(event.data.user);
        break;
      default:
        console.log("UNKNOWN COMMAND", event.data);
    }
  },
  generate_guid: function() {
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
  },
  boot: function(user) {
    console.log("Booting up");
    var that = this;
    that.connect(user);
    return that;
  }
};

(function() {
  // your page initialization code here
  // the DOM will be available here
  Botkit.boot(null);
})();
