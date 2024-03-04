const NodeMediaServer  = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  relay: {
    ffmpeg: require('ffmpeg-static'), // Assuming you installed ffmpeg as a Node.js package
    tasks: [
      {
        app: 'live',
        mode: 'push',
        edge: 'rtmp://127.0.0.1/live'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);

module.exports = nms;