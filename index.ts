import io from "socket.io-client";

console.log("start");
const socket = io("http://localhost:3000", {
  transports: ["websocket"]
});

// import { ChatServer } from "./chat-server";
// let app = new ChatServer().getApp();
// export { app };

console.log("send hello");
socket.emit("message", { type: "hello", message: "" });

socket.on("news", function(data) {
  console.log(data);
  socket.emit("my other event", { my: "data" });
});

export default io;
