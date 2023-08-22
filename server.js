import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./src/Action.js"
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const userSocketMap = {}; //{'asdfrthjjkl' : snehal} => map the socket id to that user


// app.use(express.static('dist'));

app.use((res,req,next)=>{
  res.sendFile(path.join(__dirname,'dist','index.html'))
})

const getAllConnectedClient = (roomId) => {
  const connectedClientsSet = io.sockets.adapter.rooms.get(roomId); // Get the Set of connected clients in the room
  const connectedClientsArray = Array.from(connectedClientsSet || []); // Convert the Set to an array

  // Map the array to an array of objects containing socketId and username
  return connectedClientsArray.map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId], // Assuming userSocketMap is a mapping of socketId to username
    };
  });
};

io.on('connection', (socket) => {
  console.log("socket:", socket.id);

  //method emited from editorpage , we should get here

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;

    socket.join(roomId);

    const clients = getAllConnectedClient(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
    console.log(clients);
  });

  // listening to action.code_change

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE , ({code , socketId}) =>{
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  })

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];

    socket.leave();
  });
});

const PORT = process.env.PORT_SER || 5000;

server.listen(PORT, () => console.log(`Listening to port ${PORT}`));
