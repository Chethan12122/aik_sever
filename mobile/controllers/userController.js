const Joi = require('joi');
const userService = require('../services/userService');
const { uploadToAzure } = require('../services/blobService');
 
const updateUserSchema = Joi.object({
  role: Joi.string().required(),
  name: Joi.string().required(),
  gender: Joi.string().required(),
  date_of_birth: Joi.date().required(),
  weight: Joi.number().required(),
  height: Joi.number().required(),
  about_me: Joi.string().required(),
  intrests: Joi.string().required(),
  work: Joi.string().required(),
  location: Joi.string().required(),
  primary_sport: Joi.string().required(),
  image_url: Joi.string().uri().optional(),
});

// Validation schema for uploadImage
const uploadImageSchema = Joi.object({
  image: Joi.any().required(),
  email: Joi.string().email().required(),
});

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }
    res.status(200).json({ success: true, data: { users } });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', details: err.message });
  }
};

const getUsersDetails = async (req, res) => {
  try {
    const users = await userService.fetchAllUSers();
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }
    res.status(200).json({ success: true, data: { users } });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', details: err.message });
  }
};

const getUserDetailsByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    console.error ("Error retrieving user details:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error', details: err.message });
  }
};

const uploadImage = async (req, res) => {
  const { email } = req.params;
  const { file } = req;

  // Validate input
  const { error } = uploadImageSchema.validate({ image: file, email });
  if (error) {
    return res.status(400).json({ success: false, message: error.details.map(detail => detail.message).join(', ') });
  }

  try {
    // Check if user exists
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Upload image to Azure and get the URL
    const image_url = await uploadToAzure(file);

    // Update user's image_url in the database
    const updatedUser = await userService.updateUserDetails(email, {
      role: user.role,
      name: user.name,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      weight: user.weight,
      height: user.height,
      about_me: user.about_me,
      intrests: user.intrests,
      work: user.work,
      location: user.location,
      primary_sport: user.primary_sport,
      image_url,
    });

    res.status(200).json({ success: true, data: { image_url, user: updatedUser } });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', details: err.message });
  }
};

const updateUserDetails = async (req, res) => {
  const { email } = req.params;
  const { role, name, gender, date_of_birth, weight, height, about_me, intrests, work, location, primary_sport, image_url } = req.body;

  // Validate JSON body
  const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, message: error.details.map(detail => detail.message).join(', ') });
  }

  try {
    // Check if user exists
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user details
    const updatedUser = await userService.updateUserDetails(email, {
      role: value.role,
      name: value.name,
      gender: value.gender,
      date_of_birth: value.date_of_birth,
      weight: value.weight,
      height: value.height,
      about_me: value.about_me,
      intrests: value.intrests,
      work: value.work,
      location: value.location,
      primary_sport: value.primary_sport,
      image_url: value.image_url || user.image_url,
    });

    res.status(200).json({ success: true, data: { user: updatedUser } });
  } catch (err) {
    console.error('Error updating user details:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', details: err.message });
  }
};

module.exports = {
  getUsers,
  getUserDetailsByEmail,
  uploadImage,
  updateUserDetails,
  getUsersDetails
};