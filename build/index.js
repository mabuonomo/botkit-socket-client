const WebSocket = require('ws');
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
    trigger: function (event, details) {
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
        if (e)
            e.preventDefault();
        if (!text) {
            return;
        }
        var message = {
            type: "outgoing",
            text: text
        };
        that.deliverMessage({
            type: "message",
            text: text,
            user: this.guid,
            channel: this.options.use_sockets ? "websocket" : "webhook"
        });
        this.trigger("sent", message);
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
                    that.trigger("history_loaded", history.history);
                }
                else {
                    that.trigger("history_error", new Error(history.error));
                }
            })
                .catch(function (err) {
                that.trigger("history_error", err);
            });
        }
    },
    webhook: function (message) {
        var that = this;
        that
            .request("/api/messages", message)
            .then(function (messages) {
            messages.forEach(message => {
                that.trigger(message.type, message);
            });
        })
            .catch(function (err) {
            that.trigger("webhook_error", err);
        });
    },
    connect: function (user) {
        var that = this;
        console.log("here");
        if (user && user.id) {
            Botkit.setCookie("botkit_guid", user.id, 1);
            user.timezone_offset = new Date().getTimezoneOffset();
            that.current_user = user;
            console.log("CONNECT WITH USER", user);
        }
        if (that.options.use_sockets) {
            that.connectWebsocket(that.config.ws_url);
        }
        else {
            that.connectWebhook();
        }
    },
    connectWebhook: function () {
        var that = this;
        let connectEvent;
        if (Botkit.getCookie("botkit_guid")) {
            that.guid = Botkit.getCookie("botkit_guid");
            connectEvent = "welcome_back";
        }
        else {
            that.guid = that.generate_guid();
            Botkit.setCookie("botkit_guid", that.guid, 1);
        }
        if (this.options.enable_history) {
            that.getHistory();
        }
        that.trigger("connected", {});
        that.webhook({
            type: connectEvent,
            user: that.guid,
            channel: "webhook"
        });
    },
    connectWebsocket: function (ws_url) {
        var that = this;
        that.socket = new WebSocket(ws_url);
        console.log(ws_url);
        var connectEvent = "hello";
        if (Botkit.getCookie("botkit_guid")) {
            that.guid = Botkit.getCookie("botkit_guid");
            connectEvent = "welcome_back";
        }
        else {
            that.guid = that.generate_guid();
            Botkit.setCookie("botkit_guid", that.guid, 1);
        }
        if (this.options.enable_history) {
            that.getHistory();
        }
        that.socket.addEventListener("open", function (event) {
            console.log("CONNECTED TO SOCKET");
            Botkit.send("prova", null);
            that.reconnect_count = 0;
            that.trigger("connected", event);
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
            that.trigger("disconnected", event);
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
                that.trigger("socket_error", err);
                return;
            }
            that.trigger(message.type, message);
        });
    },
    clearReplies: function () {
        this.replies.innerHTML = "";
    },
    quickReply: function (payload) {
        this.send(payload);
    },
    focus: function () {
    },
    renderMessage: function (message) {
        var that = this;
        if (!that.next_line) {
            that.message_list.appendChild(that.next_line);
        }
        that.next_line.innerHTML = that.message_template({
            message: message
        });
        if (!message.isTyping) {
            delete that.next_line;
        }
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
        Botkit.setCookie("botkit_guid", user.id, 1);
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
    sendEvent: function (event) {
        if (this.parent_window) {
            this.parent_window.postMessage(event, "*");
        }
    },
    setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var decodedCookie = "";
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
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
        that.focus();
        that.on("connected", function () {
            that.message_window.className = "connected";
            that.input.disabled = false;
            that.sendEvent({
                name: "connected"
            });
        });
        that.on("disconnected", function () {
            that.message_window.className = "disconnected";
            that.input.disabled = true;
        });
        that.on("webhook_error", function (err) {
            alert("Error sending message!");
            console.error("Webhook Error", err);
        });
        that.on("typing", function () {
            that.clearReplies();
            that.renderMessage({
                isTyping: true
            });
        });
        that.on("sent", function () {
        });
        that.on("message", function (message) {
            console.log("RECEIVED MESSAGE", message);
            that.renderMessage(message);
        });
        that.on("message", function (message) {
            if (message.goto_link) {
                window.location = message.goto_link;
            }
        });
        that.on("message", function (message) {
            that.clearReplies();
            if (message.quick_replies) {
                var list = document.createElement("ul");
                var elements = [];
                for (var r = 0; r < message.quick_replies.length; r++) {
                    (function (reply) {
                        var li = document.createElement("li");
                        var el = document.createElement("a");
                        el.innerHTML = reply.title;
                        el.href = "#";
                        el.onclick = function () {
                            that.quickReply(reply.payload);
                        };
                        li.appendChild(el);
                        list.appendChild(li);
                        elements.push(li);
                    })(message.quick_replies[r]);
                }
                that.replies.appendChild(list);
                if (message.disable_input) {
                    that.input.disabled = true;
                }
                else {
                    that.input.disabled = false;
                }
            }
            else {
                that.input.disabled = false;
            }
        });
        that.on("history_loaded", function (history) {
            if (history) {
                for (var m = 0; m < history.length; m++) {
                    that.renderMessage({
                        text: history[m].text,
                        type: history[m].type == "message_received" ? "outgoing" : "incoming"
                    });
                }
            }
        });
        that.connect(user);
        return that;
    }
};
(function () {
    Botkit.boot(null);
})();
