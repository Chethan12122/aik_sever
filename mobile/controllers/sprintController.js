const rastService = require('../services/rastService');

exports.createUser = async (req, res) => {
  try {
    const { name, email, sets, notes } = req.body;
    
    // ✅ Validate required fields
    if (!name || !email || !sets) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'sets']
      });
    }

    // ✅ Validate sets is an array
    if (!Array.isArray(sets)) {
      return res.status(400).json({ 
        error: 'Invalid data type',
        message: 'sets must be an array'
      });
    }

    const userData = { name, email, sets, notes };
    const newUser = await rastService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating RAST test:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await rastService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'RAST test not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching RAST test by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const users = await rastService.getUserByEmail(email);

    // ✅ Return empty array if no results (consistent with other services)
    if (!users || users.length === 0) { 
      return res.json([]);  
    }

    res.status(200).json(users); 
  } catch (error) {
    console.error('Error fetching RAST tests by email:', error); 
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, sets, notes } = req.body;
    
    // ✅ Create update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (sets !== undefined) {
      // Validate sets is an array if provided
      if (!Array.isArray(sets)) {
        return res.status(400).json({ 
          error: 'Invalid data type',
          message: 'sets must be an array'
        });
      }
      updateData.sets = sets;
    }
    if (notes !== undefined) updateData.notes = notes;

    const updatedUser = await rastService.updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'RAST test not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating RAST test:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await rastService.deleteUser(userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'RAST test not found' });
    }
    
    res.status(200).json({ message: 'RAST test deleted successfully' });
  } catch (error) {
    console.error('Error deleting RAST test:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
