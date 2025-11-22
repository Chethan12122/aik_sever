const pool = require('../../database/db');

// Get user id by email
async function getUserIdByEmail(email) {
  const res = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (res.rowCount === 0) throw new Error('User not found');
  return res.rows[0].id;
}

// ✅ Send Request to join Organization
async function sendRequest(ownerEmail, targetEmail) {
  const orgOwnerId = await getUserIdByEmail(ownerEmail);
  const memberId = await getUserIdByEmail(targetEmail);

    // ✅ Get role from details table
  const resRole = await pool.query(`SELECT role FROM details WHERE email = $1`, [targetEmail]);
  if (resRole.rowCount === 0) throw new Error("Target user role not found");
  const role = resRole.rows[0].role;
  
    if (orgOwnerId === memberId) {
    await pool.query(`
      INSERT INTO organization_members (org_owner_id, member_user_id, role, status)
      VALUES ($1, $2, $3, 'accepted')
      ON CONFLICT (org_owner_id, member_user_id)
      DO UPDATE SET role = $3, status = 'accepted', created_at = NOW()
    `, [orgOwnerId, memberId, role]);

    return { message: 'Trainer added to organization (self)' };
  }




  // Max 3 trainers (owner + 2 trainers)
  if (role === 'trainer') {
    const res = await pool.query(`
      SELECT COUNT(*) FROM organization_members
      WHERE org_owner_id = $1 AND role = 'trainer' AND status = 'accepted'
    `, [orgOwnerId]);

    if (parseInt(res.rows[0].count) >= 2) {
      throw new Error('Maximum 2 trainers allowed per organization');
    }
  }

  await pool.query(`
    INSERT INTO organization_members (org_owner_id, member_user_id, role, status)
    VALUES ($1, $2, $3, 'pending')
    ON CONFLICT (org_owner_id, member_user_id)
    DO UPDATE SET role = $3, status = 'pending', created_at = NOW()
  `, [orgOwnerId, memberId, role]);

  return { message: 'Request sent successfully' };
}

// ✅ Accept Request
async function acceptRequest(ownerEmail, memberEmail) {
  const orgOwnerId = await getUserIdByEmail(ownerEmail);
  const memberId = await getUserIdByEmail(memberEmail);

  const res = await pool.query(`
    UPDATE organization_members
    SET status = 'accepted'
    WHERE org_owner_id = $1 AND member_user_id = $2 AND status = 'pending'
    RETURNING *
  `, [orgOwnerId, memberId]);

  if (res.rowCount === 0) throw new Error('No pending request found');

  return { message: 'Request accepted' };
}

// ✅ Reject Request
async function rejectRequest(ownerEmail, memberEmail) {
  const orgOwnerId = await getUserIdByEmail(ownerEmail);
  const memberId = await getUserIdByEmail(memberEmail);

  const res = await pool.query(`
    UPDATE organization_members
    SET status = 'rejected'
    WHERE org_owner_id = $1 AND member_user_id = $2 AND status = 'pending'
    RETURNING *
  `, [orgOwnerId, memberId]);

  if (res.rowCount === 0) throw new Error('No pending request found');
  return { message: 'Request rejected' };
}

// ✅ Get All Members (pending + accepted)
async function getOrganizationMembers(ownerEmail) {
  const orgOwnerId = await getUserIdByEmail(ownerEmail);

  const res = await pool.query(`
    SELECT u.id, u.name, u.email, om.role, om.status
    FROM organization_members om
    JOIN users u ON om.member_user_id = u.id
    WHERE om.org_owner_id = $1
    ORDER BY om.created_at DESC
  `, [orgOwnerId]);

  return res.rows;
}

async function removeMember(ownerEmail, memberEmail) {
  const orgOwnerId = await getUserIdByEmail(ownerEmail);
  const memberId = await getUserIdByEmail(memberEmail);

  const res = await pool.query(`
    DELETE FROM organization_members
    WHERE org_owner_id = $1 AND member_user_id = $2
    RETURNING *
  `, [orgOwnerId, memberId]);

  if (res.rowCount === 0) throw new Error('No such member found in organization');

  return { message: 'Member removed from organization' };
}

async function getIncomingInvitesService(recipientEmail) {
    const recipientId = await getUserIdByEmail(recipientEmail);

    const query = `
        SELECT 
            u_owner.name AS "ownerName", 
            u_owner.email AS "ownerEmail",
            om.role AS "recipientRole",
            om.status
        FROM organization_members om
        JOIN users u_owner ON om.org_owner_id = u_owner.id
        WHERE om.member_user_id = $1 AND om.status = 'pending'
        ORDER BY om.created_at DESC
    `;

    const result = await pool.query(query, [recipientId]);
    return result.rows;
}

// Service function to get organizations a member belongs to
async function getMemberOrganizations(memberEmail) {
  const memberId = await getUserIdByEmail(memberEmail);

  const res = await pool.query(`
    SELECT om.org_owner_id, u_owner.name AS owner_name, u_owner.email AS owner_email
    FROM organization_members om
    JOIN users u_owner ON om.org_owner_id = u_owner.id
    WHERE om.member_user_id = $1 AND om.status = 'accepted'
  `, [memberId]);

  return res.rows;
}


module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getOrganizationMembers,
  removeMember,
  getIncomingInvitesService,
  getMemberOrganizations,
};
