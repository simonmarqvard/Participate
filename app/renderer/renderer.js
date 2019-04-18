const socket = require("socket.io-client")("http://smj470.itp.io:8082");
const robot = require("robotjs");
const { dialog } = require("electron").remote;
const username = require("username");
const { desktopCapturer } = require("electron");

let peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });
let peer_id = null;

console.log("Simon renderer");

socket.on("connect", () => {
  console.log("connected through node socket" + socket.id);
  username().then(name => {
    socket.emit("electronUserOnline", name);
  });
});

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

socket.on("electronUserOffline", () => {
  console.log("electronUserOffline");
});

socket.on("getStream", id => {
  console.log("asking for stream");
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

function handleStream(stream, id) {
  // const video = document.querySelector("video");
  // video.srcObject = stream;
  // video.onloadedmetadata = e => video.play();
  console.log("Calling peer: " + id);
  var call = peer.call(`${id}`, stream);
  call.on("stream", function(remoteStream) {});
}

socket.on("mouseMove", data => {
  console.log(data);
  // robot.moveMouse(data, data);
});

socket.on("disconnect", () => {
  socket.emit("electronUserOffline");
  console.log("you disconnected");
});
