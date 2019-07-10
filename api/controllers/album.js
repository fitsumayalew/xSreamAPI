const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const Album = require("../models/album");


exports.add_album = (req, res, next) => {
    const album = new Album({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        albumImage: req.file.path,
        artist: req.userData.id
    });

    album
        .save()
        .then(result => {
            return res.status(201).json({
                message: "Album created",
                album: album,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/album/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
}

exports.get_album = (req, res, next) => {
    Album.find({ _id: req.params.albumId })
        .exec()
        .then(artist => {
            if (artist.length < 1) {
                return res.status(403).json({
                    error: "Invalid Token"
                });
            }
            return res.status(200).json(artist[0]);
        });
}

exports.update_album = (req, res, next) => {
    Artist.find({ _id: req.userData.id })
        .exec()
        .then(artist => {
            if (artist.length < 1) {
                return res.status(403).json({
                    error: "Invalid Token"
                });
            }
            return res.status(200).json(artist[0]);
        });
}