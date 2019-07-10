const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const LatestController = require('../controllers/latest');


module.exports = router;
