const initApp = require('./src/initApp');
const initServer = require('./src/initServer');

module.exports = initServer(initApp());
