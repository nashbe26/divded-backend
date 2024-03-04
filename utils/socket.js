const Music = require('../models/music.model');
const fs = require('fs');
const fluentFfmpeg = require('fluent-ffmpeg');

let currMusic;

async function StartMusic (){
    const oneMusic = await Music.find();
    console.log("dddddddddddddd",oneMusic);
    currMusic = oneMusic[0]
}

function CreateMusic(socket, io) {

    socket.on("newUser", async () => {

        /*socket.emit('start', { duration: currMusic.duration }); 

        const stream = fs.createReadStream('public/music/'+currMusic.filename);
        stream.on('data', (chunk) => {
            socket.emit('data', chunk);
        });

        stream.on('end', () => {
            socket.emit('end');
        });

        stream.on('error', (err) => {
            console.error('Error streaming audio:', err);
            socket.emit('error');
        });*/
    
    });

}

module.exports = {
    CreateMusic,
    StartMusic
}