const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");

router.post("/workout", workoutController.createWorkout);
router.get("/workout", workoutController.getWorkouts);
router.put("/workout/:id", workoutController.updateWorkout);
router.delete("/workout/:id", workoutController.deleteWorkout);

module.exports = router;
