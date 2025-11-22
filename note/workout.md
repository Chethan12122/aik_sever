
*******************   CODE FOR THE WORKOUT TABLE  *******************
*********************   PARTITIONING  *******************************
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workout_level') THEN
        CREATE TYPE workout_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workout_category') THEN
        CREATE TYPE workout_category AS ENUM ('Cardio', 'Strength', 'Flexibility', 'Balance', 'Other');
    END IF;
END$$;

CREATE TABLE workouts (
    workout_id BIGSERIAL NOT NULL,                   
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,   
    duration SMALLINT NOT NULL,
    image VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level workout_level NOT NULL,
    video VARCHAR(255),
    steps JSONB,
    outcomes JSONB,
    category workout_category NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(workout_id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE workouts_2025_q1 PARTITION OF workouts
    FOR VALUES FROM ('2025-01-01 00:00:00+00') TO ('2025-04-01 00:00:00+00');

CREATE TABLE workouts_2025_q2 PARTITION OF workouts
    FOR VALUES FROM ('2025-04-01 00:00:00+00') TO ('2025-07-01 00:00:00+00');

CREATE TABLE workouts_2025_q3 PARTITION OF workouts
    FOR VALUES FROM ('2025-07-01 00:00:00+00') TO ('2025-10-01 00:00:00+00');

CREATE TABLE workouts_2025_q4 PARTITION OF workouts
    FOR VALUES FROM ('2025-10-01 00:00:00+00') TO ('2026-01-01 00:00:00+00');

CREATE TABLE workouts_default PARTITION OF workouts DEFAULT;

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_category ON workouts(category);
CREATE INDEX idx_workouts_level ON workouts(level);
CREATE INDEX idx_workouts_created_at ON workouts(created_at);

CREATE INDEX idx_workouts_steps_gin ON workouts USING GIN (steps);
CREATE INDEX idx_workouts_outcomes_gin ON workouts USING GIN (outcomes);

ALTER TABLE workouts ADD CONSTRAINT unique_user_title UNIQUE (user_id, title, created_at);
*********************************************************************************************


************************** REMOVED PARTITIONING  *************************************
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workout_level') THEN
        CREATE TYPE workout_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workout_category') THEN
        CREATE TYPE workout_category AS ENUM ('Cardio', 'Strength', 'Flexibility', 'Balance', 'Other');
    END IF;
END$$;

CREATE TABLE workouts (
    workout_id BIGSERIAL NOT NULL,                   
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,   
    duration SMALLINT NOT NULL,
    image VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level workout_level NOT NULL,
    video VARCHAR(255),
    steps JSONB,
    outcomes JSONB,
    category workout_category NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(workout_id, created_at),
    CONSTRAINT unique_user_title UNIQUE (user_id, title, created_at)
);

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_category ON workouts(category);
CREATE INDEX idx_workouts_level ON workouts(level);
CREATE INDEX idx_workouts_created_at ON workouts(created_at);

CREATE INDEX idx_workouts_steps_gin ON workouts USING GIN (steps);
CREATE INDEX idx_workouts_outcomes_gin ON workouts USING GIN (outcomes);

***************************************************************************


************ getting the workouts
const express = require('express');
const pool = require('../database/db'); // Your pg Pool instance
const router = express.Router();

const allowedLevels = ['Beginner', 'Intermediate', 'Advanced'];
const allowedCategories = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Other'];

router.get('/workouts', async (req, res) => {
  try {
    // Extract filters from query parameters
    const {
      user_id,
      level,
      category,
      title,
      created_from,
      created_to,
      min_duration,
      max_duration,
      limit = 50,
      offset = 0,
    } = req.query;

    // Prepare parts for dynamic query
    const whereClauses = [];
    const values = [];
    let idx = 1;

    // Filter by user_id (optional)
    if (user_id) {
      whereClauses.push(`user_id = $${idx++}`);
      values.push(parseInt(user_id));
    }

    // Filter by level (optional)
    if (level) {
      if (!allowedLevels.includes(level)) {
        return res.status(400).json({ error: `Invalid level filter. Allowed: ${allowedLevels.join(', ')}` });
      }
      whereClauses.push(`level = $${idx++}`);
      values.push(level);
    }

    // Filter by category (optional)
    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: `Invalid category filter. Allowed: ${allowedCategories.join(', ')}` });
      }
      whereClauses.push(`category = $${idx++}`);
      values.push(category);
    }

    // Filter by title (optional, partial match)
    if (title) {
      whereClauses.push(`title ILIKE $${idx++}`);
      values.push(`%${title}%`);
    }

    // Filter by created_at range (optional)
    if (created_from) {
      whereClauses.push(`created_at >= $${idx++}`);
      values.push(new Date(created_from));
    }

    if (created_to) {
      whereClauses.push(`created_at < $${idx++}`);
      values.push(new Date(created_to));
    }

    // Filter by duration range (optional)
    if (min_duration) {
      whereClauses.push(`duration >= $${idx++}`);
      values.push(parseInt(min_duration));
    }

    if (max_duration) {
      whereClauses.push(`duration <= $${idx++}`);
      values.push(parseInt(max_duration));
    }

    // Build the final query string
    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Limit and offset for pagination
    const limitVal = Math.min(parseInt(limit), 100); // max 100 per request
    const offsetVal = parseInt(offset);

    const query = `
      SELECT *
      FROM workouts
      ${whereSQL}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++};
    `;

    values.push(limitVal, offsetVal);

    const { rows } = await pool.query(query, values);

    return res.json({ workouts: rows });

  } catch (err) {
    console.error('Error fetching workouts:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;


Query parameters are all optional — mix & match filters:

/workout?user_id=5 — workouts by user 5

/workout?level=Beginner — beginner workouts only

/workout?category=Strength&min_duration=15 — strength workouts at least 15 mins

/workout?created_from=2025-01-01&created_to=2025-04-01 — workouts in Q1 2025

/workout?title=morning — workouts with "morning" in the title (case-insensitive)

/workout?limit=20&offset=40 — pagination, get 20 workouts starting from 41st