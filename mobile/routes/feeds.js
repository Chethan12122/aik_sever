const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const feedController = require('../controllers/feedsController');

// Upload
router.post('/upload', upload.single('image'), feedController.uploadImage);

// CRUD
router.post('/feeds', feedController.createFeed);
router.get('/feeds/:id', feedController.getFeedById);
router.get('/feeds/user/:user_email', feedController.getFeedsByUser);
router.get('/feeds',feedController.getFeedsForAllUser);
router.put('/feeds/:id', feedController.updateFeed);
router.delete('/feeds/:id', feedController.deleteFeed);

// Like a feed
router.post('/feeds/:feed_id/like', feedController.likeFeed);

// Unlike a feed
router.delete('/feeds/:feed_id/unlike', feedController.unlikeFeed);

// Add a comment to a feed
router.post('/feeds/:feed_id/comments', feedController.addComment);

// Get comments for a feed
router.get('/feeds/:feed_id/comments', feedController.getCommentsForFeed);

// Get like count for a feed
router.get('/feeds/:feed_id/like-count', feedController.getLikeCount);


module.exports = router;




