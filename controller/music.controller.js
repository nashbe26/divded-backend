const Music = require('../models/music.model');
const fs = require('fs');
const { getAudioDurationInSeconds } = require('get-audio-duration')

const musicController = {};

musicController.register = async (req, res, next) => {
    
    const audioFile = req.files['audioFile'][0].filename; 
    const imageFile = req.files['imageFile'][0].filename; 
    const audioPath = "http://dividedculture.com/music/" + audioFile
    const cover = "http://dividedculture.com/images/" + imageFile

    try {



        const min = await getAudioDurationInSeconds('../public/music/'+audioFile)

        const durationInMinutes = min / 60;
        const durationInSeconds = min ;

        const newAudio = new Music({musician:req.body.musician ,title:req.body.title,cover , genre: req.body.genre ,filename:req.files['audioFile'][0].filename, originalname:req.files['audioFile'][0].originalname, mimetype:req.files['audioFile'][0].mimetype, audioPath, duration: durationInMinutes.toFixed(2),durationInSeconds:durationInSeconds.toFixed(2) });
        const savedAudio = await newAudio.save();

        // Send response
        res.send({ audio: savedAudio });
    } catch (error) {
        console.log(error);
        next(error);
    }
};




musicController.getMusicByIdd = async (req, res, next) => {
    try {
        const musicId = req.params.id;
        const music = await Music.findById(musicId);
        
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }

        const filePath = '../public/music/' + music.filename; // Replace with your MP3 file path
        const fileStream = fs.createReadStream(filePath);
        
        try {
          res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': fs.statSync(filePath).size, // Optional
          });
        
          fileStream.on('data', (chunk) => {
            res.write(chunk);
          });
        
          fileStream.on('end', () => {
            res.end();
            fileStream.close(); // Close the stream
          });
        
          fileStream.on('error', (err) => {
            console.error('Error reading MP3 file:', err);
            res.writeHead(500);
            res.end();
          });
        } catch (err) {
          console.error('Error handling MP3 request:', err);
          res.writeHead(500);
          res.end();
        }
            
     
    } catch (error) {
        console.error(error);
        next(error);
    }
};


musicController.getAllMusic = async (req, res, next) => {
    try {
        const music = await Music.find();
        res.json({ music });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

musicController.updateMusic = async (req, res, next) => {
    try {
        const musicId = req.params.id;
        const { filename, originalname, mimetype } = req.body;
        const audioPath = "http://dividedculture.com/music/" + req.file.filename;

        // Check if music exists
        const music = await Music.findById(musicId);
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }

        // Update music details
        music.filename = filename;
        music.originalname = originalname;
        music.mimetype = mimetype;
        music.audioPath = audioPath;

        // Save updated music
        const updatedMusic = await music.save();
        res.json({ music: updatedMusic });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

musicController.deleteMusic = async (req, res, next) => {
    try {
        const musicId = req.params.id;

        // Check if music exists
        const music = await Music.findById(musicId);
        if (!music) {
            return res.status(404).json({ message: 'Music not found' });
        }

        // Delete music
        await Music.findByIdAndDelete(musicId);
        res.json({ message: 'Music deleted successfully' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = musicController;
