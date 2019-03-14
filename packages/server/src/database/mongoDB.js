const mongoose = require('mongoose');
const logger = require('../logger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spune';

function connectEventListeners(connection, callback) {
  connection.on('error', (error) => {
    logger.error(`[DB] Failed to connect to ${MONGODB_URI}`);
    logger.error(error);
    if (callback) {
      callback(error);
    }
  });
  connection.once('open', () => {
    logger.info(`[DB] Successfully connected to ${MONGODB_URI}`);
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
      logger.info(`[DB] Successfully disconnected from ${MONGODB_URI}`);
      if (done) {
        done();
      }
    });
  },
};

module.exports.connectEventListeners = connectEventListeners;
