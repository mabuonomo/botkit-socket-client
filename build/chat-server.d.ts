import * as express from "express";
export declare class ChatServer {
  static readonly PORT: number;
  private app;
  private server;
  private io;
  private port;
  constructor();
  private createApp;
  private createServer;
  private config;
  private sockets;
  private listen;
  getApp(): express.Application;
}
