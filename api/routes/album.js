const express = require("express");
const router = express.Router();
const multer = require('multer');
const md5 = require('md5');
const checkAuth = require('../middleware/check-auth');
const AlbumController = require('../controllers/album');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/');
  },
  filename: function (req, file, cb) {
    var time_now = new Date();
    cb(null, "aa_" + time_now.getDate() + "" + time_now.getMonth() + "-" + time_now.getFullYear() + "_" +
      time_now.getHours() + "-" + time_now.getMinutes() + "-" + time_now.getSeconds() + "-" + md5(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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


router.post("/", checkAuth,upload.single('albumImage'), AlbumController.add_album);

router.get("/:albumId", AlbumController.get_album);

router.get("/albums",checkAuth, AlbumController.get_albums);

router.patch("/:albumId", checkAuth, AlbumController.update_album);



module.exports = router;
