const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spune';

function connectEventListeners(connection, callback) {
  connection.on('error', (error) => {
    console.error(`[DB] Failed to connect to ${MONGODB_URI}`);
    console.error(error);
    if (callback) {
      callback(error);
    }
  });
  connection.once('open', () => {
    console.log(`[DB] Successfully connected to ${MONGODB_URI}`);
    if (callback) {
      callback();
    }
  });
}

module.exports = {
  mongoose,
  connect: (done) => {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });

    connectEventListeners(mongoose.connection, done);
  },

  disconnect: (done) => {
    mongoose.disconnect(() => {
      console.log(`[DB] Successfully disconnected from ${MONGODB_URI}`);
      done();
    });
  },
};

module.exports.connectEventListeners = connectEventListeners;
