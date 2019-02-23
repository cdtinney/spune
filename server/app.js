if (process.env.NODE_ENV !== 'production') {
  // Load .env file for variables in dev environments only.
  // The file must be in the root directory.
  require('dotenv').load();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const connectDatabase = require('./database/connectDatabase');
const routes = require('./routes/index');
const paths = require('./config/paths');
const configurePassport = require('./auth/configurePassport');

// Connect to our database 
const dbConnection = connectDatabase();

const app = express();
const port = process.env.PORT || 5000;

// Parse cookies BEFORE routing.
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
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
    mongooseConnection: dbConnection,
  }),
}));

// Initialize Passport.js for authentication of users.
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Add HTML routes (for production).
if (process.env.NODE_ENV === 'production') {
  // Serve static React files from root.
  // TODO Re-route to home page if not logged in.
  app.use('/', express.static(paths.clientBuildFolder));
}

// Add API routes.
app.use('/api', routes);

// Start listening for requests.
app.listen(port, () => console.log(`Listening on port ${port}`));
