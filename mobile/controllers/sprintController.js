const sprintTestService = require('../services/sprintServices');

const createsprintTest = async (req, res) => {
  try {
    const { name, email, gates , notes} = req.body;
    if (!name || !email || !gates) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newsprintTest = await sprintTestService.createSprintTest({ name, email, gates,notes, });
    res.status(201).json(newsprintTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllsprintTests = async (req, res) => {
  try {
    const sprintTests = await sprintTestService.getAllSprintTests();
    res.json(sprintTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getsprintTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const sprintTest = await sprintTestService.getSprintTestById(id);
    if (!sprintTest) return res.status(404).json({ message: "Jump Test not found" });
    res.json(sprintTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getsprintTestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const sprintTest = await sprintTestService.getSprintTestByEmail(email);
    if (!sprintTest) return res.status(404).json({ message: "Jump Test not found for this email" });
    // if(!sprintTest || sprintTest.length === 0)
    // {
    //   return res.json([]); 
    // }
    res.json(sprintTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatesprintTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, gates, notes } = req.body;
    const updatedsprintTest = await sprintTestService.updateSprintTest(id, { name, email, gates, notes, });
    if (!updatedsprintTest) return res.status(404).json({ message: "Jump Test not found" });
    res.json(updatedsprintTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletesprintTest = async (req, res) => {
  try {
    const { id } = req.params;
    await sprintTestService.deleteSprintTest(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createsprintTest,
  getAllsprintTests,
  getsprintTestById,
  getsprintTestByEmail,
  updatesprintTest,
  deletesprintTest,
};
