const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/spune';

module.exports = function connectDatabase() {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
  });
  const db = mongoose.connection;
  db.on('error', (error) => {
    console.error(`[DB] Failed to connect to ${MONGODB_URI}`);
    console.error(error);
  });
  db.once('open', () => {
    console.log(`[DB] Successfully connected to ${MONGODB_URI}`);
  });
};
