const express = require('express');
const velocityController = require('../controllers/velocityController');
const router = express.Router();

router.post('/velocity', velocityController.createvelocityTest);
router.get('/velocity', velocityController.getAllvelocityTests);
router.get('/velocity/:id', velocityController.getvelocityTestById);
router.get('/velocity/email/:email', velocityController.getvelocityTestsByEmail);
router.put('/velocity/:id', velocityController.updatevelocityTest);
router.delete('/velocity/:id', velocityController.deletevelocityTest);

module.exports = router;
