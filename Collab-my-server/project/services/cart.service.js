const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const cartCollection = () => getDB().collection("Cart");
const productCollection = () => getDB().collection("Product");

//  1. Lấy giỏ hàng theo user
exports.getCart = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const cart = await cartCollection().findOne({ customer_id: new ObjectId(customer_id) });

        if (!cart) return res.json({ cart_items: [], total_items: 0, total_price: 0 });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  2. Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { customerId } = req.user; // Lấy từ token
        const { product_id, quantity } = req.body;
        if (!product_id || !quantity) return res.status(400).json({ error: "Missing required fields" });

        // Lấy thông tin sản phẩm từ database
        const product = await productCollection().findOne({ _id: new ObjectId(product_id) });
        if (!product) return res.status(400).json({ error: "Product not found" });

        const item_price = product.price; // Giá sản phẩm từ DB

        // Tìm giỏ hàng của khách hàng
        let cart = await cartCollection().findOne({ customer_id: new ObjectId(customerId) });

        if (!cart) {
            // Chưa có giỏ hàng → Tạo mới
            cart = {
                customer_id: new ObjectId(customerId),
                cart_items: [{ product_id: new ObjectId(product_id), quantity, item_price }],
                total_items: quantity,
                total_price: item_price * quantity,
            };
            await cartCollection().insertOne(cart);
        } else {
            // Kiểm tra sản phẩm đã có chưa
            const existingItem = cart.cart_items.find(item => item.product_id.equals(new ObjectId(product_id)));

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.item_price = item_price; // Cập nhật giá mới
            } else {
                cart.cart_items.push({ product_id: new ObjectId(product_id), quantity, item_price });
            }

            // Cập nhật tổng số lượng & giá
            cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
            cart.total_price = cart.cart_items.reduce((sum, item) => sum + item.quantity * item.item_price, 0);

            await cartCollection().updateOne({ _id: cart._id }, { $set: cart });
        }

        res.json({ success: true, cart });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  3. Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCart = async (req, res) => {
    try {
        const { customerId } = req.user; // Lấy từ token
        const { product_id, quantity } = req.body;

        if (!ObjectId.isValid(customerId) || !ObjectId.isValid(product_id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        // Tìm giỏ hàng của khách hàng
        const cart = await cartCollection().findOne({ customer_id: new ObjectId(customerId) });
        if (!cart) return res.status(400).json({ error: "Cart not found" });

        // Tìm sản phẩm trong giỏ hàng
        const item = cart.cart_items.find(item => item.product_id.equals(new ObjectId(product_id)));
        if (!item) return res.status(400).json({ error: "Product not in cart" });

        // Cập nhật số lượng (giữ nguyên item_price)
        item.quantity = quantity;

        // Cập nhật tổng số lượng & tổng giá
        cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
        cart.total_price = cart.cart_items.reduce((sum, item) => sum + item.quantity * item.item_price, 0);

        // Cập nhật giỏ hàng trong DB
        await cartCollection().updateOne({ _id: cart._id }, { $set: cart });

        res.json({ success: true, cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  4. Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const { customerId } = req.user; // Lấy từ token
        const { product_id } = req.params;

        const cart = await cartCollection().findOne({ customer_id: new ObjectId(customerId) });
        if (!cart) return res.status(400).json({ error: "Cart not found" });

        cart.cart_items = cart.cart_items.filter(item => !item.product_id.equals(new ObjectId(product_id)));

        cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
        cart.total_price = cart.cart_items.reduce((sum, item) => sum + item.quantity * item.item_price, 0);

        await cartCollection().updateOne({ _id: cart._id }, { $set: cart });
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  5. Đồng bộ giỏ hàng từ Local Storage khi đăng nhập
exports.syncCart = async (req, res) => {
    try {
        const { customerId } = req.user; //  Lấy từ token
        const { cart_items } = req.body;

        let cart = await cartCollection().findOne({ customer_id: new ObjectId(customerId) });

        for (const item of cart_items) {
            const product = await productCollection().findOne({ _id: new ObjectId(item.productId) });
            if (!product) continue;

            const item_price = product.price;
            const existingItem = cart?.cart_items.find(ci => ci.product_id.equals(new ObjectId(item.productId)));

            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.cart_items.push({ product_id: new ObjectId(item.productId), quantity: item.quantity, item_price });
            }
        }

        cart.total_items = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
        cart.total_price = cart.cart_items.reduce((sum, item) => sum + item.quantity * item.item_price, 0);

        await cartCollection().updateOne({ _id: cart._id }, { $set: cart });
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 6️. Xóa toàn bộ giỏ hàng theo customer_id
exports.clearCart = async (req, res) => {
    try {
        const { customerId } = req.user; // ✅ Lấy customer_id từ token

        // Xóa giỏ hàng trong cơ sở dữ liệu
        const result = await cartCollection().deleteOne({ customer_id: new ObjectId(customerId) });

        if (result.deletedCount === 0) {
            return res.status(400).json({ error: "Cart not found or already empty" });
        }

        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};