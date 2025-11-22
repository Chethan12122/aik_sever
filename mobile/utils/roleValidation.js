const allowedRoles = ["athlete", "trainer"];

function validateRolePayload({ email, role }) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "Valid email is required.";
  }
  if (!role || !allowedRoles.includes(role)) {
    return `Role must be one of: ${allowedRoles.join(", ")}`;
  }
  return null;
}

module.exports = { validateRolePayload, allowedRoles };
