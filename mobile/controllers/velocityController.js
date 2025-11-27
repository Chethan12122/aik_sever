const velocityService = require('../services/velocityService');

// Create velocity test
const createvelocityTest = async (req, res) => {
  try {
    const { name, email, velocity, notes, created_at } = req.body;
    
    // ✅ Validate required fields
    if (!name || !email || !velocity) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["name", "email", "velocity"]
      });
    }

    const velocityTestData = {
      name,
      email,
      velocity,
      notes, // ✅ Optional field
      created_at: created_at || new Date().toISOString()
    };

    const newTest = await velocityService.createVelocityTest(velocityTestData);
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating velocity test:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get velocity test by ID
const getvelocityTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const velocityTest = await velocityService.getVelocityTestById(id);
    
    // ✅ Check array length since service returns array
    if (velocityTest && velocityTest.length > 0) {
      res.status(200).json(velocityTest);
    } else {
      res.status(404).json({ message: 'Velocity test not found' });
    }
  } catch (error) {
    console.error('Error fetching velocity test by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get All velocity tests
const getAllvelocityTests = async (req, res) => {
  try {
    const velocityTests = await velocityService.getAllVelocityTests();
    // ✅ Always return array (even if empty)
    res.status(200).json(velocityTests);
  } catch (error) {
    console.error('Error fetching all velocity tests:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get velocity tests by email
const getvelocityTestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const velocityTests = await velocityService.getVelocityTestByEmail(email);
    
    // ✅ Return empty array instead of 404 (consistent with jump/sprint services)
    if (!velocityTests || velocityTests.length === 0) {
      return res.json([]);
    }
    
    res.status(200).json(velocityTests);
  } catch (error) {
    console.error('Error fetching velocity tests by email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update velocity test
const updatevelocityTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, velocity, notes, created_at } = req.body;
    
    const velocityTestData = {
      name,
      email,
      velocity,
      notes,
      created_at
    };

    const updatedTest = await velocityService.updateVelocityTest(id, velocityTestData);
    
    // ✅ Check array length
    if (updatedTest && updatedTest.length > 0) {
      res.status(200).json(updatedTest);
    } else {
      res.status(404).json({ message: 'Velocity test not found' });
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
    
    // ✅ Check array length
    if (deletedTest && deletedTest.length > 0) {
      res.status(200).json({ message: 'Velocity test deleted successfully' });
    } else {
      res.status(404).json({ message: 'Velocity test not found' });
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
