// const couponService = require("../services/couponService");

// async function createCoupon(req, res) {
//   const { email, expiresAt } = req.body;

//   if (!email || !expiresAt) {
//     return res.status(400).json({ message: "email and expiresAt required" });
//   }

//   try {
//     const coupon = await couponService.createCoupon(email, expiresAt);
//     return res.status(201).json({ message: "Coupon created", coupon });
//   } catch (err) {
//     console.error("Error creating coupon:", err);
//     return res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// }

// async function getCouponsByUser(req, res) {
//   const { email } = req.params;
//   if (!email) {
//     return res.status(400).json({ message: "email is required" });
//   }
//   try {
//     const coupons = await couponService.getCouponsByUser(email);
//     return res.status(200).json({ coupons });
//   } catch (err) {
//     console.error("Error fetching coupons:", err);
//     return res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// }

// module.exports = { createCoupon, getCouponsByUser };


// const couponService = require("../services/couponService");

// // Step 1: Generate coupon code with expiry, no user attached yet
// async function generateCoupon(req, res) {
//   const { expiresAt } = req.body;
//   if (!expiresAt) {
//     return res.status(400).json({ message: "expiresAt is required" });
//   }

//   try {
//     const coupon = await couponService.generateCoupon(expiresAt);
//     return res.status(201).json({ message: "Coupon generated", couponCode: coupon.coupon_code, expiresAt: coupon.expires_at });
//   } catch (err) {
//     console.error("Error generating coupon:", err);
//     return res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// }

// // Step 2: Assign coupon code to user and update role to trainer
// async function assignCouponToUser(req, res) {
//   const { email, couponCode } = req.body;
//   if (!email || !couponCode) {
//     return res.status(400).json({ message: "email and couponCode are required" });
//   }

//   try {
//     const assignedCoupon = await couponService.assignCouponToUser(email, couponCode);
//     if (!assignedCoupon) {
//       return res.status(404).json({ message: "Coupon code not found or already assigned" });
//     }

//     // Update role to trainer
//     const updatedRole = await couponService.updateUserRole(email, "trainer");

//     return res.status(200).json({ message: "Coupon assigned and role updated to trainer", assignedCoupon, updatedRole });
//   } catch (err) {
//     console.error("Error assigning coupon to user:", err);
//     return res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// }

// async function getCouponsByUserEmail(req, res) {
//   const { email } = req.params;
//   if (!email) {
//     return res.status(400).json({ message: "email parameter is required" });
//   }

//   try {
//     const coupons = await couponService.getCouponsByUserEmail(email);
//     return res.status(200).json({ coupons });
//   } catch (err) {
//     console.error("Error fetching coupons:", err);
//     return res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// }

// // module.exports.getCouponsByUserEmail = getCouponsByUserEmail;
// const moment = require("moment-timezone");

// // async function updateExpiryDateByEmail(req, res) {
// //   const { email, newExpiresAt } = req.body;
// //   if (!email || !newExpiresAt) {
// //     return res.status(400).json({ message: "email and newExpiresAt are required" });
// //   }

// //   try {
// //     const updatedCoupon = await couponService.updateExpiryDateByEmail(email, newExpiresAt);
// //     if (!updatedCoupon) {
// //       return res.status(404).json({ message: "No coupon found for this user" });
// //     }
// //     return res.status(200).json({ message: "Expiry date updated", coupon: updatedCoupon });
// //   } catch (err) {
// //     console.error("Error updating expiry date:", err);
// //     return res.status(500).json({ message: "Internal Server Error", details: err.message });
// //   }
// // }


// async function updateExpiryDateByEmail(req, res) {
//   const { email, newExpiresAt } = req.body;
//   if (!email || !newExpiresAt) {
//     return res.status(400).json({ message: "email and newExpiresAt are required" });
//   }

//   try {
//     const updatedCoupon = await couponService.updateExpiryDateByEmail(email, newExpiresAt);
//     if (!updatedCoupon) {
//       return res.status(404).json({ message: "No coupon found for this user" });
//     }

//     // Format to IST or any other desired timezone
//     updatedCoupon.expires_at = moment(updatedCoupon.expires_at)
//       .tz("Asia/Kolkata")
//       .format("YYYY-MM-DD HH:mm:ss");

//     return res.status(200).json({ message: "Expiry date updated", coupon: updatedCoupon });
//   } catch (err) {
//     console.error("Error updating expiry date:", err);
//     return res.status(500).json({ message: "Internal Server Error", details: err.message });
//   }
// }

// // module.exports.updateExpiryDateByEmail = updateExpiryDateByEmail;

// module.exports = { generateCoupon, assignCouponToUser, getCouponsByUserEmail, updateExpiryDateByEmail };




const couponService = require("../services/couponService");
const moment = require("moment-timezone");

// Step 1: Generate coupon code with expiry, no user attached yet
async function generateCoupon(req, res) {
  const { expiresAt } = req.body;
  if (!expiresAt) {
    return res.status(400).json({ message: "expiresAt is required" });
  }

  try {
    const coupon = await couponService.generateCoupon(expiresAt);

    // Format expiry to IST
    const formattedExpiry = moment(coupon.expires_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    return res.status(201).json({
      message: "Coupon generated",
      couponCode: coupon.coupon_code,
      expiresAt: formattedExpiry
    });
  } catch (err) {
    console.error("Error generating coupon:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

// Step 2: Assign coupon code to user and update role to trainer
async function assignCouponToUser(req, res) {
  const { email, couponCode } = req.body;
  if (!email || !couponCode) {
    return res.status(400).json({ message: "email and couponCode are required" });
  }

  try {
    const assignedCoupon = await couponService.assignCouponToUser(email, couponCode);
    if (!assignedCoupon) {
      return res.status(404).json({ message: "Coupon code not found or already assigned" });
    }

    // Format expiry to IST
    assignedCoupon.expires_at = moment(assignedCoupon.expires_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // Update role to trainer
    const updatedRole = await couponService.updateUserRole(email, "trainer");

    return res.status(200).json({
      message: "Coupon assigned and role updated to trainer",
      assignedCoupon,
      updatedRole
    });
  } catch (err) {
    console.error("Error assigning coupon to user:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

// Get all coupons by user email
async function getCouponsByUserEmail(req, res) {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: "email parameter is required" });
  }

  try {
    const coupons = await couponService.getCouponsByUserEmail(email);

    // Format all expiry dates to IST
    const formattedCoupons = coupons.map(coupon => ({
      ...coupon,
      expires_at: moment(coupon.expires_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
    }));

    return res.status(200).json({ coupons: formattedCoupons });
  } catch (err) {
    console.error("Error fetching coupons:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

// Update coupon expiry by email
async function updateExpiryDateByEmail(req, res) {
  const { email, newExpiresAt } = req.body;
  if (!email || !newExpiresAt) {
    return res.status(400).json({ message: "email and newExpiresAt are required" });
  }

  try {
    const updatedCoupon = await couponService.updateExpiryDateByEmail(email, newExpiresAt);
    if (!updatedCoupon) {
      return res.status(404).json({ message: "No coupon found for this user" });
    }

    updatedCoupon.expires_at = moment(updatedCoupon.expires_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    return res.status(200).json({ message: "Expiry date updated", coupon: updatedCoupon });
  } catch (err) {
    console.error("Error updating expiry date:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

module.exports = {
  generateCoupon,
  assignCouponToUser,
  getCouponsByUserEmail,
  updateExpiryDateByEmail
};
