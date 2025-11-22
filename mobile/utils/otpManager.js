// WARNING: For production, use Redis or DB with expiration instead of in-memory storage
const otpStore = new Map();

function generateOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  // Optionally add expiry logic, e.g. setTimeout to delete otp after 5 min
  setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);
  return otp;
}

function validateOtp(email, otp) {
  const validOtp = otpStore.get(email);
  if (validOtp && validOtp === otp) {
    otpStore.delete(email);
    return true;
  }
  return false;
}

module.exports = { generateOtp, validateOtp };
