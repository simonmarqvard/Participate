const express = require("express");
const server = express();
const http = require("http");
const socket = require("socket.io");

server.use("/", express.static("public"));

let httpServer = http.createServer(server);

var io = socket(httpServer);

let members = 0;

let electronUsers = [];

httpServer.listen(8082, () => {
  console.log("listening on 8082");
});

io.sockets.on("connection", socket => {
  console.log("we have a connection: " + socket.id);
  members++;
  console.log(members);
  socket.emit("electronUsersOnline", electronUsers);

  socket.on("electronUserOnline", username => {
    electronUsers.push({ username: username, id: socket.id });
    console.log(electronUsers);
    socket.broadcast.emit("electronUsersOnline", electronUsers);
  });

  socket.on("disconnect", user => {
    console.log("user disconnected");
    electronUsers = electronUsers.filter(user => user.id !== socket.id);
    socket.broadcast.emit("electronUsersOnline", electronUsers);
    members--;
    console.log(members);
  });
});
