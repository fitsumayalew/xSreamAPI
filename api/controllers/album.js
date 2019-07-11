const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const Album = require("../models/album");
const Song = require("../models/song");


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
    if(req.body.returnSongs == true){
        Album.find({_id:req.params.albumId})
        .populate("artist","_id name")
        .exec()
        .then(result => {
            if(result.length > 0){
                Song.find({artist: result[0].artist})
                .select("_id name songPath length")
                .exec()
                .then(songs=>{
                    res.status(200).json({
                        _id : result[0]._id,
                        name : result[0].name,
                        albumImage : result[0].albumImage,
                        artist : result[0].artist,
                        songs : songs

                    });
                })
                .catch();
                
            }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }else{
        Album.find({_id:req.params.albumId})
        .select()
        .populate("artist","_id name")
        .exec()
        .then(result => {
          res.status(200).json(result[0]);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    }
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