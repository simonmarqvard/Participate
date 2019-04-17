const socket = io();
// let peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });
let peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });
let peer_id = null;
let peerConnection = null;

function initialize() {
  socket.on("connect", () => {
    console.log("you connected to socket" + socket.id);
  });

  socket.on("electronUsersOnline", users => {
    let availableComputers = document.getElementById("computerContainer");
    availableComputers.innerHTML = "";
    let allusers = "";

    peer.on("open", id => {
      console.log("My peer ID is: " + id);
      peer_id = id;
    });

    users.forEach(user => {
      let computer = `<a href="#wrapper2"><button class="electronUser" data-username="${
        user.username
      }" data-id="${user.id}">
      ${user.username}</button></a>`;
      allusers += computer;
    });
    console.log(users);
    availableComputers.innerHTML = allusers;

    userButton = document.querySelectorAll(".electronUser");
    console.log(userButton);
    userButton.forEach(user => user.addEventListener("click", createStream));
  });

  function createStream(e) {
    let caller = e.target.getAttribute("data-username");
    socket.emit("requestStream", { toCall: peer_id, caller: caller });
    console.log("requestStream");
  }

  peer.on("call", incoming_call => {
    peerConnection = incoming_call;
    console.log("peerConnection on");
    incoming_call.answer();
    incoming_call.on("stream", function(remoteStream) {
      // we receive a getUserMedia stream from the remote caller
      // And attach it to a video object
      var ovideoElement = document.getElementById("othervideo");
      ovideoElement.srcObject = remoteStream;
      ovideoElement.setAttribute("autoplay", "true");
      ovideoElement.play();
      let hangup = document.getElementById("EndCallScrollUp");
      hangup.addEventListener("click", endCall);
      sendMouse();
    });
  });

  socket.on("disconnect", () => {
    console.log("you disconnected");
  });

  peer.on("error", err => {
    console.log(err);
  });
}

function endCall() {
  peerConnection.on("close", () => {
    console.log("closed MEDIA");
    document.removeEventListener("mousemove", sendSomeData);
  });
  peerConnection.close();
  peerConnection = null;
  console.log("peerConnection off");
  // sendMouse();
}

function sendMouse() {
  let x = document.addEventListener("mousemove", sendSomeData);
}

function sendSomeData(e) {
  let position = e.x;
  socket.emit("mousemove", position);

  // socket.emit("mousemove", position);
}

//   => {
//     let position = e.x;
//     socket.emit("mousemove", position);
//   });
// }

// if (peerConnection) {
//   console.log("peerConnection on");
//   socket.emit("mousemove", position);
// } else {
//   console.log("peerconnection off");
//   //this should destroy connection
//   socket.emit("nothing");
// }
// });
// }

// function sendMouseData() {
//   if (peerConnection) {
//     console.log("Peer now on");
//     sendMouse();
//   } else if (peerConnection === null) {
//     console.log("Peer now off");
//   }
// }
