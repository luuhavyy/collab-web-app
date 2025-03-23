const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const wishlistCollection = () => getDB().collection("Wishlist");

// Lấy Wishlist của khách hàng đã đăng nhập
exports.getWishlist = async (req, res) => {
    if (!req.user || !req.user.customerId) {
        return res.status(400).json({ error: "Customer ID not found in token" });
    }

    try {
        const customerId = new ObjectId(req.user.customerId);
        const wishlist = await wishlistCollection().findOne({ customer_id: customerId });

        if (!wishlist || !wishlist.wishlist_items.length) {
            return res.json({ wishlist: [] }); // Trả về mảng rỗng thay vì lỗi 404
        }

        res.json(wishlist.wishlist_items);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Thêm sản phẩm vào Wishlist
exports.addToWishlist = async (req, res) => {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: "Product ID is required" });

    // Nếu chưa đăng nhập, chỉ thông báo lưu vào Local Storage
    if (!req.user || !req.user.customerId) {
        return res.json({ message: "Saved to Local Storage Wishlist", product_id });
    }

    try {
        const customerId = new ObjectId(req.user.customerId);
        let wishlist = await wishlistCollection().findOne({ customer_id: customerId });

        if (!wishlist) {
            wishlist = { customer_id: customerId, wishlist_items: [] };
        }

        // Kiểm tra xem sản phẩm đã có trong wishlist chưa
        const isExist = wishlist.wishlist_items.some(item => item.product_id.equals(product_id));
        if (!isExist) {
            wishlist.wishlist_items.push({ product_id: new ObjectId(product_id) });

            await wishlistCollection().updateOne(
                { customer_id: customerId },
                { $set: { wishlist_items: wishlist.wishlist_items } },
                { upsert: true }
            );
        }

        res.json({ message: "Added to Wishlist", wishlist: wishlist.wishlist_items });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Xóa sản phẩm khỏi Wishlist
exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;

    if (!req.user || !req.user.customerId) {
        return res.json({ message: "Removed from Local Storage Wishlist", productId });
    }

    try {
        const customerId = new ObjectId(req.user.customerId);
        let wishlist = await wishlistCollection().findOne({ customer_id: customerId });

        if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });

        // Chuyển productId sang ObjectId để so sánh
        const updatedItems = wishlist.wishlist_items.filter(item => !item.product_id.equals(new ObjectId(productId)));

        await wishlistCollection().updateOne(
            { customer_id: customerId },
            { $set: { wishlist_items: updatedItems } }
        );

        res.json({ message: "Product removed from Wishlist", wishlist: updatedItems });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Đồng bộ Wishlist từ Local Storage lên Database khi đăng nhập
exports.syncWishlist = async (req, res) => {
    const { wishlist_items } = req.body;

    if (!Array.isArray(wishlist_items) || !wishlist_items.length) {
        return res.status(400).json({ error: "Invalid wishlist data" });
    }

    if (!req.user || !req.user.customerId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const customerId = new ObjectId(req.user.customerId);
        let wishlist = await wishlistCollection().findOne({ customer_id: customerId });

        if (!wishlist) {
            wishlist = { customer_id: customerId, wishlist_items: [] };
        }

        const existingProductIds = new Set(wishlist.wishlist_items.map(item => item.product_id.toString()));

        const newItems = wishlist_items
            .filter(id => ObjectId.isValid(id)) // Kiểm tra ID hợp lệ
            .map(id => new ObjectId(id))
            .filter(id => !existingProductIds.has(id.toString()))
            .map(productId => ({ product_id: productId }));

        wishlist.wishlist_items.push(...newItems);

        await wishlistCollection().updateOne(
            { customer_id: customerId },
            { $set: { wishlist_items: wishlist.wishlist_items } },
            { upsert: true }
        );

        res.json({ message: "Wishlist synced successfully", wishlist: wishlist.wishlist_items });
    } catch (error) {
        console.error("Error syncing wishlist:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
