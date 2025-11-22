const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.post("/role", roleController.createRole);
router.post("/role/update", roleController.updateRole);
router.get("/role/:email", roleController.fetchRole);
router.get("/role/fetchUsers", roleController.fetchUsers);
router.get("/role/fetchUsers1", roleController.fetchUsers1);
module.exports = router;
