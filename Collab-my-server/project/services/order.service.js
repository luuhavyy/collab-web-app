const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const orderCollection = () => getDB().collection("Order");
const productCollection = () => getDB().collection("Product");
const promotionCollection = () => getDB().collection("Promotion");


//  Lấy tất cả đơn hàng (chỉ Admin mới được phép)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderCollection().find().toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};


// Lấy danh sách đơn hàng của khách hàng theo token
exports.getOrders = async (req, res) => {
    try {
        const customer_id = req.user?.customerId; // Lấy từ token
        if (!customer_id || !ObjectId.isValid(customer_id)) {
            return res.status(400).json({ message: "customer_id không hợp lệ" });
        }

        const orders = await orderCollection().find({ customer_id: new ObjectId(customer_id) }).toArray();
        res.json(orders);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// API để lấy thống kê số lượng đơn hàng và tổng doanh thu theo năm
exports.getStats = async (req, res) => {
    try {
        const date = req.query.date; // Ngày được truyền vào từ query params
        if (!date) {
            return res.status(400).json({ message: "Thiếu tham số ngày (date)" });
        }

        // Lấy năm từ ngày được truyền vào
        const year = new Date(date).getFullYear();
        
        // Xác định khoảng thời gian của cả năm
        const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0); // 01/01 của năm
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999); // 31/12 của năm

        // Lấy tất cả đơn hàng trong năm
        const orders = await orderCollection()
            .find({
                order_date: { $gte: startOfYear, $lte: endOfYear }
            })
            .toArray();

        // Tính tổng số lượng đơn hàng và tổng doanh thu
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

        res.json({
            visits: 0, // Bạn có thể thêm logic để lấy số lượt truy cập nếu có
            orders: totalOrders,
            revenue: totalRevenue
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};




// API để lấy dữ liệu doanh thu theo tháng
exports.getSalesData = async (req, res) => {
    try {
        const month = parseInt(req.query.month); // Tháng được truyền vào từ query params
        if (isNaN(month)) { 
            return res.status(400).json({ message: "Tham số tháng không hợp lệ" });
        }

        // Tính ngày bắt đầu và kết thúc của tháng
        const year = new Date().getFullYear(); // Lấy năm hiện tại
        const startOfMonth = new Date(year, month - 1, 1); // Tháng bắt đầu từ 0 (0 = tháng 1)
        const endOfMonth = new Date(year, month, 0); // Ngày cuối cùng của tháng

        // Lấy tất cả đơn hàng trong tháng
        const orders = await orderCollection()
            .find({
                order_date: { $gte: startOfMonth, $lte: endOfMonth }
            })
            .toArray();

        // Gom nhóm doanh thu theo ngày
        const salesByDay = {};
        orders.forEach(order => {
            const orderDate = order.order_date.toISOString().split('T')[0]; // Lấy ngày (YYYY-MM-DD)
            if (!salesByDay[orderDate]) {
                salesByDay[orderDate] = 0;
            }
            salesByDay[orderDate] += order.total_amount;
        });

        // Chuyển đổi thành mảng để trả về
        const chartData = Object.keys(salesByDay).map(date => ({
            day: date,
            totalRevenue: salesByDay[date]
        }));

        res.json({ chartData });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};



//  Lấy chi tiết đơn hàng theo `orderId`
exports.getOrderById = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.orderId);
        const order = await orderCollection().findOne({ _id: orderId });
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

//  Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
    try {
        const { customer_id, items, delivery_address, promotion_code } = req.body;

        if (!ObjectId.isValid(customer_id)) {
            return res.status(400).json({ message: "customer_id không hợp lệ" });
        }


         // Kiểm tra payment_method hợp lệ
         const validPaymentMethods = ["COD", "VISA", "QRCODE"];
         if (!validPaymentMethods.includes(payment_method)) {
             return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
         }

        let total_price = 0;
        let total_discount = 0;

        //  Kiểm tra và tính giá từng sản phẩm
        for (const item of items) {
            if (!ObjectId.isValid(item.product_id)) {
                return res.status(400).json({ message: "product_id không hợp lệ" });
            }

            const product = await productCollection().findOne({ _id: new ObjectId(item.product_id) });

            if (!product) {
                return res.status(404).json({ message: `Sản phẩm với ID ${item.product_id} không tồn tại` });
            }

            item.item_price = product.price; // Lấy giá từ DB
            total_price += item.item_price * item.quantity;
        }

        //  Kiểm tra và áp dụng khuyến mãi nếu có
        if (promotion_code) {
            const promotion = await promotionCollection().findOne({ promotion_code });

            if (promotion) {
                const now = new Date();

                //  Điều kiện khuyến mãi hợp lệ
                const isActive = promotion.promotion_status === "Còn hạn";
                const isValidDate = now >= new Date(promotion.start_date) && now <= new Date(promotion.end_date);
                const meetsMinValue = total_price >= promotion.min_order_value;

                if (isActive && isValidDate && meetsMinValue) {
                    total_discount = total_price * promotion.discount_percent; // Áp dụng giảm giá
                }
            }
        }

        const newOrder = {
            order_date: new Date(),
            total_price,
            total_discount,
            total_amount: total_price - total_discount,
            order_status: "Đang xử lý",
            delivery_address,
            customer_id: new ObjectId(customer_id),
            payment_method,
            items: items.map(item => ({
                product_id: new ObjectId(item.product_id),
                quantity: item.quantity,
                item_price: item.item_price
            }))
        };

        const orderResult = await orderCollection().insertOne(newOrder);

        // ✅ Cập nhật total_sold của từng sản phẩm
        for (const item of items) {
            await productCollection().updateOne(
                { _id: new ObjectId(item.product_id) },
                { $inc: { total_sold: item.quantity } } // +quantity vào total_sold
            );
        }

         // Cập nhật điểm tích lũy cho khách hàng
         await customerCollection().updateOne(
            { _id: new ObjectId(customer_id) },
            { $inc: { buying_points: 5 } } // Cộng thêm 5 điểm
        );     

        res.json({ message: "Đơn hàng đã tạo", orderId: orderResult.insertedId });

    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

//  Cập nhật đơn hàng (Khách hàng có thể hủy, Admin cập nhật trạng thái)
exports.updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { order_status } = req.body;
        const orderObjectId = new ObjectId(orderId);

        const order = await orderCollection().findOne({ _id: orderObjectId });
        if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        // Nếu là khách hàng -> Hủy đơn hàng
        if (req.user?.role === "customer") {
            if (!new ObjectId(order.customer_id).equals(new ObjectId(req.user.customerId))) {
                return res.status(403).json({ message: "Bạn không thể hủy đơn hàng của người khác" });
            }
            if (order.order_status !== "Đang xử lý") {
                return res.status(400).json({ message: "Không thể hủy đơn hàng đã giao hoặc đã hủy" });
            }
            const result = await orderCollection().findOneAndUpdate(
                { _id: orderObjectId },
                { $set: { order_status: "Đã hủy" } },
                { returnDocument: "after" }
            );
            return res.json(result);
        }

        // Nếu là Admin -> Cập nhật trạng thái đơn hàng
        if (req.user?.role === "admin") {
            const validStatuses = ["Đang xử lý", "Chờ lấy hàng", "Chờ giao hàng", "Đã giao", "Đã hủy"];
            if (!validStatuses.includes(order_status)) {
                return res.status(400).json({ message: "Trạng thái không hợp lệ" });
            }
            const result = await orderCollection().findOneAndUpdate(
                { _id: orderObjectId },
                { $set: { order_status: order_status } },
                { returnDocument: "after" }
            );
            return res.json(result);
        }

        return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
    } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
