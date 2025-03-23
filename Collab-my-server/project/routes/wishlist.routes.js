const express = require("express");
const router = express.Router();
const wishlistService = require("../services/wishlist.service");
const { authenticateJWT } = require("../../middlewares/authMiddleware");

// Lấy danh sách wishlist (chỉ cho khách hàng đăng nhập)
router.get("/", authenticateJWT, wishlistService.getWishlist);

// Thêm sản phẩm vào wishlist (nếu chưa đăng nhập thì chỉ thông báo lưu Local Storage)
router.post("/", authenticateJWT, wishlistService.addToWishlist);

// Xóa sản phẩm khỏi wishlist
router.delete("/:productId", authenticateJWT, wishlistService.removeFromWishlist);

// Đồng bộ wishlist từ Local Storage lên Database khi đăng nhập
router.post("/sync", authenticateJWT, wishlistService.syncWishlist);

module.exports = router;
