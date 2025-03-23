const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const promotionCollection = () => getDB().collection("Promotion");

//  API Lấy danh sách tất cả khuyến mãi
exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await promotionCollection().find().toArray();
        res.status(200).json(promotions);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

//  API Lấy thông tin khuyến mãi theo ID
exports.getPromotionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }

        const promotion = await promotionCollection().findOne({ _id: new ObjectId(id) });
        if (!promotion) return res.status(404).json({ error: "Không tìm thấy khuyến mãi" });

        res.status(200).json(promotion);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

//  API Thêm khuyến mãi mới
exports.createPromotion = async (req, res) => {
    try {
        const { 
            promotion_code, 
            start_date, 
            end_date, 
            min_order_value, 
            discount_percent,
            promotion_title
        } = req.body;

        if (!promotion_code || !start_date || !end_date || discount_percent == null || !promotion_title) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
        }

        const now = new Date();
        const formattedStartDate = new Date(start_date);
        const formattedEndDate = new Date(end_date);

        const promotion_status = (now >= formattedStartDate && now <= formattedEndDate) ? "Còn hạn" : "Hết hạn";

        const newPromotion = {
            promotion_code,
            promotion_status,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            min_order_value: min_order_value || 0,
            discount_percent,
            promotion_title,
            created_at: now,
        };

        const result = await promotionCollection().insertOne(newPromotion);
        if (!result.insertedId) {
            return res.status(500).json({ error: "Không thể tạo khuyến mãi" });
        }

        res.status(200).json({ success: true, promotion: { ...newPromotion, _id: result.insertedId } });
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

//  API Cập nhật thông tin khuyến mãi
exports.updatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('ID được gửi từ client:', id);
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }

        const promotion = await promotionCollection().findOne({ _id: new ObjectId(id) });
        if (!promotion) {
            console.log('Không tìm thấy khuyến mãi với ID:', id);
            return res.status(404).json({ error: "Không tìm thấy khuyến mãi" });
        }

        const { _id, ...updateData } = req.body;
        updateData.updated_at = new Date();

        // Chuyển đổi start_date và end_date sang kiểu Date
        if (updateData.start_date) updateData.start_date = new Date(updateData.start_date);
        if (updateData.end_date) updateData.end_date = new Date(updateData.end_date);

        // Kiểm tra nếu start_date hoặc end_date không hợp lệ
        if (updateData.start_date && isNaN(updateData.start_date.getTime())) {
            return res.status(400).json({ error: "Ngày bắt đầu không hợp lệ" });
        }
        if (updateData.end_date && isNaN(updateData.end_date.getTime())) {
            return res.status(400).json({ error: "Ngày kết thúc không hợp lệ" });
        }
// Tính toán lại trạng thái khuyến mãi
const now = new Date();
const formattedStartDate = new Date(updateData.start_date || promotion.start_date);
const formattedEndDate = new Date(updateData.end_date || promotion.end_date);
updateData.promotion_status = (now >= formattedStartDate && now <= formattedEndDate) ? "Còn hạn" : "Hết hạn";

        const updatedPromotion = await promotionCollection().findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: "after" }
        ).catch(error => {
            console.error("Lỗi khi cập nhật khuyến mãi trong MongoDB:", error);
            throw error;
        });

        if (!updatedPromotion.value) {
            console.log('Không tìm thấy khuyến mãi với ID:', id);
            return res.status(404).json({ error: "Không tìm thấy khuyến mãi" });
        }

        res.status(200).json(updatedPromotion.value);
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
};
//  API Xóa khuyến mãi
exports.deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID không hợp lệ" });
        }

        const deletedPromotion = await promotionCollection().findOneAndDelete(
            { _id: new ObjectId(id) },
            { returnDocument: "before" } //  Trả về bản ghi trước khi xóa
        );

        if (!deletedPromotion) return res.status(404).json({ error: "Không tìm thấy khuyến mãi" });

        res.status(200).json({ message: "Xóa khuyến mãi thành công", data: deletedPromotion });
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};

// API Lấy thông tin khuyến mãi theo mã khuyến mãi
exports.getPromotionByCode = async (req, res) => {
    try {
        const { promotion_code } = req.params;

        if (!promotion_code) {
            return res.status(400).json({ error: "Thiếu mã khuyến mãi" });
        }

        const promotion = await promotionCollection().findOne({ promotion_code });

        if (!promotion) {
            return res.status(404).json({ error: "Không tìm thấy khuyến mãi với mã này" });
        }

        // Ép kiểu `discount_percent` từ Decimal sang Float
        if (promotion.discount_percent !== undefined && typeof promotion.discount_percent === "object") {
            promotion.discount_percent = parseFloat(promotion.discount_percent);
        }

        res.status(200).json(promotion);
    } catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
};
