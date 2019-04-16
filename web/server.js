const express = require("express");
const server = express();
const http = require("http");
const socket = require("socket.io");
const fs = require("fs");

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

  // socket.on("offer", data => {
  //   console.log(data);
  //   socket.broadcast.emit("theOffer", data);
  // });

  let userToCall;

  socket.on("requestStream", data => {
    console.log("users", electronUsers);
    electronUsers.forEach(user =>
      user.username === data.caller
        ? (userToCall = user.id)
        : console.log("nope")
    );

    // console.log("caller", data.caller);
    // console.log(userToCall);

    // if (data.caller == electronUsers.username) {
    //   console.log("SOCKET SEND TO", electronUsers.id);
    // } else {
    //   console.log("nothing");
    // }
    // console.log(idToCall);
    io.to(userToCall).emit("getStream", data.toCall);
    console.log(data.toCall);
    console.log("requestStream");

    // ss(socket).on("streamToServer", (stream, data) => {
    //   console.log(stream);
  });

  socket.on("mousemove", data => {
    io.to(userToCall).emit("mouseMove", data);
  });
});
