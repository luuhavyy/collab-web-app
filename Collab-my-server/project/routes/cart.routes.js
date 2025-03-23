const express = require("express");
const router = express.Router();
const cartService = require("../services/cart.service");
const { authenticateJWT } = require("../../middlewares/authMiddleware");

//  Đồng bộ giỏ hàng từ Local Storage khi đăng nhập
router.post("/sync", cartService.syncCart);

// Thêm route clearCart vào router
router.delete("/clear", authenticateJWT, cartService.clearCart);

//  Thêm sản phẩm vào giỏ hàng
router.post("/", cartService.addToCart);

//  Lấy danh sách giỏ hàng theo user (đặt sau để tránh conflict với "/sync")
router.get("/:customer_id", cartService.getCart);

//  Cập nhật số lượng sản phẩm
router.put("/", cartService.updateCart);

//  Xóa sản phẩm khỏi giỏ hàng
router.delete("/:product_id", authenticateJWT, cartService.removeFromCart);

module.exports = router;
