const socket = require("socket.io-client")("http://localhost:8082");
const robot = require("robotjs");
const { dialog } = require("electron").remote;
const username = require("username");
const { desktopCapturer } = require("electron");

console.log("Simon renderer");

socket.on("connect", () => {
  console.log("connected through node socket" + socket.id);
  username().then(name => {
    socket.emit("electronUserOnline", name);
  });
});

socket.on("electronUserOnline", () => {
  console.log("electron Online");
});
//
// socket.on("userMousePosition", data => {
//   console.log(data);
//   robot.moveMouse(data.x, data.y);
// });
//
// socket.on("mouseclickpos", data => {
//   console.log("click", data);
//   // robot.moveMouse(data.x, data.y);
// });
socket.on("electronUserOffline", () => {
  console.log("electronUserOffline");
});

socket.on("disconnect", () => {
  socket.emit("electronUserOffline");
  console.log("you disconnected");
});
