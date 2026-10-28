
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to AI Study Notes Assistant!",
    status: "success",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Backend is working correctly!",
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Study Notes Assistant is running on port ${PORT}`);
});
