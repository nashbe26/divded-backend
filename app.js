//app.js

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var feedRouter = require('./routes/feed.route'); // Importez votre route feed
const userRouter = require('./routes/user.route');
const eventRouter = require('./routes/event.route');
const newsRouter = require('./routes/news.route');
const musicRouter = require('./routes/music.route');
const playlistRoute = require('./routes/playlist.route');
const messageRoute = require('./routes/message.route');

var app = express(); // Define app here
const cors = require('cors')
var corsOptions = {
	origin: '*',
  }
app.use(cors(corsOptions));

// Middleware function to log request details
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Call next to proceed to the next middleware/route handler
};

// Include the middleware function before defining routes
app.use(logRequest);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
require('./config/bdd'); // Importez le fichier bdd.js
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let playlist = []; // Store playlist in memory

// Function to load playlist from backend
function loadPlaylistFromBackend() {
  // Simulating fetching playlist from backend
  // Replace this with actual backend API call
  playlist = [
    { name: '1708678297236-Damso - Θ. Macarena (Clip Officiel).mp3', path: 'public/music/1708678297236-Damso - Θ. Macarena (Clip Officiel).mp3' },
    { name: '1708810285669-36. Yasin - Ahmed Al Ajmi أحمد بن علي العجمي سورة يس.mp3', path: 'public/music/1708810285669-36. Yasin - Ahmed Al Ajmi أحمد بن علي العجمي سورة يس.mp3' },
    // Add more songs as needed
  ];
}

// Load initial playlist
loadPlaylistFromBackend();

// Watch for changes in the playlist (you can implement this according to your backend)
// For simplicity, this example will just reload the playlist every minute
setInterval(() => {
  loadPlaylistFromBackend();
}, 60000);

app.get('/playlist',(req,res) =>{
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(playlist));
})

// Utilisez la route feed
app.use('/api/v1/feed', feedRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/event',eventRouter);
app.use('/api/v1/news',newsRouter);
app.use('/api/v1/music',musicRouter);
app.use('/api/v1/playlist',playlistRoute);
app.use('/api/v1/message',messageRoute);


// Error handling middleware
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
