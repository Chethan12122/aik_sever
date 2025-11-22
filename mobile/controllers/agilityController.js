const agilityService = require('../services/agilityService');

// Create agility test
const createAgilityTest = async (req, res) => {
  try {
    const agilityTestData = req.body;
    const newTest = await agilityService.createAgilityTest(agilityTestData);
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating agility test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get agility test by ID
const getAgilityTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const agilityTest = await agilityService.getAgilityTestById(id);
    if (agilityTest) {
      res.status(200).json(agilityTest);
    } else {
      res.status(404).json({ message: 'Agility Test not found' });
    }
  } catch (error) {
    console.error('Error fetching agility test by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All agility tests
const getAllagilityTests = async (req, res) => {
  try {
    const agilityTest = await agilityService.getAllAgilityTests();
    res.json(agilityTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get agility tests by email
const getAgilityTestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const agilityTests = await agilityService.getAgilityTestByEmail(email);
    if (agilityTests.length > 0) {
      res.status(200).json(agilityTests);
    } else {
      res.status(404).json({ message: 'No agility tests found for this email' });
    }
  } catch (error) {
    console.error('Error fetching agility tests by email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update agility test
const updateAgilityTest = async (req, res) => {
  try {
    const { id } = req.params;
    const agilityTestData = req.body;
    const updatedTest = await agilityService.updateAgilityTest(id, agilityTestData);
    if (updatedTest) {
      res.status(200).json(updatedTest);
    } else {
      res.status(404).json({ message: 'Agility Test not found' });
    }
  } catch (error) {
    console.error('Error updating agility test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete agility test
const deleteAgilityTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTest = await agilityService.deleteAgilityTest(id);
    if (deletedTest) {
      res.status(200).json({ message: 'Agility Test deleted successfully' });
    } else {
      res.status(404).json({ message: 'Agility Test not found' });
    }
  } catch (error) {
    console.error('Error deleting agility test:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createAgilityTest,
  getAgilityTestById,
  getAgilityTestsByEmail,
  getAllagilityTests,
  updateAgilityTest,
  deleteAgilityTest,
};
