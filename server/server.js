const initApp = require('./initApp');
const mongoDB = require('./database/mongoDB');

const app = initApp();

mongoDB.connect();

const port = process.env.PORT || 5000;
app.listen(port, console.log.bind(null, `Listening on port ${port}`));
