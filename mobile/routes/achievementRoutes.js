const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');

router.get('/achievement', achievementController.getAchievements);          // GET /achievements?email=
router.get('/achievement/:id', achievementController.getAchievement);        // GET /achievements/:id
router.get('/achievement/email/:email', achievementController.getAchievementsByEmail); // GET /achievements/email/:email
router.post('/achievement', achievementController.createAchievement);       // POST /achievements
router.put('/achievement/:id', achievementController.updateAchievement);     // PUT /achievements/:id
router.delete('/achievement/:id', achievementController.deleteAchievement);  // DELETE /achievements/:id

module.exports = router;
