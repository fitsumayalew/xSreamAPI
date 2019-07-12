const mongoose = require("mongoose");
const Song = require("../models/song");


exports.search = (req, res, next) => {
    Song.find({ $text: { $search: req.body.searchString } } )
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