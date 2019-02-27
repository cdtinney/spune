const express = require('express');
const initAuthRoutes = require('./auth');
const initSpotifyRoutes = require('./spotify');

module.exports = function initRoutes() {
  const router = new express.Router();
  initAuthRoutes(router);
  initSpotifyRoutes(router);
  return router;
};
