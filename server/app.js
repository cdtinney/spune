const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

if (process.env.NODE_ENV === 'production') {
    // Serve static React files.
    app.use(express.static(path.join(__dirname, '../client/build')));

    // Handle React routing, returning all requests to React app entry
    // point.
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    }) ;
}

app.listen(port, () => console.log(`Listening on port ${port}`));
