const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Environment variables with fallback
const appName = process.env.APP_NAME || 'Docker-Nginx-App';

// Serve static files (images, css, js if you add later)
app.use(express.static(path.join(__dirname)));

// Explicit route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log(`[${new Date().toISOString()}] Request served by ${appName}`);
});

// Health check endpoint (useful for Docker / Nginx / monitoring)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', app: appName });
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`${appName} is running on port ${port}`);
});
