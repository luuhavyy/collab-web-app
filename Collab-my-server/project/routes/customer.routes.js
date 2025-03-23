const express = require("express");
const router = express.Router();
const customerService = require("../services/customer.service");
const { authenticateJWT, authorizeRole } = require("../../middlewares/authMiddleware");

//  Chỉ Admin được xem danh sách khách hàng
router.get("/", authenticateJWT, authorizeRole(["admin"]), customerService.getCustomers);

//  Customer hoặc Admin có thể xem thông tin khách hàng, nhưng Customer chỉ xem được của chính mình
router.get("/:id", authenticateJWT, customerService.getCustomerById);

//  Customer chỉ được cập nhật thông tin của chính họ
router.put("/:id", authenticateJWT, customerService.updateCustomer);

module.exports = router;
