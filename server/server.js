const app = require('./app');
const mongoDB = require('./database/mongoDB');

const port = process.env.PORT || 5000;

mongoDB.connect();

app.listen(port, console.log.bind(null, `Listening on port ${port}`));
