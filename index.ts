import io from "socket.io-client";

console.log("start");
const socket = io("ws://localhost:3000/", {
  transports: ["websocket"]
});

function generate_guid() {
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
}

let connectEvent = "hello";
let guid = generate_guid();
let channel = "websocket";

console.log(connectEvent, guid, channel);

socket.on("connection", socket => {
  console.log("connection");
});

socket.on("connected", function() {
  console.log("CONNECTED TO SOCKET");
});

socket.on("disconnected", function() {
  console.log("CONNECTED TO SOCKET");
});

socket.on("webhook_error", function(err) {
  alert("Error sending message!");
  console.error("Webhook Error", err);
});

// message = {
//   type: "outgoing",
//   text: text
// };

console.log("send hello");
// socket.emit("hello", { type: "hello", text: "hello" });
// socket.emit("message", { type: "hello", text: "hello" });

socket.send(
  JSON.stringify({
    type: connectEvent,
    user: guid,
    channel: channel,
    user_profile: null
  })
);

socket.send(
  JSON.stringify({
    type: "message",
    text: "ciao",
    user: channel,
    channel: "websocket"
  })
);

socket.addEventListener("open", function(event) {
  console.log("CONNECTED TO SOCKET");
  // socket.reconnect_count = 0;
  // socket.trigger("connected", event);
  socket.send(
    JSON.stringify({
      type: connectEvent,
      user: guid,
      channel: "websocket", //"socket",
      user_profile: null
    })
  );
});

socket.addEventListener("error", function(event) {
  console.error("ERROR", event);
});

socket.addEventListener("close", function(event) {
  console.log("SOCKET CLOSED!");
  // socket.trigger("disconnected", event);
  // if (socket.reconnect_count < socket.config.max_reconnect) {
  //   setTimeout(function() {
  //     console.log("RECONNECTING ATTEMPT ", ++socket.reconnect_count);
  //     socket.connectWebsocket(socket.config.ws_url);
  //   }, socket.config.reconnect_timeout);
  // } else {
  //   socket.message_window.className = "offline";
  // }
});

// Listen for messages
socket.addEventListener("message", function(event) {
  var message = null;
  try {
    message = JSON.parse(event.data);
    console.log(message);
  } catch (err) {
    console.log(err);
    // socket.trigger("socket_error", err);
    return;
  }
});

console.log("here");
socket.on("message", function(message) {
  console.log("RECEIVED MESSAGE", message);
});

// socket.on("message", function (data) {
//   console.log(data);
//   socket.emit("my other event", { my: "data" });
// });
