const express = require("express");
const router = express.Router();
const orderService = require("../services/order.service");
const { authenticateJWT, authorizeRole } = require("../../middlewares/authMiddleware");

//  Lấy danh sách đơn hàng của khách hàng (theo token)
router.get("/", authenticateJWT, orderService.getOrders);

//  Lấy tất cả đơn hàng (chỉ Admin)
router.get("/all", authenticateJWT, authorizeRole("admin"), orderService.getAllOrders);

router.get("/stats", orderService.getStats);

router.get("/sales", orderService.getSalesData);

//  Lấy đơn hàng theo orderId
router.get("/:orderId", orderService.getOrderById);


//  Khách hàng tạo đơn hàng
router.post("/", orderService.createOrder);

//  Cập nhật đơn hàng (Khách hủy, Admin cập nhật trạng thái)
router.put("/:orderId", authenticateJWT, orderService.updateOrder);



module.exports = router;
