const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed.controller');

router.post('/register', feedController.register);
router.post('/sentres', feedController.sentres);
router.get('/getall', feedController.getAllFeeds);
router.delete('/:feedId', feedController.deleteFeed); 
router.put('/read/:feedId', feedController.markAsRead); 
router.put('/unread/:feedId', feedController.markAsUnread); 

module.exports = router;