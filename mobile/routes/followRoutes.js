const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

router.post('/follow', followController.sendFollowRequest);
router.post('/accept', followController.acceptFollowRequest);
router.post('/reject', followController.rejectFollowRequest);
router.post('/unfollow', followController.unfollow);

router.get('/followers/:email', followController.getFollowers);
router.get('/following/:email', followController.getFollowing);
router.get('/status', followController.getFollowStatus);

module.exports = router;
