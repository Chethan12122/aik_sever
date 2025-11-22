/// Used for the main profile screen

// const express = require('express');
// const userController = require('../controllers/userController');

// const router = express.Router();
// const multer = require('multer');
// const upload = multer();  

// router.put('/user/:email', upload.single('image'), userController.updateUserDetails);

// router.get('/users', userController.getUsers);
// router.get('/details/:email', userController.getUserDetailsByEmail);
// router.put('/updateprofile/details/:email', userController.updateUserDetails);

// module.exports = router;


//ALTER TABLE details ADD COLUMN image_url TEXT; 


// const express = require('express');
// const userController = require('../controllers/userController');

// const router = express.Router();
// const multer = require('multer');
// const upload = multer();  

// // New endpoint for image upload
// router.post('/upload-image', upload.single('image'), userController.uploadImage);

// // Updated PUT endpoints (no multer middleware)
// router.put('/user/:email', userController.updateUserDetails);
// router.put('/updateprofile/details/:email', userController.updateUserDetails);

// // Existing GET endpoints
// router.get('/users', userController.getUsers);
// router.get('/details/:email', userController.getUserDetailsByEmail);

// module.exports = router;


const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
const multer = require('multer');
const upload = multer();  

// Modified endpoint to accept email for image upload
router.post('/upload-image/:email', upload.single('image'), userController.uploadImage);

// Updated PUT endpoints (no change)
router.put('/user/:email', userController.updateUserDetails);
router.put('/updateprofile/details/:email', userController.updateUserDetails);

// Existing GET endpoints
router.get('/users', userController.getUsers);
router.get('/details/:email', userController.getUserDetailsByEmail);
router.get('/userdetails', userController.getUsersDetails);
module.exports = router;