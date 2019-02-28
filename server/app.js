const initApp = require('./initApp');
const initServer = require('./initServer');

module.exports = initServer(initApp());
