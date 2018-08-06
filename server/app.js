const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const spotifyRoutes = require('./routes/spotify');

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    // Serve static React files.
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    // Handle React routing, returning all requests to React app entry
    // point.
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Parse cookies BEFORE routing.
app.use(cookieParser());

// Add routes.
app.use('', spotifyRoutes);

// Start listening for requests.
app.listen(port, () => console.log(`Listening on port ${port}`));
