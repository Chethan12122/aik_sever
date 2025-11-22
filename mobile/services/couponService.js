// const pool = require("../../database/db");
// const roleService = require("./roleService");
// const crypto = require("crypto");

// function generateCouponCode() {
//   // Simple example: 8 chars alphanumeric
//   return crypto.randomBytes(4).toString("hex").toUpperCase();
// }

// async function createCoupon(email, expiresAt) {
//   // Keep generating till unique coupon_code found (handle rare collisions)
//   let couponCode;
//   let isUnique = false;
//   while (!isUnique) {
//     couponCode = generateCouponCode();
//     const { rows } = await pool.query("SELECT 1 FROM coupons WHERE coupon_code=$1", [couponCode]);
//     if (rows.length === 0) isUnique = true;
//   }

//   const query = `
//     INSERT INTO coupons (coupon_code, user_email, expires_at)
//     VALUES ($1, $2, $3)
//     RETURNING *;
//   `;
//   const values = [couponCode, email, expiresAt];
//   const result = await pool.query(query, values);

//   return result.rows[0];
// }

// async function getCouponsByUser(email) {
//   const query = `SELECT * FROM coupons WHERE user_email = $1 ORDER BY issued_at DESC`;
//   const { rows } = await pool.query(query, [email]);
//   return rows;
// }

// async function expireAndUpdateRoles() {
//   // Find expired coupons not redeemed yet
//   const now = new Date();
//   const query = `
//     SELECT coupon_code, user_email FROM coupons
//     WHERE expires_at <= $1 AND redeemed = FALSE
//   `;
//   const { rows } = await pool.query(query, [now]);

//   for (const coupon of rows) {
//     try {
//       // Update role to athlete
//       await roleService.updateRole(coupon.user_email, "athlete");

//       // Mark coupon as redeemed to avoid multiple updates
//       await pool.query(`UPDATE coupons SET redeemed = TRUE WHERE coupon_code = $1`, [coupon.coupon_code]);

//       console.log(`Updated role for user ${coupon.user_email} due to coupon expiry.`);
//     } catch (err) {
//       console.error(`Failed to update role for ${coupon.user_email}:`, err);
//     }
//   }
// }

// module.exports = {
//   createCoupon,
//   getCouponsByUser,
//   expireAndUpdateRoles,
// };


const pool = require("../../database/db");
const roleService = require("./roleService");
const crypto = require("crypto");

function generateCouponCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// Step 1: Create coupon without user
async function generateCoupon(expiresAt) {
  let couponCode;
  let isUnique = false;
  while (!isUnique) {
    couponCode = generateCouponCode();
    const { rows } = await pool.query("SELECT 1 FROM coupons WHERE coupon_code=$1", [couponCode]);
    if (rows.length === 0) isUnique = true;
  }

  const query = `
    INSERT INTO coupons (coupon_code, expires_at)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [couponCode, expiresAt];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Step 2: Assign coupon to user and update role
async function assignCouponToUser(email, couponCode) {
  // Check coupon exists and is not assigned
  const checkQuery = `SELECT * FROM coupons WHERE coupon_code = $1 AND user_email IS NULL`;
  const { rows } = await pool.query(checkQuery, [couponCode]);
  if (rows.length === 0) {
    return null; // coupon not found or already assigned
  }

  const updateQuery = `
    UPDATE coupons
    SET user_email = $1
    WHERE coupon_code = $2
    RETURNING *;
  `;
  const values = [email, couponCode];
  const result = await pool.query(updateQuery, values);
  return result.rows[0];
}

async function updateUserRole(email, role) {
  return await roleService.updateRole(email, role);
}

// Expiry check - unchanged (updates role to athlete)
async function expireAndUpdateRoles() {
  const now = new Date();
  const query = `
    SELECT coupon_code, user_email FROM coupons
    WHERE expires_at <= $1 AND redeemed = FALSE AND user_email IS NOT NULL
  `;
  const { rows } = await pool.query(query, [now]);

  for (const coupon of rows) {
    try {
      await roleService.updateRole(coupon.user_email, "athlete");
      await pool.query(`UPDATE coupons SET redeemed = TRUE WHERE coupon_code = $1`, [coupon.coupon_code]);
      console.log(`Updated role for user ${coupon.user_email} due to coupon expiry.`);
    } catch (err) {
      console.error(`Failed to update role for ${coupon.user_email}:`, err);
    }
  }
}

async function getCouponsByUserEmail(email) {
  const query = `
    SELECT coupon_code, expires_at, redeemed 
    FROM coupons 
    WHERE user_email = $1
    ORDER BY expires_at DESC
  `;
  const { rows } = await pool.query(query, [email]);
  return rows;
}

// module.exports.getCouponsByUserEmail = getCouponsByUserEmail;

async function updateExpiryDateByEmail(email, newExpiresAt) {
  // Assuming only one active coupon per user, update the latest unredeemed coupon expiry date
//   const query = `
//     UPDATE coupons
//     SET expires_at = $1, redeemed = FALSE
//     WHERE user_email = $2 AND redeemed = FALSE
//     RETURNING *;
//   `;
  const query = `
    UPDATE coupons
    SET expires_at = $1, redeemed = FALSE
    WHERE user_email = $2 
    RETURNING *;
  `;
  const values = [newExpiresAt, email];
  const result = await pool.query(query, values);
  return result.rows[0]; // undefined if none found
}

// module.exports.updateExpiryDateByEmail = updateExpiryDateByEmail;

module.exports = {
  generateCoupon,
  assignCouponToUser,
  updateUserRole,
  expireAndUpdateRoles,
  getCouponsByUserEmail,
  updateExpiryDateByEmail
};
