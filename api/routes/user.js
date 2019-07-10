const express = require("express");
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user');
const md5 = require('md5');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        var time_now = new Date();
        cb(null, "ua_" + time_now.getDate() + "" + time_now.getMonth() + "-" + time_now.getFullYear() + "_" +
        time_now.getHours() + "-" + time_now.getMinutes() + "-" + time_now.getSeconds() + "-"  +  md5(file.originalname) + "." + file.originalname.split(".").pop());
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

router.post("/signup", upload.single('avatar'), UserController.user_signup);

router.get('/',UserController.get_users);

router.get("/login", UserController.user_login);

router.get("/profile", checkAuth, UserController.user_profile);

router.patch("/profile", checkAuth, UserController.user_profile_update);

module.exports = router;
