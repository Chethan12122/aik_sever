const jumpTestService = require('../services/jumpServices');

const createJumpTest = async (req, res) => {
  try {
    const { name, email, metrics } = req.body;
    if (!name || !email || !metrics) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newJumpTest = await jumpTestService.createJumpTest({ name, email, metrics });
    res.status(201).json(newJumpTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllJumpTests = async (req, res) => {
  try {
    const jumpTests = await jumpTestService.getAllJumpTests();
    res.json(jumpTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJumpTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const jumpTest = await jumpTestService.getJumpTestById(id);
    if (!jumpTest) return res.status(404).json({ message: "Jump Test not found" });
    res.json(jumpTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJumpTestByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const jumpTest = await jumpTestService.getJumpTestByEmail(email);
    if (!jumpTest) return res.status(404).json({ message: "Jump Test not found for this email" });
    // if (!jumpTest || jumpTest.length === 0) {
    //   // Return an empty array or object if no user is found
    //   return res.json([]);  // you can return an empty object if needed
    // }

    res.json(jumpTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJumpTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, metrics } = req.body;
    const updatedJumpTest = await jumpTestService.updateJumpTest(id, { name, email, metrics });
    if (!updatedJumpTest) return res.status(404).json({ message: "Jump Test not found" });
    res.json(updatedJumpTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJumpTest = async (req, res) => {
  try {
    const { id } = req.params;
    await jumpTestService.deleteJumpTest(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJumpTest,
  getAllJumpTests,
  getJumpTestById,
  getJumpTestByEmail,
  updateJumpTest,
  deleteJumpTest,
};
