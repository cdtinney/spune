if (process.env.NODE_ENV !== 'production') {
  // Load .env file for variables in dev environments only.
  // The file must be in the root directory.
  require('dotenv').load();
}

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const connectDatabase = require('./database/connectDatabase');
const routes = require('./routes/index');
const paths = require('./config/paths');
const passportStrategy = require('./spotify/auth/passportStrategy');

connectDatabase();

passport.use(passportStrategy());

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // TODO Redirect if not logged in
  // Serve static React files from root.
  app.use(express.static(paths.clientBuildFolder));
}

// Parse cookies BEFORE routing.
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport.js.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Add API routes.
app.use('/api', routes);

// Start listening for requests.
app.listen(port, () => console.log(`Listening on port ${port}`));
