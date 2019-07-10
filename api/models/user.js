const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phone: { 
        type: String, 
        required: true, 
        unique: true
    },
    username: {type: String, required:true},
    premium: { type: Boolean, default:true },
    avatar: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);