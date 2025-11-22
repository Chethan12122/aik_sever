// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// router.post('/authlogin', authController.authloginUser);

// module.exports = router;



const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authManualCOntroller = require('../controllers/auth_manualController');

router.post('/authlogin', authController.loginUser);
router.post('/authregister', authController.registerUser);
router.post('/register', authManualCOntroller.register);
router.post('/login', authManualCOntroller.login);
module.exports = router;
