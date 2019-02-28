const express = require('express');

const router = new express.Router();
router.use('/auth', require('./auth'));
router.use('/spotify', require('./spotify'));
module.exports = router;
