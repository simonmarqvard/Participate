const socket = io();
// let peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });
let peer = new Peer({ host: "smj470.itp.io", port: 9001, path: "/" });
let peer_id = null;
let peerConnection = null;
let pcScreen;

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
      }" data-id="${
        user.id
      }"> <img src="./image/monitor.png"><div class="ComputerUsername">
      ${user.username}</div></button></a>`;
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
      // sendMouse();
    });
  });

  socket.on("disconnect", () => {
    console.log("you disconnected");
  });

  peer.on("error", err => {
    console.log(err);
  });

  pcScreen = document.getElementById("othervideo");
  pcScreen.addEventListener("click", openFullscreen);
}

function openFullscreen() {
  if (pcScreen.requestFullscreen) {
    pcScreen.requestFullscreen();
    document.getElementById("othervideo").style.cursor = "none";
  } else if (pcScreen.mozRequestFullScreen) {
    /* Firefox */
    pcScreen.mozRequestFullScreen();
    document.getElementById("othervideo").style.cursor = "none";
  } else if (pcScreen.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    pcScreen.webkitRequestFullscreen();
  } else if (pcScreen.msRequestFullscreen) {
    /* IE/Edge */
    pcScreen.msRequestFullscreen();
    document.getElementById("othervideo").style.cursor = "none";
  }
  sendMouse();
}

function endCall() {
  peerConnection.on("close", () => {
    console.log("closed MEDIA");
    document.removeEventListener("mousemove", sendSomeData);
    document.removeEventListener("click", sendClick);
    document.removeEventListener("keypress", sendKey);
  });
  // document.getElementById("othervideo").style.cursor = "pointer";
  peerConnection.close();
  peerConnection = null;
  console.log("peerConnection off");
  // sendMouse();
}

function sendMouse() {
  document.addEventListener("mousemove", sendSomeData);
  document.addEventListener("click", sendClick);
  document.addEventListener("keypress", sendKey);
}

function sendSomeData(e) {
  let position = {
    mouseX: e.x,
    mouseY: e.y
  };

  socket.emit("mousemove", position);

  // socket.emit("mousemove", position);
}

function sendClick() {
  socket.emit("mouseClick");
}

function sendKey(e) {
  console.log("SIMONSIMON", e);
  let arrayofLetters = [
    "Enter",
    " ",
    "-",
    "q",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "b",
    "v",
    "c",
    "x",
    "z"
  ];
  let key = e.key;
  arrayofLetters.forEach(element => {
    if (key == element) {
      socket.emit("keyboardEvent", key);
    }
  });
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
