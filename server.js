const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
