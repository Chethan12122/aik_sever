const couponService = require("../services/couponService");

async function checkAndExpireCoupons() {
  console.log("Running coupon expiry check...");
  try {
    await couponService.expireAndUpdateRoles();
    console.log("Coupon expiry check completed.");
  } catch (err) {
    console.error("Coupon expiry check error:", err);
  }
}

setInterval(checkAndExpireCoupons, 5 * 60 * 1000); // every 5 minutes

// Optional: run immediately on start
checkAndExpireCoupons();
                                                                                                                                                                                                                                                                                                                                                                                                                                        