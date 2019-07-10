const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    length: { type: String, deault: 0 },
    views: { type: Number, deault: 0},
    songPath: { type: String, required: true},
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true }
});

module.exports = mongoose.model('Song', songSchema);