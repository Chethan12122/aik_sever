const followService = require('../services/followService');

async function sendFollowRequest(req, res) {
  try {
    const { followerEmail, followingEmail } = req.body;
    const result = await followService.sendFollowRequest(followerEmail, followingEmail);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function acceptFollowRequest(req, res) {
  try {
    const { followingEmail, followerEmail } = req.body;
    const result = await followService.acceptFollowRequest(followingEmail, followerEmail);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function rejectFollowRequest(req, res) {
  try {
    const { followingEmail, followerEmail } = req.body;
    const result = await followService.rejectFollowRequest(followingEmail, followerEmail);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function unfollow(req, res) {
  try {
    const { followerEmail, followingEmail } = req.body;
    const result = await followService.unfollow(followerEmail, followingEmail);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getFollowers(req, res) {
  try {
    const { email } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const followers = await followService.getFollowers(email, limit, offset);
    res.status(200).json({ followers });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getFollowing(req, res) {
  try {
    const { email } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const following = await followService.getFollowing(email, limit, offset);
    res.status(200).json({ following });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getFollowStatus(req, res) {
  try {
    // const { followerEmail, followingEmail } = req.query;
    const { followerEmail, followingEmail } = req.body;

    if (!followerEmail || !followingEmail) {
      return res.status(400).json({ error: 'Missing emails' });
    }

    const result = await followService.getFollowStatus(followerEmail, followingEmail);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
