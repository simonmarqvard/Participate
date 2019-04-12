const socket = io();
let peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });
let peer_id = null;

function initialize() {
  socket.on("connect", () => {
    console.log("you connected to socket" + socket.id);
  });

  peer.on("open", id => {
    console.log("My peer ID is: " + id);
    peer_id = id;
  });

  socket.on("electronUsersOnline", users => {
    let availableComputers = document.getElementById("computerContainer");
    availableComputers.innerHTML = "";
    let allusers = "";

    users.forEach(user => {
      let computer = `<button class="electronUser" data-id="${user.id}">
      ${user.username}</button>`;
      allusers += computer;
    });
    console.log(users);
    availableComputers.innerHTML = allusers;
  });

  let stream = document.getElementById("simon");
  stream.addEventListener("click", () => {
    socket.emit("requestStream", peer_id);
    console.log("requestStream");
  });

  peer.on("call", incoming_call => {
    console.log("Got a call!");
    console.log('Im simon')
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(function({}}) {
        incoming_call.answer(null); // this was originally "stream" Answer the call with our stream from getUserMedia
        incoming_call.on("stream", function(remoteStream) {
          // we receive a getUserMedia stream from the remote caller
          // And attach it to a video object
          var ovideoElement = document.getElementById("othervideo");
          ovideoElement.srcObject = remoteStream;

          ovideoElement.setAttribute("autoplay", "true");
          ovideoElement.play();
        });
      })
      .catch(function(err) {
        /* Handle the error */
        alert(err);
      });
  });

  socket.on("disconnect", () => {
    console.log("you disconnected");
  });

  peer.on("error", err => {
    console.log(err);
  });
}
