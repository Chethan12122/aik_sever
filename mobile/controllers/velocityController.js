const velocityService = require('../services/velocityService');

// Create velocity test
const createvelocityTest = async (req, res) => {
  try {
    const velocityTestData = req.body;
    const newTest = await velocityService.createVelocityTest(velocityTestData);
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating velocity test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get velocity test by ID
const getvelocityTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const velocityTest = await velocityService.getVelocityTestById(id);
    if (velocityTest) {
      res.status(200).json(velocityTest);
    } else {
      res.status(404).json({ message: 'velocity Test not found' });
    }
  } catch (error) {
    console.error('Error fetching velocity test by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All velocity tests
const getAllvelocityTests = async (req, res) => {
  try {
    const velocityTest = await velocityService.getAllVelocityTests();
    res.json(velocityTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get velocity tests by email
const getvelocityTestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const velocityTests = await velocityService.getVelocityTestByEmail(email);
    if (velocityTests.length > 0) {
      res.status(200).json(velocityTests);
    } else {
      res.status(404).json({ message: 'No velocity tests found for this email' });
    }
  } catch (error) {
    console.error('Error fetching velocity tests by email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update velocity test
const updatevelocityTest = async (req, res) => {
  try {
    const { id } = req.params;
    const velocityTestData = req.body;
    const updatedTest = await velocityService.updateVelocityTest(id, velocityTestData);
    if (updatedTest) {
      res.status(200).json(updatedTest);
    } else {
      res.status(404).json({ message: 'velocity Test not found' });
    }
  } catch (error) {
    console.error('Error updating velocity test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete velocity test
const deletevelocityTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTest = await velocityService.deleteVelocityTest(id);
    if (deletedTest) {
      res.status(200).json({ message: 'velocity Test deleted successfully' });
    } else {
      res.status(404).json({ message: 'velocity Test not found' });
    }
  } catch (error) {
    console.error('Error deleting velocity test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createvelocityTest,
  getvelocityTestById,
  getvelocityTestsByEmail,
  getAllvelocityTests,
  updatevelocityTest,
  deletevelocityTest,
};
