const socket = io();

function initialize() {
  socket.on("connect", () => {
    console.log("you connected to socket" + socket.id);
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

  socket.on("disconnect", () => {
    console.log("you disconnected");
  });
}
