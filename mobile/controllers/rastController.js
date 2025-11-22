const rastService = require('../services/rastService');

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await rastService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await rastService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
 
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const users = await rastService.getUserByEmail(email);

    if (!users || users.length === 0) { 
      return res.json([]);  
    }

    res.json(users); 
  } catch (error) {
    console.error(error); 
    if (error.message) {
      return res.status(400).json({ error: error.message });   
    } 
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await rastService.updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await rastService.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
