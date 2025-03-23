const express = require("express");
const router = express.Router();
const productService = require("../services/product.service");
const { authenticateJWT, authorizeRole } = require("../../middlewares/authMiddleware");

//  Lấy danh sách danh mục (ưu tiên đặt trên để tránh conflict với "/:id")
router.get("/categories", productService.getCategories);

//  Lọc sản phẩm theo danh mục
router.get("/category/:category", productService.getProductsByCategory);

// Lọc sản phẩm theo thuộc tính (gender, faceshape, material)
router.get("/filter", productService.getProductsByAttributes);

//  Lấy danh sách sản phẩm (có rating, số review)
router.get("/", productService.getProducts);

// Lấy danh sách top 5 sản phẩm bán chạy (chỉ admin)
router.get("/top-selling", productService.getTopSellingProducts);

// Lấy sản phẩm mới nhất
router.get("/latest", productService.getLatestProducts);

//  Lấy sản phẩm theo ID (đặt sau cùng trong GET để tránh nhầm với "/categories")
router.get("/:id", productService.getProductById);

//  Thêm sản phẩm mới (Chỉ admin mới được thêm)
router.post("/", authenticateJWT, authorizeRole("admin"), productService.createProduct);

//  Cập nhật sản phẩm theo ID (Chỉ admin mới được cập nhật)
router.put("/:id", authenticateJWT, authorizeRole("admin"), productService.updateProduct);

//  Xóa sản phẩm theo ID (Chỉ admin mới được xóa)
router.delete("/:id", authenticateJWT, authorizeRole("admin"), productService.deleteProduct);

module.exports = router;
