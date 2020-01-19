"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws = require("ws");
const utils_1 = require("./utils");
class BotKitClient {
    constructor(config) {
        this.config = config;
        this.connectWebsocket();
    }
    getGuid() {
        if (!this.config.userGuid) {
            this.config.userGuid = utils_1.generateGuid();
        }
        return this.config.userGuid;
    }
    send(text) {
        this.deliverMessage({
            type: utils_1.ConnectEvent.MESSAGE,
            text: text,
            user: this.getGuid(),
            channel: "websocket"
        });
        return false;
    }
    deliverMessage(message) {
        console.log(message);
        this.socket.send(JSON.stringify(message));
    }
    connectWebsocket() {
        this.socket = new ws(this.config.ws_url);
        this.socket.addEventListener(utils_1.ListenerEvent.OPEN, function (event) {
            console.log("CONNECTED TO SOCKET");
            this.deliverMessage({
                type: this.config.userGuid === undefined
                    ? utils_1.ConnectEvent.HELLO
                    : utils_1.ConnectEvent.WELCOME_BACK,
                user: this.getGuid(),
                channel: "socket"
            });
        });
        this.socket.addEventListener(utils_1.ListenerEvent.ERROR, event => {
            console.error("ERROR", event);
        });
        this.socket.addEventListener(utils_1.ListenerEvent.CLOSE, event => {
            console.log("SOCKET CLOSED!");
        });
        this.socket.addEventListener(utils_1.ListenerEvent.MESSAGE, event => {
            var message = null;
            try {
                console.log("Response: ", event.data);
                message = JSON.parse(event.data);
            }
            catch (err) {
                return;
            }
        });
    }
}
exports.default = BotKitClient;
