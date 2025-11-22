const express = require('express');
const router = express.Router();
const rastController = require('../controllers/rastController');

router.post('/rast', rastController.createUser);
router.get('/rast/:id', rastController.getUserById); 
router.get('/rast/email/:email', rastController.getUserByEmail); 
router.put('/rast/:id', rastController.updateUser); 
router.delete('/rast/:id', rastController.deleteUser);


module.exports = router;

 