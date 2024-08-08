const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    title: String,
    description: String,
    photo: String
});

module.exports = mongoose.model('Photo', PhotoSchema);