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
    on: function (event, handler) {
    },
    request: function (url, body) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        var response = xmlhttp.responseText;
                        if (response != "") {
                            var message = null;
                            try {
                                message = JSON.parse(response);
                            }
                            catch (err) {
                                reject(err);
                                return;
                            }
                            resolve(message);
                        }
                        else {
                            resolve([]);
                        }
                    }
                    else {
                        reject(new Error("status_" + xmlhttp.status));
                    }
                }
            };
            xmlhttp.open("POST", url, true);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(body));
        });
    },
    send: function (text, e) {
        var that = this;
        that.deliverMessage({
            type: "message",
            text: text,
            user: this.guid,
            channel: this.options.use_sockets ? "websocket" : "webhook"
        });
        return false;
    },
    deliverMessage: function (message) {
        if (this.options.use_sockets) {
            console.log(message);
            this.socket.send(JSON.stringify(message));
        }
        else {
            this.webhook(message);
        }
    },
    getHistory: function (guid) {
        var that = this;
        if (that.guid) {
            that
                .request("/botkit/history", {
                user: that.guid
            })
                .then(function (history) {
                if (history.success) {
                }
                else {
                }
            })
                .catch(function (err) { });
        }
    },
    webhook: function (message) {
        var that = this;
        that
            .request("/api/messages", message)
            .then(function (messages) {
            messages.forEach(message => { });
        })
            .catch(function (err) { });
    },
    connect: function (user_guid) {
        var that = this;
        console.log("here");
        this.guid = that.generate_guid();
        if (that.options.use_sockets) {
            that.connectWebsocket(that.config.ws_url);
        }
        else {
            that.connectWebhook();
        }
    },
    connectWebhook: function () {
        var that = this;
        var connectEvent = "hello";
        if (this.options.enable_history) {
            that.getHistory();
        }
        that.webhook({
            type: connectEvent,
            user: that.guid,
            channel: "webhook"
        });
    },
    connectWebsocket: function (ws_url) {
        var that = this;
        that.socket = new WebSocketWS(ws_url);
        console.log(ws_url);
        var connectEvent = "hello";
        if (this.options.enable_history) {
            that.getHistory();
        }
        that.socket.addEventListener("open", function (event) {
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
        that.socket.addEventListener("error", function (event) {
            console.error("ERROR", event);
        });
        that.socket.addEventListener("close", function (event) {
            console.log("SOCKET CLOSED!");
            if (that.reconnect_count < that.config.max_reconnect) {
                setTimeout(function () {
                    console.log("RECONNECTING ATTEMPT ", ++that.reconnect_count);
                    that.connectWebsocket(that.config.ws_url);
                }, that.config.reconnect_timeout);
            }
            else {
                that.message_window.className = "offline";
            }
        });
        that.socket.addEventListener("message", function (event) {
            var message = null;
            try {
                console.log("Response: ", event.data);
                message = JSON.parse(event.data);
            }
            catch (err) {
                return;
            }
        });
    },
    quickReply: function (payload) {
        this.send(payload);
    },
    triggerScript: function (script, thread) {
        this.deliverMessage({
            type: "trigger",
            user: this.guid,
            channel: "socket",
            script: script,
            thread: thread
        });
    },
    identifyUser: function (user) {
        user.timezone_offset = new Date().getTimezoneOffset();
        this.guid = user.id;
        this.current_user = user;
        this.deliverMessage({
            type: "identify",
            user: this.guid,
            channel: "socket",
            user_profile: user
        });
    },
    receiveCommand: function (event) {
        switch (event.data.name) {
            case "trigger":
                console.log("TRIGGER", event.data.script, event.data.thread);
                Botkit.triggerScript(event.data.script, event.data.thread);
                break;
            case "identify":
                console.log("IDENTIFY", event.data.user);
                Botkit.identifyUser(event.data.user);
                break;
            case "connect":
                Botkit.connect(event.data.user);
                break;
            default:
                console.log("UNKNOWN COMMAND", event.data);
        }
    },
    generate_guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return (s4() +
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
            s4());
    },
    boot: function (user) {
        console.log("Booting up");
        var that = this;
        that.connect(user);
        return that;
    }
};
(function () {
    Botkit.boot(null);
})();
