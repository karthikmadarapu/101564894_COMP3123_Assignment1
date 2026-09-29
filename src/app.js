// app.js configures the app (middleware and routes)

const express = require('express');

const app = express();

// Parse JSON request bodies into req.body
app.use(express.json());

// Health check: lets anyone confirm the API is alive
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),        // seconds the server has been running
    timestamp: new Date().toISOString(),
  });
});



module.exports = app;