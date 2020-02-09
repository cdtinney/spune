const proxy = require('http-proxy-middleware');

const SERVER_PORT = 5001;

module.exports = function setupProxy(app) {
  // In development, API requests must be forwarded
  // to the back-end development server.
  // In production, it's the same server.
  app.use(proxy('/api', {
    target: `http://localhost:${SERVER_PORT}/`,
  }));
};
