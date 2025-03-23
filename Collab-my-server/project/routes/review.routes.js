const express = require("express");
const router = express.Router();
const reviewService = require("../services/review.service");
const { authenticateJWT } = require("../../middlewares/authMiddleware");

//  Lấy danh sách review theo sản phẩm
router.get("/product/:productId", reviewService.getReviewsByProductId);

//  Thêm review (yêu cầu đăng nhập)
router.post("/product/:productId", authenticateJWT, reviewService.createReview);

//  Sửa review
router.put("/:reviewId", authenticateJWT, reviewService.updateReview);

//  Xóa review
router.delete("/:reviewId", authenticateJWT, reviewService.deleteReview);

module.exports = router;
