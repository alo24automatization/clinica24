const express = require("express");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const morgan = require("morgan");
const http = require("http");
const config = require("config");
const app = express();
const server = http.createServer(app);

// app.use(morgan('combined'));
app.use(express.json({ limit: "10mb" })); // Increase the limit to 10MB or adjust as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Middleware to enable CORS for localhost only
const corsOptions = {
  origin: ["http://localhost:3000", "https://unical-med.uz"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Database connection
const { start } = require("./connectDB/db");
start(app);

// Routers
const { routers } = require("./routers/routers");
routers(app);

// Message scheduling
const { sendMessage } = require("./routers/message/message");
sendMessage();
setInterval(() => {
  sendMessage();
}, 1000 * 60 * 60 * 12);

// Static file serving in production
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "./frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./frontend", "build", "index.html"));
  });
}
// Initialize Socket.IO
const initializeSocket = require("./socket");
const { Department } = require("./models/Services/Department");
initializeSocket(server);
const PORT = config.get("PORT");

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Schedule the reset task to run every day at 23:00
cron.schedule('0 23 * * *', async () => {
  try {
    await Department.updateMany({}, { takenTurns: [] });
    console.log('takenTurns array reset for all departments at 23:00');
  } catch (error) {
    console.error('Error resetting takenTurns array:', error);
  }
});