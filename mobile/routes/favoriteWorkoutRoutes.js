const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteWorkoutController");

// Register specific paths before "/favorites/:email" so "check" is not captured as an email.
router.post("/favorites", favoriteController.addFavorite);
router.delete("/favorites", favoriteController.removeFavorite);
router.get("/favorites/check/:email/:workout_id", favoriteController.checkFavorite);
router.get("/favorites/:email", favoriteController.getFavorites);

module.exports = router;
