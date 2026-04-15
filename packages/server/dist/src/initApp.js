'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = initApp;
if (process.env.NODE_ENV !== 'production') {
  // Load .env file for variables in dev environments only.
  // The file must be in the server package directory.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config();
}
const express_1 = __importDefault(require('express'));
const express_session_1 = __importDefault(require('express-session'));
const connect_pg_simple_1 = __importDefault(require('connect-pg-simple'));
const passport_1 = __importDefault(require('passport'));
const logger_1 = __importDefault(require('./logger'));
const db_1 = require('./database/db');
const index_1 = __importDefault(require('./routes/index'));
const paths_1 = __importDefault(require('./config/paths'));
const configurePassport_1 = __importDefault(require('./auth/configurePassport'));
const PgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
function initApp() {
  const app = (0, express_1.default)();
  // Trust reverse proxy (Caddy) so Express sees correct protocol/IP
  app.set('trust proxy', 1);
  app.use(express_1.default.urlencoded({ extended: false }));
  app.use(express_1.default.json());
  app.use(
    (0, express_session_1.default)({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: process.env.NODE_ENV === 'production',
      },
      resave: false,
      saveUninitialized: false,
      // Automatically extends the session age on each request.
      rolling: true,
      store: new PgSession({
        pool: db_1.pool,
        createTableIfMissing: true,
      }),
      // If `req.session` is unset, destroy the session in the DB.
      unset: 'destroy',
    }),
  );
  // Initialize Passport.js for authentication of users.
  app.use(passport_1.default.initialize());
  app.use(passport_1.default.session());
  (0, configurePassport_1.default)(passport_1.default);
  // Add HTML routes (for production and integration testing).
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production' || nodeEnv === 'integration') {
    logger_1.default.info(`Serving static files from ${paths_1.default.clientBuildFolder}`);
    // Serve static React files from root.
    app.use('/', express_1.default.static(paths_1.default.clientBuildFolder));
  }
  // Add API routes.
  app.use('/api', index_1.default);
  // Connect to the DB.
  (0, db_1.connect)();
  return app;
}
//# sourceMappingURL=initApp.js.map
