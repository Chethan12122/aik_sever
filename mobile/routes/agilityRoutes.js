const express = require('express');
const agilityController = require('../controllers/agilityController');
const router = express.Router();

router.post('/agility', agilityController.createAgilityTest);
router.get('/agility', agilityController.getAllagilityTests);
router.get('/agility/:id', agilityController.getAgilityTestById);
router.get('/agility/email/:email', agilityController.getAgilityTestsByEmail);
router.put('/agility/:id', agilityController.updateAgilityTest);
router.delete('/agility/:id', agilityController.deleteAgilityTest);

module.exports = router;
