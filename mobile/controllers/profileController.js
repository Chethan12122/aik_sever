const profileService = require('../services/profileService');

const updateProfile = async (req, res) => {
  const { email, about_me, intrests, achievements, work, location } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const profile = await profileService.getProfileByEmail(email);

    if (!profile) {
      return res.status(404).json({ message: 'Email not found or does not exist' });
    }

    const updatedProfile = await profileService.updateProfile({ email, about_me, intrests, achievements, work, location });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedProfile });
  } catch (err) {
    console.error('Error processing profile:', err);
    res.status(500).json({ message: 'Internal Server Error', details: err.message });
  }
};

module.exports = {
  updateProfile,
};
