const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');  // Import the cors package

const routes = require('./routes/routes');
const { OPENAI_CLIENT, PORT } = require('./global');

const app = express();

// Use the CORS middleware to allow requests from all origins
app.use(cors());  // This enables CORS for all routes

app.use(bodyParser.json({ limit: '50mb' }));

// Use your defined routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
