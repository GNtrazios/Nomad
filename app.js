const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the custom script at /_vercel/insights/script.js
app.get('/_vercel/insights/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'scripts/custom-insights.js'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
