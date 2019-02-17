if (process.env.NODE_ENV !== 'production') {
    // Load .env file for variables in dev environments only.
    // The file must be in the root directory.
    require('dotenv').load();
}

const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

const paths = require('./config/paths');

if (process.env.NODE_ENV === 'production') {
    // Serve static React files.
    app.use(express.static(paths.clientBuild));
}

// Parse cookies BEFORE routing.
app.use(cookieParser());

// Add API routes.
app.use('/api', routes);

// Start listening for requests.
app.listen(port, () => console.log(`Listening on port ${port}`));
