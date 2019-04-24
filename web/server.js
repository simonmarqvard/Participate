const express = require("express");
const server = express();
const http = require("http");
const socket = require("socket.io");
const fs = require("fs");

server.use("/", express.static("public"));

let httpServer = http.createServer(server);

var io = socket(httpServer);

let members = 0;

// let userInCall = [];
let electronUsers = [];

httpServer.listen(8082, () => {
  console.log("listening on 8082");
});

io.sockets.on("connection", socket => {
  console.log("we have a connection: " + socket.id);
  members++;
  console.log(members);
  socket.emit("electronUsersOnline", electronUsers);
  // if (userInCall) {
  //   socket.emit("userInACall", userInCall);
  // }
  socket.on("electronUserOnline", username => {
    electronUsers.push({ username: username, id: socket.id, call: false });
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

  // socket.on("busyUser", caller => {
  //   userInCall.push(caller);
  //   console.log(userInCall);
  //   io.emit("userInACall", userInCall);
  // });

  let userToCall;

  socket.on("requestStream", data => {
    // console.log("users", electronUsers);
    electronUsers.forEach(user => {
      user.username === data.caller
        ? (userToCall = user.id)
        : console.log("nope");
      if (user.username === data.caller) {
        user.call = true;
      }
    });
    io.emit("busyElectronUsers", electronUsers);
    io.to(userToCall).emit("getStream", data.toCall);
    console.log(data.toCall);

    // ss(socket).on("streamToServer", (stream, data) => {
    //   console.log(stream);
  });

  socket.on("userFree", data => {
    electronUsers.forEach(user => {
      if (user.username === data) {
        user.call = false;
      }
    });
    io.emit("busyElectronUsers", electronUsers);
  });

  socket.on("mousemove", data => {
    // console.log(userToCall);
    // console.log(data);
    io.to(userToCall).emit("mouseMove", data);
  });

  socket.on("mouseClick", () => {
    // console.log(userToCall);
    // console.log(data);
    io.to(userToCall).emit("mouseClick");
  });

  socket.on("keyboardEvent", key => {
    // console.log(userToCall);
    // console.log(data);
    console.log(key);
    io.to(userToCall).emit("keyPress", key);
  });
});
