const express = require("express");
const router = express.Router();
const LatestController = require('../controllers/latest');
router.get("/", LatestController.get_latest);
module.exports = router;
