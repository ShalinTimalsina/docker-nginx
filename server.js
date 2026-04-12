const express = require("express");
const path = require("path");
const os = require("os");

const app = express();
const port = process.env.PORT || 3000;

// App identity
const appName = process.env.APP_NAME || "Docker-Nginx-App";
const containerName = os.hostname(); // ✅ canonical Docker container identity

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Homepage
app.get("/", (req, res) => {
  console.log(
    `[${new Date().toISOString()}] Served by ${containerName} | PID ${process.pid}`
  );
  // ✅ UPDATED: Now points to index.html inside the "public" folder
  res.sendFile(path.join(__dirname, "public", "index.html")); 
});

// ✅ Live backend info (NO caching allowed)
app.get("/info", (req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  });

  res.json({
    appName,
    containerName,
    pid: process.pid,
    timestamp: new Date().toISOString()
  });
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", app: appName });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(
    `${appName} started | Container: ${containerName} | Port: ${port}`
  );
});