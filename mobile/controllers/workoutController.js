const workoutService = require("../services/workoutService");
const {
  allowedLevels,
  allowedCategories,
  allowedDeviceModes,
  allowedDeviceSupport,
  validateWorkoutPayload,
  validateWorkoutFilters,
  safeParseJson,
} = require("../utils/validation");

async function createWorkout(req, res) {
  try {
    const {
      duration,
      image,
      title,
      description,
      level,
      video,
      steps,
      outcomes,
      category,
      is_performance_test,
      device_support,
      device_config,
      device_mode,
    } = req.body;

    // Validate required fields & enums, numeric/boolean fields
    const validationError = validateWorkoutPayload(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    // Parse JSON fields
    let parsedSteps, parsedOutcomes;
    try {
      parsedSteps = steps ? safeParseJson(steps, "Steps") : null;
      parsedOutcomes = outcomes ? safeParseJson(outcomes, "Outcomes") : null;
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const workout = await workoutService.createWorkout({
      duration,
      image,
      title,
      description,
      level,
      video,
      steps: parsedSteps,
      outcomes: parsedOutcomes,
      category,
      is_performance_test,
      device_support,
      device_config,
      device_mode,
    });

    return res.status(201).json({ message: "Workout created successfully.", workout });
  } catch (err) {
    console.error("Workout insertion error:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Duplicate workout title detected." });
    }
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

async function getWorkouts(req, res) {
  try {
    const filters = req.query;

    // Validate filters
    const validationError = validateWorkoutFilters(filters);
    if (validationError) return res.status(400).json({ error: validationError });

    const workouts = await workoutService.getWorkouts(filters);
    return res.json({ workouts });
  } catch (err) {
    console.error("Error fetching workouts:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

async function updateWorkout(req, res) {
  try {
    const workoutId = parseInt(req.params.id);
    if (isNaN(workoutId) || workoutId <= 0) {
      return res.status(400).json({ error: "Invalid workout ID." });
    }

    const updates = req.body;

    // Validate update fields
    const validationError = validateWorkoutPayload(updates, true);
    if (validationError) return res.status(400).json({ error: validationError });

    // Parse JSON fields if present
    try {
      if (updates.steps) updates.steps = safeParseJson(updates.steps, "Steps");
      if (updates.outcomes) updates.outcomes = safeParseJson(updates.outcomes, "Outcomes");
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const updatedWorkout = await workoutService.updateWorkout(workoutId, updates);

    if (!updatedWorkout) {
      return res.status(404).json({ error: "Workout not found." });
    }

    return res.json({ message: "Workout updated successfully.", workout: updatedWorkout });
  } catch (err) {
    console.error("Workout update error:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Duplicate workout title detected." });
    }
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

async function deleteWorkout(req, res) {
  try {
    const workoutId = parseInt(req.params.id);
    if (isNaN(workoutId) || workoutId <= 0) {
      return res.status(400).json({ error: "Invalid workout ID." });
    }

    const deleted = await workoutService.deleteWorkout(workoutId);
    if (!deleted) {
      return res.status(404).json({ error: "Workout not found." });
    }

    return res.json({ message: "Workout deleted successfully." });
  } catch (err) {
    console.error("Workout deletion error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

module.exports = {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
};
