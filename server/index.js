const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map(); // socket.id -> user details

io.on("connection", (socket) => {
  socket.on("userConnected", (user) => {
    if (user && user._id) {
      onlineUsers.set(socket.id, { id: user._id, name: user.name, email: user.email });
      // Send unique online users (by ID) to all connected clients
      const uniqueUsers = Array.from(
        new Map(Array.from(onlineUsers.values()).map(u => [u.id, u])).values()
      );
      io.emit("updateOnlineUsers", uniqueUsers);
    }
  });

  socket.on("joinGroup", (groupId) => {
    if (groupId) {
      socket.join(groupId);
    }
  });

  socket.on("itemUpdate", (data) => {
    if (data && data.groupId) {
      io.to(data.groupId).emit("refreshList");
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    const uniqueUsers = Array.from(
      new Map(Array.from(onlineUsers.values()).map(u => [u.id, u])).values()
    );
    io.emit("updateOnlineUsers", uniqueUsers);
  });
});

app.set("io", io);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/lists", require("./routes/listRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
