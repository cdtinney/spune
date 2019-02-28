const express = require('express');
const auth = require('./auth');
const spotify = require('./spotify');

const router = new express.Router();
router.use('/auth', auth);
router.use('/spotify', spotify);
module.exports = router;
