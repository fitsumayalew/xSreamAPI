const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var mp3Duration = require('mp3-duration');

const Song = require("../models/song");

exports.add_song = (req, res, next) => {
  mp3Duration(req.file.path, function (err, duration) {
    if (err) return console.log(err.message);
    console.log('file is' + duration + ' seconds long');

    const song = new Song({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      songPath: req.file.path,
      artist: req.userData.id,
      views: 0,
      album: req.body.album,
      length: duration
    });

    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: 'fitsumayalew',
      api_key: '278299316462351',
      api_secret: 'ZZlzCXQ4Q0GzRYIRwXLV0Jso__M'
    });

    const path = song.songPath;

    cloudinary.uploader.upload(
      path,
      {
        public_id: `${path.split('/')[1]}`,
        resource_type: "auto"
      }, // directory and tags are optional
      function (err, image) {
        if (err) {
          console.log(err);
        }
        console.log('file uploaded to Cloudinary')
        // remove file from server
        const fs = require('fs')
        fs.unlinkSync(path)
        // return image details
      }
    )

    song
      .save()
      .then(result => {
        return res.status(201).json({
          message: "Song Added",
          song: song,
          request: [
            {
              type: "GET",
              url: "song/" + result._id
            },
            {
              type: "GET",
              url: "album/" + result.album
            },
          ]

        });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      });
  });
}



exports.get_song = (req, res, next) => {
  console.log(req.params.songId);
  Song.find({ _id: req.params.songId })
    .select()
    .populate("artist", "_id name")
    .populate("album", "_id name albumImage")
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}