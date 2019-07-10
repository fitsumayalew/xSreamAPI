const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phone: { 
        type: String, 
        required: true, 
        unique: true
    },
    name: { type: String, required: true },
    bio: { type: String, required: false },
    artistImage: { type: String, required: false }
});

module.exports = mongoose.model('Artist', artistSchema);