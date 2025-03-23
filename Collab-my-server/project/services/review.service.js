const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const reviewCollection = () => getDB().collection("Review");
const customerCollection = () => getDB().collection("Customer");

// ✅ Lấy danh sách review theo `product_id` và join thông tin khách hàng
exports.getReviewsByProductId = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.productId)) {
            return res.status(400).send({ error: "Invalid Product ID" });
        }

        const productId = new ObjectId(req.params.productId);
        const reviews = await reviewCollection().aggregate([
            {
                $match: { product_id: productId }
            },
            {
                $lookup: {
                    from: "Customer",
                    localField: "customer_id",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            {
                $unwind: "$customer" // Chuyển mảng customer thành object
            },
            {
                $project: {
                    _id: 1,
                    customer_id: 1,
                    product_id: 1,
                    rating: 1,
                    comment: 1,
                    created_at: 1,
                    updated_at: 1,
                    "customer.first_name": 1,
                    "customer.avatar": 1
                }
            }
        ]).toArray();

        res.send(reviews);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Thêm review mới
exports.createReview = async (req, res) => {
    try {
        const customer_id = req.user.customerId; // Lấy ID từ token
        const { productId } = req.params;
        const { rating, comment } = req.body;

        if (!ObjectId.isValid(customer_id) || !ObjectId.isValid(productId)) {
            return res.status(400).send({ error: "Invalid ID" });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send({ error: "Rating must be between 1 and 5" });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await productCollection().findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Kiểm tra khách hàng đã review sản phẩm này chưa
        const existingReview = await reviewCollection().findOne({
            customer_id: new ObjectId(customer_id),
            product_id: new ObjectId(productId),
        });

        if (existingReview) {
            return res.status(400).send({ error: "You have already reviewed this product" });
        }

        // Tạo review mới
        const newReview = { 
            customer_id: new ObjectId(customer_id), 
            product_id: new ObjectId(productId), 
            rating, 
            comment, 
            created_at: new Date(), 
            updated_at: new Date() 
        };

        const result = await reviewCollection().insertOne(newReview);
        res.send({ _id: result.insertedId, ...newReview });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// Sửa review
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const customer_id = req.user.userId; // Lấy ID từ token

        if (!ObjectId.isValid(reviewId)) {
            return res.status(400).send({ error: "Invalid Review ID" });
        }

        const review = await reviewCollection().findOne({ _id: new ObjectId(reviewId) });
        if (!review) {
            return res.status(404).send({ error: "Review not found" });
        }

        if (!review.customer_id.equals(new ObjectId(customer_id))) {
            return res.status(403).send({ error: "You can only edit your own review" });
        }

        const updatedReview = {
            ...(rating && { rating }),
            ...(comment && { comment }),
            updated_at: new Date()
        };

        await reviewCollection().updateOne({ _id: new ObjectId(reviewId) }, { $set: updatedReview });
        res.send({ success: true, message: "Review updated", review: updatedReview });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// Xóa review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const customer_id = req.user.userId; // Lấy ID từ token

        if (!ObjectId.isValid(reviewId)) {
            return res.status(400).send({ error: "Invalid Review ID" });
        }

        const review = await reviewCollection().findOne({ _id: new ObjectId(reviewId) });
        if (!review) {
            return res.status(404).send({ error: "Review not found" });
        }

        if (!review.customer_id.equals(new ObjectId(customer_id))) {
            return res.status(403).send({ error: "You can only delete your own review" });
        }

        await reviewCollection().deleteOne({ _id: new ObjectId(reviewId) });
        res.send({ success: true, message: "Review deleted" });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};
