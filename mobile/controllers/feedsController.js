// const pool = require('../../database/db');
// const { uploadToAzure } = require('../services/blobService');

// exports.uploadImage = async (req, res) => {
//   const { file } = req;
//   if (!file) return res.status(400).json({ message: 'No file uploaded' });

//   try {
//     const imageUrl = await uploadToAzure(file);
//     res.json({ imageUrl });
//   } catch (err) {
//     console.error('Azure upload error:', err);
//     res.status(500).json({ message: 'Failed to upload image' });
//   }
// };

// exports.createFeed = async (req, res) => {
//   const { user_id, description, image_url } = req.body;
//   const created_at = new Date();

//   try {
//     const result = await pool.query(
//       'INSERT INTO feeds (user_id, description, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) RETURNING id',
//       [user_id, description, image_url, created_at]
//     );
//     res.status(201).json({ feedId: result.rows[0].id });
//   } catch (err) {
//     console.error('DB insert error:', err);
//     res.status(500).json({ message: 'Failed to create feed' });
//   }
// };

// exports.getFeedById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('SELECT * FROM feeds WHERE id = $1', [id]);
//     if (result.rows.length === 0) return res.status(404).json({ message: 'Feed not found' });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('DB query error:', err);
//     res.status(500).json({ message: 'Error fetching feed' });
//   }
// };

// exports.getFeedsByUser = async (req, res) => {
//   const { user_id } = req.params;
//   try {
//     const result = await pool.query('SELECT * FROM feeds WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('DB query error:', err);
//     res.status(500).json({ message: 'Error fetching user feeds' });
//   }
// };

// exports.getFeedsForAllUser = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM feeds ORDER BY created_at DESC');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('DB query error:', err);
//     res.status(500).json({ message: 'Error fetching user feeds' });
//   }
// };

// exports.updateFeed = async (req, res) => {
//   const { id } = req.params;
//   const { description, image_url } = req.body;
//   const updated_at = new Date();

//   try {
//     const result = await pool.query(
//       'UPDATE feeds SET description = $1, image_url = $2, updated_at = $3 WHERE id = $4 RETURNING *',
//       [description, image_url, updated_at, id]
//     );
//     if (result.rowCount === 0) return res.status(404).json({ message: 'Feed not found' });
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('DB update error:', err);
//     res.status(500).json({ message: 'Failed to update feed' });
//   }
// };

// exports.deleteFeed = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query('DELETE FROM feeds WHERE id = $1', [id]);
//     if (result.rowCount === 0) return res.status(404).json({ message: 'Feed not found' });
//     res.json({ message: 'Feed deleted successfully' });
//   } catch (err) {
//     console.error('DB delete error:', err);
//     res.status(500).json({ message: 'Failed to delete feed' });
//   }
// };

const pool = require("../../database/db");
const { uploadToAzure } = require("../services/blobService");

// Upload image to Azure Blob Storage
exports.uploadImage = async (req, res) => {
  const { file } = req;
  if (!file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const imageUrl = await uploadToAzure(file);
    res.json({ imageUrl });
  } catch (err) {
    console.error("Azure upload error:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

// Create a new feed
exports.createFeed = async (req, res) => {
  const { user_email, description, image_url } = req.body;
  const created_at = new Date();

  try {
    const result = await pool.query(
      "INSERT INTO feeds (user_email, description, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $4) RETURNING id",
      [user_email, description, image_url, created_at]
    );
    res.status(201).json({ feedId: result.rows[0].id });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ message: "Failed to create feed" });
  }
};

// Get a feed by ID
exports.getFeedById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM feeds WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Feed not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ message: "Error fetching feed" });
  }
};

// Get all feeds by a user's email
exports.getFeedsByUser = async (req, res) => {
  const { user_email } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM feeds WHERE user_email = $1 ORDER BY created_at DESC",
      [user_email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ message: "Error fetching user feeds" });
  }
};

// Get all feeds
exports.getFeedsForAllUser = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM feeds ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ message: "Error fetching feeds" });
  }
};

// Update a feed by ID
exports.updateFeed = async (req, res) => {
  const { id } = req.params;
  const { description, image_url } = req.body;
  const updated_at = new Date();

  try {
    const result = await pool.query(
      "UPDATE feeds SET description = $1, image_url = $2, updated_at = $3 WHERE id = $4 RETURNING *",
      [description, image_url, updated_at, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Feed not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DB update error:", err);
    res.status(500).json({ message: "Failed to update feed" });
  }
};

// Delete a feed by ID
exports.deleteFeed = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM feeds WHERE id = $1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Feed not found" });
    res.json({ message: "Feed deleted successfully" });
  } catch (err) {
    console.error("DB delete error:", err);
    res.status(500).json({ message: "Failed to delete feed" });
  }
};

// Like a feed
exports.likeFeed = async (req, res) => {
  const { user_email } = req.body;
  const { feed_id } = req.params;

  try {
    // Check if the user has already liked the feed
    const existingLike = await pool.query(
      "SELECT * FROM feeds_likes WHERE user_email = $1 AND feed_id = $2",
      [user_email, feed_id]
    );

    if (existingLike.rows.length > 0) {
      return res.status(400).json({ message: "User already liked this feed" });
    }

    // Insert new like
    await pool.query(
      "INSERT INTO feeds_likes (user_email, feed_id) VALUES ($1, $2)",
      [user_email, feed_id]
    );

    res.status(200).json({ message: "Feed liked successfully" });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ message: "Failed to like feed" });
  }
};

// Unlike a feed
exports.unlikeFeed = async (req, res) => {
  const { user_email } = req.body;
  const { feed_id } = req.params;

  try {
    // Check if the like exists
    const existingLike = await pool.query(
      "SELECT * FROM feeds_likes WHERE user_email = $1 AND feed_id = $2",
      [user_email, feed_id]
    );

    if (existingLike.rows.length === 0) {
      return res.status(404).json({ message: "Like not found" });
    }

    // Delete the like
    await pool.query(
      "DELETE FROM feeds_likes WHERE user_email = $1 AND feed_id = $2",
      [user_email, feed_id]
    );

    res.status(200).json({ message: "Feed unliked successfully" });
  } catch (err) {
    console.error("DB delete error:", err);
    res.status(500).json({ message: "Failed to unlike feed" });
  }
};

// Add a comment to a feed
exports.addComment = async (req, res) => {
  const { user_email, comment } = req.body;
  const { feed_id } = req.params;

  try {
    // Insert the new comment
    const result = await pool.query(
      "INSERT INTO feeds_comments (user_email, feed_id, comment) VALUES ($1, $2, $3) RETURNING id",
      [user_email, feed_id, comment]
    );

    res
      .status(201)
      .json({
        commentId: result.rows[0].id,
        message: "Comment added successfully",
      });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get all comments for a feed
exports.getCommentsForFeed = async (req, res) => {
  const { feed_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM feeds_comments WHERE feed_id = $1 ORDER BY created_at DESC",
      [feed_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Get like count for a feed
exports.getLikeCount = async (req, res) => {
  const { feed_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS like_count FROM feeds_likes WHERE feed_id = $1",
      [feed_id]
    );
    res.json({ likeCount: result.rows[0].like_count });
  } catch (err) {
    console.error("DB query error:", err);
    res.status(500).json({ message: "Failed to get like count" });
  }
};
