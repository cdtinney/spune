if (process.env.NODE_ENV !== 'production') {
  // Load .env file for variables in dev environments only.
  // The file must be in the server package directory.
  require('dotenv').load();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const mongoDB = require('./database/mongoDB');
const routes = require('./routes/index');
const paths = require('./config/paths');
const configurePassport = require('./auth/configurePassport');

module.exports = function initApp() {
  const app = express();

  app.use(cookieParser());

  app.use(bodyParser.urlencoded({
    extended: false,
  }));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      // Persist cookies for a year. By default, cookies
      // are not persistent and will be lost upon certain
      // conditions like browsers exiting.
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
    resave: true,
    saveUninitialized: false,
    // Automatically extends the session age on each request.
    rolling: true,
    // Use MongoDB to store sessions.
    store: new MongoStore({
      mongooseConnection: mongoDB.mongoose.connection,
    }),
  }));

  // Initialize Passport.js for authentication of users.
  app.use(passport.initialize());
  app.use(passport.session());
  configurePassport(passport);

  // Add HTML routes (for production).
  if (process.env.NODE_ENV === 'production') {
    // Serve static React files from root.
    app.use('/', express.static(paths.clientBuildFolder));
  }

  // Add API routes.
  app.use('/api', routes);

  // Error handling must be added last.
  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    console.error(err);
    res.status(500).send({
      name: error.name,
      message: error.message,
    });
  })

  // Connect to the DB.
  mongoDB.connect();

  return app;
}
