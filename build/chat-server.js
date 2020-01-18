"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const socketIo = require("socket.io");
class ChatServer {
  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }
  createApp() {
    this.app = express();
  }
  createServer() {
    this.server = http_1.createServer(this.app);
  }
  config() {
    this.port = process.env.PORT || ChatServer.PORT;
  }
  sockets() {
    this.io = socketIo(this.server, { transports: ["websocket"] });
  }
  listen() {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
    this.io.on("connect", socket => {
      console.log("Connected client on port %s.", this.port);
      socket.on("message", message => {
        console.log("[server](message): %s", JSON.stringify(message));
        this.io.emit("message", message);
      });
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
  getApp() {
    return this.app;
  }
}
exports.ChatServer = ChatServer;
ChatServer.PORT = 8080;
