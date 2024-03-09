const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");

const {addUser, getUser, removeUser, getUserinRoom} = require("./user");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`we have a new connection!!!`);
  socket.on("join", ({name, room}, callback) => {
    // console.log(name, room);
    const {user, error} = addUser({id: socket.id, name: name, room: room});
    // console.log(user);
    if (error) {
      //   console.log(error);
      return callback(error);
    }

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", {user: "admin", text: `${user.name} joined`});

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserinRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log(user, "hi");

    io.to(user.room).emit("message", {user: user.name, text: message});
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserinRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User has left!!!!");
    const user = removeUser(socket.id);

    io.to(user.room).emit("message", {
      user: "Admin",
      text: `${user.name} has left.`,
    });
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
