const express = require("express");
const router = express.Router();

// Import tất cả các route
const productRoutes = require("./product.routes");
const blogRoutes = require("./blog.routes");
const promotionRoutes = require("./promotion.routes");
const cartRoutes = require("./cart.routes");
const wishlistRoutes = require("./wishlist.routes");
const adminRoutes = require("./admin.routes");
const customerRoutes = require("./customer.routes");
const orderRoutes = require("./order.routes");
const authCustomerRoutes = require("./authCustomer.routes");  
const authAdminRoutes = require("./authAdmin.routes");       
const reviewRoutes = require("./review.routes");

// Sử dụng các route
router.use("/product", productRoutes);
router.use("/blog", blogRoutes);
router.use("/promotion", promotionRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/admin", adminRoutes);
router.use("/customer", customerRoutes);
router.use("/order", orderRoutes);
router.use("/authCustomer", authCustomerRoutes);  
router.use("/authAdmin", authAdminRoutes);        
router.use("/review", reviewRoutes);

module.exports = router;
