const express = require("express");
const router = express.Router();
const blogService = require("../services/blog.service");
const { authenticateJWT, authorizeRole } = require("../../middlewares/authMiddleware");

//  Ai cũng có thể xem blog
router.get("/", blogService.getBlogs);
router.get("/:id", blogService.getBlogById);

//  Chỉ admin mới có quyền thêm, sửa, xóa blog
router.post("/", authenticateJWT, authorizeRole(["admin"]), blogService.createBlog);
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), blogService.updateBlog);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), blogService.deleteBlog);

module.exports = router;
