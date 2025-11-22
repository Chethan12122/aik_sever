// const express = require("express");
// const router = express.Router();
// const couponController = require("../controllers/couponController");

// // Create coupon for user
// router.post("/coupons", couponController.createCoupon);

// // Get coupons for a user
// router.get("/coupons/:email", couponController.getCouponsByUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

// Step 1: generate coupon with expiry date only
router.post("/coupons/generate", couponController.generateCoupon);

// Step 2: assign coupon to user with email + couponCode
router.post("/coupons/assign", couponController.assignCouponToUser);

router.get("/coupons/user/:email", couponController.getCouponsByUserEmail);

router.put("/coupons/expiry-by-email", couponController.updateExpiryDateByEmail);

module.exports = router;
