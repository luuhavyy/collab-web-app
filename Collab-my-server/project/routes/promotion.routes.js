const express = require("express");
const router = express.Router();
const promotionService = require("../services/promotion.service");
const { authenticateJWT, authorizeRole } = require("../../middlewares/authMiddleware");

//  Ai cũng có thể xem danh sách khuyến mãi
router.get("/", promotionService.getAllPromotions);
router.get("/code/:promotion_code", promotionService.getPromotionByCode);
router.get("/:id", promotionService.getPromotionById);

//  Chỉ admin mới có quyền thêm, sửa, xóa
router.post("/", authenticateJWT, authorizeRole(["admin"]), promotionService.createPromotion);
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), promotionService.updatePromotion);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), promotionService.deletePromotion);

module.exports = router;
