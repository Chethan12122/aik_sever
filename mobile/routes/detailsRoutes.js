// creating the progress screen
const express = require('express');
const detailsController = require('../controllers/detailsController');

const router = express.Router();

router.post('/details', detailsController.updateDetails);

module.exports = router;
