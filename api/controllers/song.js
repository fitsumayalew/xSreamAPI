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
            album: req.body.album,
            length: duration
        });
        console.log(song);

        song
            .save()
            .then(result => {
                return res.status(201).json({
                    message: "Song Added",
                    song: song,
                    request: [
                        {
                            type: "GET",
                            url: "http://localhost:3000/song/" + result._id
                        },
                        {
                            type: "GET",
                            url: "http://localhost:3000/album/" + result.album
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