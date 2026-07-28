import jwt from "jsonwebtoken";

const onlineUsers = new Map();

export const initializeSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication Error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Invalid Token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User Connected : ${socket.userId} -> ${socket.id}`);

    onlineUsers.set(socket.userId, socket.id);

    io.emit("online-users", [...onlineUsers.keys()]);

    socket.on("disconnect", () => {
      console.log(`User Disconnected : ${socket.userId}`);

      onlineUsers.delete(socket.userId);
      io.emit("online-users", [...onlineUsers.keys()]);
    });
  });
};
