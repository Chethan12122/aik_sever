const achievementService = require('../services/achievementService');

async function getAchievements(req, res, next) {
  try {
    const email = req.query.email;  // optional query param
    const achievements = await achievementService.getAllAchievements(email);
    res.json(achievements);
  } catch (err) {
    next(err);
  }
}

async function getAchievement(req, res, next) {
  try {
    const id = req.params.id;
    const achievement = await achievementService.getAchievementById(id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (err) {
    next(err);
  }
}

async function getAchievementsByEmail(req, res, next) {
  try {
    const email = req.params.email;
    const achievements = await achievementService.getAllAchievements(email);
    if (!achievements || achievements.length === 0) {
      return res.status(404).json({ error: 'No achievements found for this email' });
    }
    res.json(achievements);
  } catch (err) {
    next(err);
  }
}

async function createAchievement(req, res, next) {
  try {
    const data = req.body;
    const created = await achievementService.createAchievement(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateAchievement(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    const updated = await achievementService.updateAchievement(id, data);
    if (!updated) return res.status(404).json({ error: 'Achievement not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteAchievement(req, res, next) {
  try {
    const id = req.params.id;
    await achievementService.deleteAchievement(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getAchievementsByEmail,
};
