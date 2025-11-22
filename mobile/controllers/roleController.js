const roleService = require("../services/roleService");
const { validateRolePayload } = require("../utils/roleValidation");

async function createRole(req, res) {
  const { email, role } = req.body;

  const validationError = validateRolePayload({ email, role });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const newRole = await roleService.createRole(email, role);
    return res.status(201).json({ message: "Role inserted successfully", user: newRole });
  } catch (err) {
    console.error("Error inserting role:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

async function updateRole(req, res) {
  const { email, role } = req.body;

  const validationError = validateRolePayload({ email, role });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const updatedUser = await roleService.updateRole(email, role);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found or role unchanged" });
    }

    return res.status(200).json({ message: "Role updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating role:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}


async function fetchRole(req, res) {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email parameter is required" });
  }

  try {
    const userRole = await roleService.getRoleByEmail(email);

    if (!userRole) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Role fetched successfully", user: userRole });
  } catch (err) {
    console.error("Error fetching role:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

  async function fetchUsers(req, res) {
  try {
    const fields = req.query.fields;
    console.log('Fields received:', fields);
    const users = await roleService.fetchUsers(fields);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function fetchUsers1(req, res) {
  try {
    const fields = req.query.fields;
    const role = req.query.role; // Get role from query string
    console.log('Fields received:', fields, 'Role received:', role);

    const users = await roleService.fetchUsers1(fields, role);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}



module.exports = { createRole, updateRole, fetchRole, fetchUsers, fetchUsers1 };
