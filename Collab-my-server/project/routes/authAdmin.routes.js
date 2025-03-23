const express = require("express");
const router = express.Router();
const authAdminService = require("../services/authAdmin.service");
const { authenticateJWT } = require("../../middlewares/authMiddleware");

// Đăng nhập Admin
router.post("/login", authAdminService.loginAdmin);

// Quên mật khẩu
router.post("/forgot-password", authAdminService.forgotPassword);

// Xác nhận mã code
router.post("/confirm-code", authAdminService.confirmCode);

// Đặt lại mật khẩu
router.post("/reset-password", authAdminService.resetPassword);

// Đăng xuất Admin
router.post("/logout", authenticateJWT, authAdminService.logoutAdmin);

module.exports = router;