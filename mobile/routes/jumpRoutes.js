const express = require('express');
const router = express.Router();
const jumpTestController = require('../controllers/jumpController');

router.post('/jump', jumpTestController.createJumpTest);
router.get('/jump', jumpTestController.getAllJumpTests);
router.get('/jump/:id', jumpTestController.getJumpTestById);
router.get('/jump/email/:email', jumpTestController.getJumpTestByEmail);
router.put('/jump/:id', jumpTestController.updateJumpTest);
router.delete('/jump/:id', jumpTestController.deleteJumpTest);

module.exports = router;
