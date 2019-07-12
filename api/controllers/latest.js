const mongoose = require("mongoose");

const Album = require("../models/album");


exports.get_latest = (req, res, next) => {
        Album.find()
            .sort([['uploadDate', 'descending']])
            .populate("artist", "_id name")
            .exec()
            .then(result => {
                if (result.length > 0) {
                    res.status(200).json(result);
                }
            })
            .catch (err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
});
}