const express = require('express');
const router = express.Router();
const sprintTestController = require('../controllers/sprintController');

router.post('/sprint', sprintTestController.createsprintTest);
router.get('/sprint', sprintTestController.getAllsprintTests);
router.get('/sprint/:id', sprintTestController.getsprintTestById);
router.get('/sprint/email/:email', sprintTestController.getsprintTestByEmail);
router.put('/sprint/:id', sprintTestController.updatesprintTest);
router.delete('/sprint/:id', sprintTestController.deletesprintTest);

module.exports = router;
