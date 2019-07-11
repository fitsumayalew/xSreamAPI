const express = require("express");
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const checkAuth = require('../middleware/check-auth');
const SongController = require('../controllers/song');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + md5(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'audio/mpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



router.post("/", checkAuth,upload.single('song'), SongController.add_song);

router.get("/:songId", SongController.get_song);

module.exports = router;
