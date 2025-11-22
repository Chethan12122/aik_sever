const pool = require('../../database/db');
async function getUserIdByEmail(email) {
  const res = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (res.rowCount === 0) throw new Error('User not found');
  return res.rows[0].id;
}

async function sendFollowRequest(followerEmail, followingEmail) {
  const followerId = await getUserIdByEmail(followerEmail);
  const followingId = await getUserIdByEmail(followingEmail);

  if (followerId === followingId) throw new Error('Cannot follow yourself');

  // Upsert the follow request with pending status
  await pool.query(`
    INSERT INTO follows (follower_id, following_id, status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (follower_id, following_id) DO UPDATE SET status = 'pending', created_at = now()
  `, [followerId, followingId]);

  return { message: 'Follow request sent' };
}

async function acceptFollowRequest(followingEmail, followerEmail) {
  // followingEmail is the user accepting the request from followerEmail
  const followingId = await getUserIdByEmail(followingEmail);
  const followerId = await getUserIdByEmail(followerEmail);

  const res = await pool.query(`
    UPDATE follows SET status = 'accepted'
    WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'
    RETURNING *
  `, [followerId, followingId]);

  if (res.rowCount === 0) throw new Error('No pending follow request found');

  return { message: 'Follow request accepted' };
}

async function rejectFollowRequest(followingEmail, followerEmail) {
  const followingId = await getUserIdByEmail(followingEmail);
  const followerId = await getUserIdByEmail(followerEmail);

  const res = await pool.query(`
    UPDATE follows SET status = 'rejected'
    WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'
    RETURNING *
  `, [followerId, followingId]);

  if (res.rowCount === 0) throw new Error('No pending follow request found');

  return { message: 'Follow request rejected' };
}

async function unfollow(followerEmail, followingEmail) {
  const followerId = await getUserIdByEmail(followerEmail);
  const followingId = await getUserIdByEmail(followingEmail);

  const res = await pool.query(`
    DELETE FROM follows
    WHERE follower_id = $1 AND following_id = $2 AND status = 'accepted'
  `, [followerId, followingId]);

  if (res.rowCount === 0) throw new Error('No existing follow relationship');

  return { message: 'Unfollowed successfully' };
}

async function getFollowers(email, limit = 50, offset = 0) {
  const userId = await getUserIdByEmail(email);

  const res = await pool.query(`
    SELECT u.email FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = $1 AND f.status = 'accepted'
    ORDER BY f.created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset]);

  return res.rows.map(row => row.email);
}

async function getFollowing(email, limit = 50, offset = 0) {
  const userId = await getUserIdByEmail(email);

  const res = await pool.query(`
    SELECT u.email FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = $1 AND f.status = 'accepted'
    ORDER BY f.created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset]);

  return res.rows.map(row => row.email);
}

async function getFollowStatus(followerEmail, followingEmail) {
  const followerId = await getUserIdByEmail(followerEmail);
  const followingId = await getUserIdByEmail(followingEmail);

  const res = await pool.query(`
    SELECT status FROM follows
    WHERE follower_id = $1 AND following_id = $2
  `, [followerId, followingId]);

  if (res.rowCount === 0) {
    return { status: null }; // No follow relationship
  }

  return { status: res.rows[0].status };
}


module.exports = {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  unfollow,
  getFollowers,
  getFollowing,
  getFollowStatus
};
