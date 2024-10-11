const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePic: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    latitude:{
        type: Number,
        required: true,
    },
    longitude:{
        type: Number,
        required: true,
    }
}); 

const User = mongoose.model('User', userSchema);

module.exports = User;