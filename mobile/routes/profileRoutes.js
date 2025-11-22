/// this is for updating the profile screen so for the new UI this is not required 

const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.post('/profile', profileController.updateProfile);

module.exports = router;
