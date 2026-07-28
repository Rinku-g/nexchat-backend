import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connetDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./sockets/socket.js";


connetDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

initializeSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
