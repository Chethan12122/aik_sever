const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationControllers');

router.post('/organization/send-request', orgController.sendRequest);
router.post('/organization/accept-request', orgController.acceptRequest);
router.post('/organization/reject-request', orgController.rejectRequest);
router.get('/organization/members/:ownerEmail', orgController.getMembers);
router.post('/organization/remove-member', orgController.removeMember);
router.get('/organization/incoming-invites/:recipientEmail', orgController.getIncomingInvites);
router.get('/organization/member-of/:memberEmail', orgController.getMemberOrganizations);


module.exports = router;
