const express = require("express");
const router = express.Router();
const authCustomerService = require("../services/authCustomer.service");
const { authenticateJWT } = require("../../middlewares/authMiddleware"); 

//  Đăng ký khách hàng
router.post("/register", authCustomerService.registerCustomer);

//  Đăng nhập khách hàng
router.post("/login", authCustomerService.loginCustomer);

//  Gửi email đặt lại mật khẩu
router.post("/forgot-password", authCustomerService.forgotPassword);

//  Xác nhận token và đặt lại mật khẩu mới
router.post("/reset-password", authCustomerService.resetPassword);

//  Đổi mật khẩu (Yêu cầu đăng nhập)
router.post("/change-password", authenticateJWT, authCustomerService.changePassword);

// Đăng xuất khách hàng (Yêu cầu đăng nhập)
router.post("/logout", authenticateJWT, authCustomerService.logoutCustomer);

module.exports = router;
