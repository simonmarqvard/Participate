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

// We'll use a global variable to hold on to our id from PeerJS
var peer_id = null;

// Register for an API Key:	http://peerjs.com/peerserver
//var peer = new Peer({key: 'YOUR API KEY'});
// The Peer Cloud Server doesn't seem to be operational, I setup a server on a Digital Ocean instance for our use, you can use that with the following constructor:
var peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });

// Get an ID from the PeerJS server
peer.on("open", function(id) {
  console.log("My peer ID is: " + id);
  peer_id = id;
});

peer.on("error", function(err) {
  console.log(err);
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

socket.on("getStream", id => {
  console.log(id);
  desktopCapturer.getSources(
    { types: ["window", "screen"] },
    (error, sources) => {
      if (error) throw error;
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop"
            }
          }
        })
        .then(stream => handleStream(stream, id))
        .catch(e => handleError(e));
      return;
    }
  );
});
//add script tag
function handleStream(stream, id) {
  // const video = document.querySelector("video");
  // video.srcObject = stream;
  // video.onloadedmetadata = e => video.play();

  console.log("Calling peer: " + id);
  var call = peer.call(`${id}`, stream);

  call.on("stream", function(remoteStream) {});
}

function handleError(e) {
  console.log(e);
}

socket.on("disconnect", () => {
  socket.emit("electronUserOffline");
  console.log("you disconnected");
});
