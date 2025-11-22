const pool = require('../../database/db');
const emailToIdCache = require('../cache/emailToIdCache');

async function getUserIdsByEmails(client, emails) {
  if (!emails.length) return [];

  const uniqueEmails = [...new Set(emails)];
  const ids = [];
  const emailsToFetch = [];

  for (const email of uniqueEmails) {
    if (emailToIdCache.has(email)) {
      ids.push({ email, id: emailToIdCache.get(email) });
    } else {
      emailsToFetch.push(email);
    }
  }

  if (emailsToFetch.length > 0) {
    const query = `
      SELECT id, email
      FROM users
      WHERE email = ANY($1)
    `;
    const result = await client.query(query, [emailsToFetch]);

    const fetchedMap = new Map(result.rows.map(row => [row.email, row.id]));

    // Ensure all emails found, else throw
    for (const email of emailsToFetch) {
      if (!fetchedMap.has(email)) {
        throw new Error(`User not found for email: ${email}`);
      }
      emailToIdCache.set(email, fetchedMap.get(email));
      ids.push({ email, id: fetchedMap.get(email) });
    }
  }

  // Return ids in input order
  const emailToIdMap = new Map(ids.map(({ email, id }) => [email, id]));
  return emails.map(email => emailToIdMap.get(email));
}

async function batchInsert(client, tableName, columns, values, chunkSize = 1000) {
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize);
    const params = [];
    const valueStrings = chunk.map((row, rowIndex) => {
      const rowPlaceholders = row.map((_, colIndex) => `$${rowIndex * row.length + colIndex + 1}`);
      params.push(...row);
      return `(${rowPlaceholders.join(', ')})`;
    });

    const query = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES ${valueStrings.join(', ')}
    `;

    await client.query(query, params);
  }
}

async function createTeam({ img, team_name, sport, description, email, trainers, athletes }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const [owner_user_id] = await getUserIdsByEmails(client, [email]);
    const uniqueTrainers = [...new Set(trainers)];
    const uniqueAthletes = [...new Set(athletes)];
    const trainer_user_ids = await getUserIdsByEmails(client, uniqueTrainers);
    const athlete_user_ids = await getUserIdsByEmails(client, uniqueAthletes);

    const insertTeamText = `
      INSERT INTO teams (img, team_name, sport, description, owner_user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING team_id
    `;
    const teamResult = await client.query(insertTeamText, [img, team_name, sport, description, owner_user_id]);
    const team_id = teamResult.rows[0].team_id;

    if (trainer_user_ids.length) {
      const trainerRows = trainer_user_ids.map(id => [team_id, id]);
      await batchInsert(client, 'team_trainers', ['team_id', 'trainer_user_id'], trainerRows);
    }

    if (athlete_user_ids.length) {
      const athleteRows = athlete_user_ids.map(id => [team_id, id]);
      await batchInsert(client, 'team_athletes', ['team_id', 'athlete_user_id'], athleteRows);
    }

    await client.query('COMMIT');

    return { team_id };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Implement similar for read, update, delete, and fetching teams by email...

async function getTeamById(team_id) {
  const client = await pool.connect();

  try {
    const teamRes = await client.query(
      `SELECT team_id, img, team_name, sport, description, owner_user_id FROM teams WHERE team_id = $1`,
      [team_id]
    );

    if (!teamRes.rows.length) return null;

    const team = teamRes.rows[0];

    const [trainersRes, athletesRes] = await Promise.all([
      client.query(
        `SELECT u.email FROM team_trainers tt JOIN users u ON tt.trainer_user_id = u.id WHERE tt.team_id = $1`,
        [team_id]
      ),
      client.query(
        `SELECT u.email FROM team_athletes ta JOIN users u ON ta.athlete_user_id = u.id WHERE ta.team_id = $1`,
        [team_id]
      )
    ]);

    return {
      ...team,
      trainers: trainersRes.rows.map(r => r.email),
      athletes: athletesRes.rows.map(r => r.email),
    };
  } finally {
    client.release();
  }
}

async function getAllTeams(limit = 100) {
  const client = await pool.connect();

  try {
    const res = await client.query(
      `SELECT team_id, img, team_name, sport, description, owner_user_id FROM teams ORDER BY team_id DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  } finally {
    client.release();
  }
}

async function updateTeam(team_id, { img, team_name, sport, description, trainers, athletes }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Build update query
    const fields = [];
    const values = [];
    let idx = 1;

    if (img !== undefined) {
      fields.push(`img = $${idx++}`);
      values.push(img);
    }
    if (team_name !== undefined) {
      fields.push(`team_name = $${idx++}`);
      values.push(team_name);
    }
    if (sport !== undefined) {
      fields.push(`sport = $${idx++}`);
      values.push(sport);
    }
    if (description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(description);
    }

    if (fields.length) {
      const query = `UPDATE teams SET ${fields.join(', ')} WHERE team_id = $${idx}`;
      values.push(team_id);
      await client.query(query, values);
    }

    // Update trainers if provided
    if (trainers) {
      await client.query(`DELETE FROM team_trainers WHERE team_id = $1`, [team_id]);
      const uniqueTrainers = [...new Set(trainers)];
      if (uniqueTrainers.length) {
        const trainer_user_ids = await getUserIdsByEmails(client, uniqueTrainers);
        const trainerRows = trainer_user_ids.map(id => [team_id, id]);
        await batchInsert(client, 'team_trainers', ['team_id', 'trainer_user_id'], trainerRows);
      }
    }

    // Update athletes if provided
    if (athletes) {
      await client.query(`DELETE FROM team_athletes WHERE team_id = $1`, [team_id]);
      const uniqueAthletes = [...new Set(athletes)];
      if (uniqueAthletes.length) {
        const athlete_user_ids = await getUserIdsByEmails(client, uniqueAthletes);
        const athleteRows = athlete_user_ids.map(id => [team_id, id]);
        await batchInsert(client, 'team_athletes', ['team_id', 'athlete_user_id'], athleteRows);
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteTeam(team_id) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`DELETE FROM team_trainers WHERE team_id = $1`, [team_id]);
    await client.query(`DELETE FROM team_athletes WHERE team_id = $1`, [team_id]);
    const deleteRes = await client.query(`DELETE FROM teams WHERE team_id = $1`, [team_id]);

    if (deleteRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return false;
    }

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getTeamsByEmail(email) {
  const client = await pool.connect();

  try {
    const [user_id] = await getUserIdsByEmails(client, [email]);

    const query = `
      SELECT t.team_name
      FROM teams t
      WHERE t.owner_user_id = $1

      UNION

      SELECT t.team_name
      FROM team_trainers tt
      JOIN teams t ON tt.team_id = t.team_id
      WHERE tt.trainer_user_id = $1

      UNION

      SELECT t.team_name
      FROM team_athletes ta
      JOIN teams t ON ta.team_id = t.team_id
      WHERE ta.athlete_user_id = $1
    `;

    const result = await client.query(query, [user_id]);

    const seen = new Set();
    return result.rows
      .map(r => r.team_name)
      .filter(name => {
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
  } finally {
    client.release();
  }
}

  async function fetchTrainers(teamId) {
  const query = `
    SELECT u.id, u.email, u.name
    FROM team_trainers tt
    JOIN users u ON tt.trainer_user_id = u.id
    WHERE tt.team_id = $1
  `;
  const result = await pool.query(query, [teamId]);
  return result.rows;
};

// const fetchAthletes = async (teamId) => {
  async function fetchAthletes(teamId) {
  const query = `
    SELECT u.id, u.email, u.name
    FROM team_athletes ta
    JOIN users u ON ta.athlete_user_id = u.id
    WHERE ta.team_id = $1
  `;
  const result = await pool.query(query, [teamId]);
  return result.rows;
};
 
async function getUserIdsByEmails(client, emails) {
  if (!emails.length) return [];

  const placeholders = emails.map((_, idx) => `$${idx + 1}`).join(', ');
  const query = `SELECT id, email FROM users WHERE email IN (${placeholders})`;
  const result = await client.query(query, emails);

  const foundEmails = result.rows.map(row => row.email);
  const notFound = emails.filter(email => !foundEmails.includes(email));

  if (notFound.length > 0) {
    const error = new Error(`Users not found for emails: ${notFound.join(', ')}`);
    error.status = 400;
    throw error;
  }

  return result.rows.map(row => row.id);
}


async function editTeam({ teamId, img, team_name, sport, description, owner, trainers, athletes }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get user IDs for emails
    const [owner_user_id] = await getUserIdsByEmails(client, [owner]);
    const uniqueTrainers = [...new Set(trainers)];
    const uniqueAthletes = [...new Set(athletes)];
    const trainer_user_ids = await getUserIdsByEmails(client, uniqueTrainers);
    const athlete_user_ids = await getUserIdsByEmails(client, uniqueAthletes);

    // Ensure team exists
    const teamCheck = await client.query('SELECT * FROM teams WHERE team_id = $1', [teamId]);
    if (teamCheck.rows.length === 0) {
      const error = new Error('Team not found');
      error.status = 404;
      throw error;
    }

    // Update team info + owner
    const updateQuery = `
      UPDATE teams 
      SET img = $1, team_name = $2, sport = $3, description = $4, owner_user_id = $5
      WHERE team_id = $6
    `;
    await client.query(updateQuery, [img, team_name, sport, description, owner_user_id, teamId]);

    // Clear existing trainers & insert new ones
    await client.query('DELETE FROM team_trainers WHERE team_id = $1', [teamId]);
    if (trainer_user_ids.length > 0) {
      const trainerRows = trainer_user_ids.map(id => [teamId, id]);
      await batchInsert(client, 'team_trainers', ['team_id', 'trainer_user_id'], trainerRows);
    }

    // Clear existing athletes & insert new ones
    await client.query('DELETE FROM team_athletes WHERE team_id = $1', [teamId]);
    if (athlete_user_ids.length > 0) {
      const athleteRows = athlete_user_ids.map(id => [teamId, id]);
      await batchInsert(client, 'team_athletes', ['team_id', 'athlete_user_id'], athleteRows);
    }

    await client.query('COMMIT');

    // Return updated team
    const updatedTeamResult = await client.query(
      `
      SELECT 
        t.team_id, t.team_name, t.sport, t.description, t.img, t.owner_user_id,
        ARRAY_AGG(DISTINCT tt.trainer_user_id) AS trainer_ids,
        ARRAY_AGG(DISTINCT ta.athlete_user_id) AS athlete_ids
      FROM teams t
      LEFT JOIN team_trainers tt ON t.team_id = tt.team_id
      LEFT JOIN team_athletes ta ON t.team_id = ta.team_id
      WHERE t.team_id = $1
      GROUP BY t.team_id
      `,
      [teamId]
    );

    return updatedTeamResult.rows[0];

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}


// exports.exitTeam = async ({ teamId, userEmail }) => {
  async function exitTeam({ teamId, userEmail }) {
  // Fetch team
  const teamResult = await pool.query('SELECT * FROM teams WHERE team_id = $1', [teamId]);
  if (teamResult.rows.length === 0) {
    const error = new Error('Team not found');
    error.status = 404;
    throw error;
  }
  const team = teamResult.rows[0];

  // Fetch user
  const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [userEmail]);
  if (userResult.rows.length === 0) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  const userId = userResult.rows[0].id;

  // Owner cannot exit
  if (team.owner_user_id === userId) {
    const error = new Error('Team owner cannot exit without transferring ownership');
    error.status = 403;
    throw error;
  }

  // Remove from trainers if present
  const trainerResult = await pool.query(
    'SELECT * FROM team_trainers WHERE team_id = $1 AND trainer_user_id = $2',
    [teamId, userId]
  );
  if (trainerResult.rows.length > 0) {
    await pool.query('DELETE FROM team_trainers WHERE team_id = $1 AND trainer_user_id = $2', [teamId, userId]);
    return 'Trainer removed from team';
  }

  // Remove from athletes if present
  const athleteResult = await pool.query(
    'SELECT * FROM team_athletes WHERE team_id = $1 AND athlete_user_id = $2',
    [teamId, userId]
  );
  if (athleteResult.rows.length > 0) {
    await pool.query('DELETE FROM team_athletes WHERE team_id = $1 AND athlete_user_id = $2', [teamId, userId]);
    return 'Athlete removed from team';
  }

  const error = new Error('User is not a member of this team');
  error.status = 404;
  throw error;
};
async function getTeamsWithDetailsByEmail(email) {
  const client = await pool.connect();

  try {
    const [user_id] = await getUserIdsByEmails(client, [email]);

    // Get all teams where the user is owner, trainer, or athlete
    const query = `
      SELECT DISTINCT
        t.team_id,
        t.team_name,
        t.sport,
        t.description,
        t.img,
        t.owner_user_id AS owner_id,
        uo.email AS owner_email,
        uo.name AS owner_name
      FROM teams t
      JOIN users uo ON t.owner_user_id = uo.id
      LEFT JOIN team_trainers tt ON tt.team_id = t.team_id
      LEFT JOIN team_athletes ta ON ta.team_id = t.team_id
      WHERE t.owner_user_id = $1 OR tt.trainer_user_id = $1 OR ta.athlete_user_id = $1
      ORDER BY t.team_id DESC
    `;

    const teamsRes = await client.query(query, [user_id]);
    const teams = [];

    for (const team of teamsRes.rows) {
      // Fetch trainers and athletes for each team
      const [trainersRes, athletesRes] = await Promise.all([
        client.query(
          `SELECT u.id, u.name, u.email
           FROM team_trainers tt
           JOIN users u ON tt.trainer_user_id = u.id
           WHERE tt.team_id = $1`,
          [team.team_id]
        ),
        client.query(
          `SELECT u.id, u.name, u.email
           FROM team_athletes ta
           JOIN users u ON ta.athlete_user_id = u.id
           WHERE ta.team_id = $1`,
          [team.team_id]
        ),
      ]);

      teams.push({
        ...team,
        trainers: trainersRes.rows,
        athletes: athletesRes.rows,
      });
    }

    return teams;
  } finally {
    client.release();
  }
}




module.exports = {
  createTeam,
  getTeamById,
  getAllTeams,
  updateTeam,
  deleteTeam,
  getTeamsByEmail,
  fetchTrainers,
  fetchAthletes,
  editTeam,
  exitTeam,
  getTeamsWithDetailsByEmail,
};
