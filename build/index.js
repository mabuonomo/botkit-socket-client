"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
console.log("start");
const socket = socket_io_client_1.default("http://localhost:3000", {
  transports: ["websocket"]
});
console.log("send hello");
socket.emit("message", { type: "hello", message: "" });
socket.on("news", function(data) {
  console.log(data);
  socket.emit("my other event", { my: "data" });
});
exports.default = socket_io_client_1.default;
