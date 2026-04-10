const favoriteService = require("../services/favoriteWorkoutService");

/**
 * POST /api/favorites
 * Body: { "email": "user@mail.com", "workout_id": 12 }
 */
async function addFavorite(req, res) {
  try {
    const { email, workout_id } = req.body || {};
    if (!email || workout_id === undefined || workout_id === null) {
      return res.status(400).json({ error: "email and workout_id are required" });
    }
    const wid = Number(workout_id);
    if (Number.isNaN(wid)) {
      return res.status(400).json({ error: "workout_id must be a number" });
    }
    await favoriteService.addFavorite(String(email), wid);
    return res.status(201).json({ ok: true, message: "Favorite saved" });
  } catch (e) {
    console.error("addFavorite:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
}

/**
 * DELETE /api/favorites
 * Body: { "email": "user@mail.com", "workout_id": 12 }
 */
async function removeFavorite(req, res) {
  try {
    const { email, workout_id } = req.body || {};
    if (!email || workout_id === undefined || workout_id === null) {
      return res.status(400).json({ error: "email and workout_id are required" });
    }
    const wid = Number(workout_id);
    if (Number.isNaN(wid)) {
      return res.status(400).json({ error: "workout_id must be a number" });
    }
    await favoriteService.removeFavorite(String(email), wid);
    return res.status(200).json({ ok: true, message: "Favorite removed" });
  } catch (e) {
    console.error("removeFavorite:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
}

/**
 * GET /api/favorites/:email
 * Returns list of workout rows (joined from workouts table).
 */
async function getFavorites(req, res) {
  try {
    const raw = req.params.email;
    if (!raw) {
      return res.status(400).json({ error: "email is required" });
    }
    const email = decodeURIComponent(raw);
    const rows = await favoriteService.getFavoriteWorkoutsByEmail(email);
    return res.status(200).json(rows);
  } catch (e) {
    console.error("getFavorites:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
}

/**
 * GET /api/favorites/check/:email/:workout_id
 * Response: { "isFavorite": true|false }
 */
async function checkFavorite(req, res) {
  try {
    const rawEmail = req.params.email;
    const rawWid = req.params.workout_id;
    if (!rawEmail || rawWid === undefined) {
      return res.status(400).json({ error: "email and workout_id are required" });
    }
    const email = decodeURIComponent(rawEmail);
    const workoutId = Number(rawWid);
    if (Number.isNaN(workoutId)) {
      return res.status(400).json({ error: "workout_id must be a number" });
    }
    const isFavorite = await favoriteService.isFavorite(email, workoutId);
    return res.status(200).json({ isFavorite });
  } catch (e) {
    console.error("checkFavorite:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
};
