// const detailsService = require('../services/detailsService');

// const updateDetails = async (req, res) => {
//   const { email, name, gender, dob, weight, height } = req.body;

//   if (!email || !name || !gender || !dob || !weight || !height) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const updated = await detailsService.updateDetails({ email, name, gender, dob, weight, height });

//     if (!updated) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.status(200).json({ message: 'Details updated successfully', user: updated });
//   } catch (err) {
//     console.error('Error updating details:', err);
//     res.status(500).json({ error: 'Database error', details: err.message });
//   }
// };

// module.exports = {
//   updateDetails,
// };


const detailsService = require('../services/detailsService');

const updateDetails = async (req, res) => {
  const { email, name, gender, dob, weight, height, primarySport } = req.body;

  // Ensure all necessary fields are present
  if (!email || !name || !gender || !dob || !weight || !height || !primarySport ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Pass all fields to the service layer, including the new fields
    const updated = await detailsService.updateDetails({
      email, name, gender, dob, weight, height, primarySport
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the updated data back in the response
    res.status(200).json({ message: 'Details updated successfully', user: updated });
  } catch (err) {
    console.error('Error updating details:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

module.exports = {
  updateDetails,
};
