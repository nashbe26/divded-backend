const mongoose = require('mongoose');

const musicMetadataSchema = new mongoose.Schema({
    filename: { type: String },
    originalname: { type: String},
    mimetype: { type: String},
    uploadDate: { type: Date, default: Date.now },
    duration: { type: String},
    audioPath: { type: String},
    durationInSeconds: { type: String},
    title: { type: String},
    genre: { type: String},
    musician:{ type: String},
    cover:{ type: String},
    
});

const musicMetadata = mongoose.model('Music', musicMetadataSchema);

module.exports = musicMetadata;
