const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    genre: { type: String, required: false },
    albumImage: { type: String, required: true },
    uploadDate: {type: Number, required: true},
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }
});

module.exports = mongoose.model('Album', albumSchema);