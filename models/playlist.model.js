const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistMusicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    musicIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Music' 
    }

],
    startTime: {
        type: String,
        required: true 
    },
    genre: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    cover: {
        type: String,
    }
});

module.exports = mongoose.model('PlaylistMusic', playlistMusicSchema);
