const pool = require('../../database/db');

async function createWorkout(workout) {
  const query = `
    INSERT INTO workouts (
      duration, image, title, description, level, video, steps, outcomes, category,
      is_performance_test, device_support, device_config, device_mode
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9,
      $10, $11, $12, $13
    )
    RETURNING *;
  `;

  const values = [
    workout.duration,
    workout.image || null,
    workout.title,
    workout.description || null,
    workout.level,
    workout.video || null,
    workout.steps ? JSON.stringify(workout.steps) : null,
    workout.outcomes ? JSON.stringify(workout.outcomes) : null,
    workout.category,
    workout.is_performance_test === undefined ? false : workout.is_performance_test,
    workout.device_support === undefined ? 0 : workout.device_support,
    workout.device_config === undefined ? false : workout.device_config,
    workout.device_mode || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getWorkouts(filters) {
  const whereClauses = [];
  const values = [];
  let idx = 1;

  if (filters.level) {
    whereClauses.push(`level = $${idx++}`);
    values.push(filters.level);
  }
  if (filters.category) {
    whereClauses.push(`category = $${idx++}`);
    values.push(filters.category);
  }
  if (filters.device_mode) {
    whereClauses.push(`device_mode = $${idx++}`);
    values.push(filters.device_mode);
  }
  if (filters.is_performance_test !== undefined) {
    whereClauses.push(`is_performance_test = $${idx++}`);
    values.push(filters.is_performance_test === "true");
  }
  if (filters.device_support !== undefined) {
    whereClauses.push(`device_support = $${idx++}`);
    values.push(parseInt(filters.device_support));
  }
  if (filters.device_config !== undefined) {
    whereClauses.push(`device_config = $${idx++}`);
    values.push(filters.device_config === "true");
  }
  if (filters.title) {
    whereClauses.push(`title ILIKE $${idx++}`);
    values.push(`%${filters.title}%`);
  }
  if (filters.created_from) {
    whereClauses.push(`created_at >= $${idx++}`);
    values.push(new Date(filters.created_from));
  }
  if (filters.created_to) {
    whereClauses.push(`created_at < $${idx++}`);
    values.push(new Date(filters.created_to));
  }
  if (filters.min_duration) {
    whereClauses.push(`duration >= $${idx++}`);
    values.push(parseInt(filters.min_duration));
  }
  if (filters.max_duration) {
    whereClauses.push(`duration <= $${idx++}`);
    values.push(parseInt(filters.max_duration));
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const limit = Math.min(parseInt(filters.limit) || 50, 100);
  const offset = parseInt(filters.offset) || 0;

  const query = `
    SELECT *
    FROM workouts
    ${whereSQL}
    ORDER BY created_at DESC
    LIMIT $${idx++} OFFSET $${idx++};
  `;

  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
}

async function updateWorkout(workoutId, updates) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(updates)) {
    if (key === "steps" || key === "outcomes") {
      fields.push(`${key} = $${idx++}::jsonb`);
      values.push(JSON.stringify(val));
    } else {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  if (fields.length === 0) return null;

  values.push(workoutId);

  const query = `
    UPDATE workouts
    SET ${fields.join(", ")}
    WHERE workout_id = $${idx}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteWorkout(workoutId) {
  const result = await pool.query(
    "DELETE FROM workouts WHERE workout_id = $1 RETURNING *;",
    [workoutId]
  );
  return result.rows.length > 0;
}

module.exports = {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
};
