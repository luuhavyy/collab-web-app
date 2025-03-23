const express = require("express");
const router = express.Router();
const adminService = require("../services/admin.service");
const { authenticateJWT, authorizeRole } = require("../../middlewares/authMiddleware");

router.get("/", authenticateJWT, authorizeRole(["admin"]), adminService.getAdmins);
router.get("/:id", authenticateJWT, authorizeRole(["admin"]), adminService.getAdminById);
router.post("/", authenticateJWT, authorizeRole(["admin"]), adminService.createAdmin);
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), adminService.updateAdmin);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), adminService.deleteAdmin);

module.exports = router;
