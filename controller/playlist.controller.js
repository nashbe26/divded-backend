const PlaylistMusic = require('../models/playlist.model');
const playlistController = {};
const Music = require('../models/music.model');
const moment = require('moment');
const musicController=require('../controller/music.controller');
const fs = require('fs');

const cron = require('node-cron');
async function getMusicDurationById(musicId) {
    try {
        const music = await Music.findById(musicId);
        
        if (!music) {
            throw new Error('Music not found');
        }
        
        return music.duration; // Renvoie directement la durée de la musique
    } catch (error) {
        console.error('Error getting music duration by ID:', error);
        throw new Error('Unable to get music duration by ID');
    }
};


playlistController.getduration = async (playlistId) => {
    try {
        const playlist = await PlaylistMusic.findById(playlistId);
        if (!playlist) {
            throw new Error('Playlist not found');
        }
        
        const musicIds = playlist.musicIds;
        let totalDuration = 0;
        
        for (const musicId of musicIds) {
            const music = await Music.findById(musicId);
            if (music && music.duration) {
                totalDuration += music.duration;
            } else {
                console.error(`Music with ID ${musicId} not found or has no duration.`);
            }
        }
        
        return { duration: totalDuration };
    } catch (error) {
        console.log(error);
        throw new Error('Internal server error');
    }
};
playlistController.createPlaylist = async (req, res, next) => {
    try {
        const { title, musicIds,  startTime, genre } = req.body;
        const imagePath ="http://localhost:5000/images/"+ req.file.filename;
        console.log("dddddddddd",musicIds);
        if (!Array.isArray(musicIds)) {
            return res.status(400).json({ message: 'Invalid music data. Music must be an array of IDs.' });
        }
        
        let arr = [];
       
        
        musicIds.map(x=>{
            arr.push(x)
        });
        
        console.log(arr);
        
        const cronStartTime = moment(startTime);
        const cronSchedule = `${cronStartTime.minutes()} ${cronStartTime.hours()} ${cronStartTime.date()} ${cronStartTime.month()} *`;

        let PlaylistDuration = 0

        await Promise.all(arr.map(async x => {
            let prod = await Music.findById(x);
            console.log(prod);
            PlaylistDuration += parseFloat(prod.duration);
        }));

        const newPlaylist = new PlaylistMusic({ title, musicIds:arr, duration:(PlaylistDuration).toString() ,startTime: cronStartTime, genre,cover:imagePath });
        const savedPlaylist = await newPlaylist.save();

        const scheduledTask = cron.schedule(cronSchedule, async () => {
            console.log('Playlist Started ...');
        }, {
            scheduled: false
        });

        scheduledTask.start();

        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

playlistController.getAll = async (req, res, next) => {
    try {
        const musics = await PlaylistMusic.find().populate('musicIds');
        return res.send({ musics });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

playlistController.getbyid = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const musics = await PlaylistMusic.findById(playlistId).populate('musicIds');
        return res.send({ musics });
    } catch (e) {
        console.log(e);
        next(e);
    }
};
playlistController.updatePlaylist = async (req, res, next) => {
    try {
       
        const { playlistId } = req.params;
        const {title, musicIds, duration, startTime, genre } = req.body;
    
        console.log('Music IDs:', musicIds);

        if (!Array.isArray(musicIds)) {
            return res.status(400).json({ message: 'Invalid music data. Music must be an array of IDs.' });
        }

        const updatePlay =await PlaylistMusic.findByIdAndUpdate(playlistId,{title, musicIds, duration, startTime, genre });
        if (!updatePlay) {
            return res.status(404).send({ message: "PlaylistMusic not found" });
        }
        return res.send({ PlaylistMusic: updatePlay });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

playlistController.deleteplay = async (req, res, next) => {
    const { playlistId } = req.params;
    try {
        const deleteplay = await PlaylistMusic.findByIdAndDelete(playlistId);
        if (!deleteplay) {
            return res.status(404).send({ message: "PlaylistMusic not found" });
        }
        return res.send({ message: "PlaylistMusic deleted successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
playlistController.getmusic = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const playlist = await PlaylistMusic.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const musicIds = playlist.musicIds;
        const musics = await Music.find({ _id: { $in: musicIds } });

        return res.send({ musics });
    } catch (e) {
        console.log(e);
        next(e);
    }
};


module.exports = playlistController;
