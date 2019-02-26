const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/spune';

module.exports = {
  mongoose,
  connect: (done) => {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });

    const dbConnection = mongoose.connection;
    dbConnection.on('error', (error) => {
      console.error(`[DB] Failed to connect to ${MONGODB_URI}`);
      console.error(error);
      if (done) {
        done(error);
      }
    });
    dbConnection.once('open', () => {
      console.log(`[DB] Successfully connected to ${MONGODB_URI}`);
      if (done) {
        done();
      }
    });
  },

  disconnect: (done) => {
    mongoose.disconnect(done);
  },
};
