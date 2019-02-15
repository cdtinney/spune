const proxy = require('http-proxy-middleware');
module.exports = function proxyFn(app) {
  app.use(proxy('/api', {
    target: 'http://localhost:5000/',
  }));
};
