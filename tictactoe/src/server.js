import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const PORT = 4000;
const server = http.createServer(app);

app.use(express.static("public"));
app.use(cors({ origin: "*"}));

let games = {};
let queueGames = {};
let closedGames = [];
let playAgain = {}

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const numberOfClient = async (room) => {
  const sockets = await io.in(room).fetchSockets()
  return sockets.length === 0;
}

let users = 0;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on("connection", (socket) => {
  io.to(socket.id).emit("setId");
  users++;

    socket.on("find", (data) => {
      if(closedGames.includes(data.room)){
        io.to(socket.id).emit("closed");
      }

      if(!data.random && data.name && data.room && !closedGames.includes(data.room)){ //create the private room
        console.log(data.room);
        socket.join(data.room);
        if(!games[data.room]){
          const player1 = {
            id: socket.id,
            name: data.name,
            symbol: Math.random() < 0.5 ? "X" : "O",
            isTurn: Math.random() < 0.5,
            room: data.room
          }
          games[data.room] = {
            player1
          };
      } else { //join the private room
        socket.join(data.room);
        const player2 = {
          id: socket.id,
          name: data.name,
          symbol: games[data.room].player1.symbol === "X" ? "O" : "X",
          isTurn: !games[data.room].player1.isTurn,
          room: data.room
        }
        games[data.room].player2 = player2;
        io.to(data.room).emit("find",{players: games[data.room]});
        closedGames.push(data.room);
        delete games[data.room];
      }
    } else if(Object.keys(queueGames)[0] && data.random){ //join an open room
        let key = Object.keys(queueGames)[0];
        let room = queueGames[key];
        delete queueGames[key];
        socket.join(room);
        const player2 = {
          id: socket.id,
          name: data.name,
          symbol: games[room].player1.symbol === "X" ? "O" : "X",
          isTurn: !games[room].player1.isTurn,
          room: room
        }
        games[room].player2 = player2;
        io.to(room).emit("find",{players: games[room]});
        delete games[room];
        closedGames.push(room);
      }
      else if(data.name && data.room && data.random){ //create the open room
        let room = data.room;
        socket.join(data.room);
        if(!games[room]){
          const player1 = {
            id: socket.id,
            name: data.name,
            symbol: Math.random() < 0.5 ? "X" : "O",
            isTurn: Math.random() < 0.5,
            room: room
          }
          games[room] = {
            player1
          };
          queueGames[socket.id] = room;
        }
      }
    });

    socket.on("again", (data) => {
        if(!playAgain[data.room]){
          playAgain[data.room] = 1;
          io.to(data.room).emit("again", {amount: playAgain[data.room]});
        } else {
          playAgain[data.room] = 2;
          io.to(data.room).emit("again", {amount: playAgain[data.room]});
          delete playAgain[data.room];
        }
      });

    socket.on("leave-queue", (data) => {
      console.log("Left queue");
      delete queueGames[socket.id];
      delete games[data.room];
      socket.leave(data.room);
    });

    socket.on("exit-room", async (data)  => {
      socket.leave(data.room);
      socket.to(data.room).emit("opponent-left");
      if(await numberOfClient(data.room)){
        let index = closedGames.indexOf(data.room);
        if(index > -1){
          closedGames.splice(index, 1);
        }
      }
    });

    socket.on("time-end", (data) => {
      io.to(data.room).emit("time-end");
    });

    socket.on("play", (e) => {

      const matrix = e.matrix;
      let row = e.row;
      let col = e.col;
      matrix[row][col] = e.symbol;

      let result = checkWinner(matrix);

      if(result === "NF"){
        io.to(e.room).emit("play", {matrix: matrix, result: "nf"});
      } 

      else if(result === "X" || result === "O"){
        io.to(e.room).emit("play", {matrix: matrix, result: matrix[row][col]});
      }

      else if(result === "T") {
        io.to(e.room).emit("play", {matrix: matrix, result: "tie"});
      }

    });

    socket.on("getUsers", () =>{
      io.emit("users", { users });
    });

    socket.on("disconnect", () => {
      users--;
      openEmptyClosedGames();
      delete queueGames[socket.id];
      io.emit("users", { users });
    });
  });

  function checkWinner(matrix) {
    let isComplete = true;
  
    // Check for empty spots
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (matrix[i][j] == null) isComplete = false;
      }
    }
  
    // Check horizontal wins
    if (matrix[0][0] != null && matrix[0][0] == matrix[0][1] && matrix[0][1] == matrix[0][2]) return matrix[0][0];
    if (matrix[1][0] != null && matrix[1][0] == matrix[1][1] && matrix[1][1] == matrix[1][2]) return matrix[1][0];
    if (matrix[2][0] != null && matrix[2][0] == matrix[2][1] && matrix[2][1] == matrix[2][2]) return matrix[2][0];
  
    // Check vertical wins
    if (matrix[0][0] != null && matrix[0][0] == matrix[1][0] && matrix[1][0] == matrix[2][0]) return matrix[0][0];
    if (matrix[0][1] != null && matrix[0][1] == matrix[1][1] && matrix[1][1] == matrix[2][1]) return matrix[0][1];
    if (matrix[0][2] != null && matrix[0][2] == matrix[1][2] && matrix[1][2] == matrix[2][2]) return matrix[0][2];
  
    // Check diagonal wins
    if (matrix[0][0] != null && matrix[0][0] == matrix[1][1] && matrix[1][1] == matrix[2][2]) return matrix[0][0];
    if (matrix[0][2] != null && matrix[0][2] == matrix[1][1] && matrix[1][1] == matrix[2][0]) return matrix[0][2];
  
    if (!isComplete) return "NF";
  
    return "T"; // Tie
  }

  async function openEmptyClosedGames() {
    for (let i = closedGames.length - 1; i >= 0; i--) {
      if (await numberOfClient(closedGames[i])) {
        closedGames.splice(i, 1);
      }
    }
  }
  



  