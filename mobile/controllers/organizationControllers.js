const organizationService = require('../services/organizationService');

exports.sendRequest = async (req, res) => {
  try {
    const { ownerEmail, targetEmail, role } = req.body;
    const response = await organizationService.sendRequest(ownerEmail, targetEmail, role);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { ownerEmail, memberEmail } = req.body;
    const response = await organizationService.acceptRequest(ownerEmail, memberEmail);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { ownerEmail, memberEmail } = req.body;
    const response = await organizationService.rejectRequest(ownerEmail, memberEmail);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const { ownerEmail } = req.params;
    const members = await organizationService.getOrganizationMembers(ownerEmail);
    res.json(members);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { ownerEmail, memberEmail } = req.body;
    const response = await organizationService.removeMember(ownerEmail, memberEmail);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getIncomingInvites = async (req, res) => {
  try {
    const { recipientEmail } = req.params;
    const invites = await organizationService.getIncomingInvitesService(recipientEmail);
    res.status(200).json(invites);
  } catch (error) {
    console.error('Error fetching incoming invites:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getMemberOrganizations = async (req, res) => {
  try {
    const { memberEmail } = req.params;
    const organizations = await organizationService.getMemberOrganizations(memberEmail);
    res.json(organizations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


