"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
console.log("start");
const socket = socket_io_client_1.default("ws://localhost:3000/", {
    transports: ["websocket"]
});
function generate_guid() {
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
}
let connectEvent = "hello";
let guid = generate_guid();
let channel = "websocket";
console.log(connectEvent, guid, channel);
socket.on("connection", socket => {
    console.log("connection");
});
socket.on("connected", function () {
    console.log("CONNECTED TO SOCKET");
});
socket.on("disconnected", function () {
    console.log("CONNECTED TO SOCKET");
});
socket.on("webhook_error", function (err) {
    alert("Error sending message!");
    console.error("Webhook Error", err);
});
console.log("send hello");
socket.send(JSON.stringify({
    type: connectEvent,
    user: guid,
    channel: channel,
    user_profile: null
}));
socket.send(JSON.stringify({
    type: "message",
    text: "ciao",
    user: channel,
    channel: "websocket"
}));
socket.addEventListener("open", function (event) {
    console.log("CONNECTED TO SOCKET");
    socket.send(JSON.stringify({
        type: connectEvent,
        user: guid,
        channel: "websocket",
        user_profile: null
    }));
});
socket.addEventListener("error", function (event) {
    console.error("ERROR", event);
});
socket.addEventListener("close", function (event) {
    console.log("SOCKET CLOSED!");
});
socket.addEventListener("message", function (event) {
    var message = null;
    try {
        message = JSON.parse(event.data);
        console.log(message);
    }
    catch (err) {
        console.log(err);
        return;
    }
});
console.log("here");
socket.on("message", function (message) {
    console.log("RECEIVED MESSAGE", message);
});
