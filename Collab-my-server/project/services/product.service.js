const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const orderCollection = () => getDB().collection("Order");
const productCollection = () => getDB().collection("Product");
const reviewCollection = () => getDB().collection("Review");

const parseStringToArray = (str) => {
    if (!str || typeof str !== 'string') return [];
    return removeVietnameseTones(str).split(",").map(s => s.trim());
};

function removeVietnameseTones(str) {
    if (typeof str !== 'string') {
        return ''; 
    }
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

// Chuyển category thành slug
function slugify(str) {
    return removeVietnameseTones(str)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

// Lấy tất cả sản phẩm, bao gồm số lượng đánh giá và điểm đánh giá trung bình
exports.getProducts = async (_req, res) => {
    try {
        const products = await productCollection().aggregate([
            {
                $lookup: {
                    from: "Review",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    review_count: { $size: "$reviews" },
                    average_rating: {
                        $cond: {
                            if: { $gt: [{ $size: "$reviews" }, 0] },
                            then: { $round: [{ $avg: "$reviews.rating" }, 1] },
                            else: 0.0
                        }
                    }
                }
            },
            { $project: { reviews: 0 } }
        ]).toArray();

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Lấy danh sách danh mục
exports.getProductsByCategory = async (req, res) => {
    try {
        const slugParam = slugify(req.params.category);
        const allProducts = await productCollection().find().toArray();

        const matchedProducts = allProducts.filter(product =>
            slugify(product.category || "") === slugParam
        );

        if (!matchedProducts.length) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào." });
        }

        // Lấy review cho tất cả sản phẩm
        const productIds = matchedProducts.map(p => p._id);
        const reviews = await reviewCollection()
            .find({ product_id: { $in: productIds.map(id => new ObjectId(id)) } })
            .toArray();

        const reviewStats = {};
        for (const review of reviews) {
            const key = review.product_id.toString();
            if (!reviewStats[key]) reviewStats[key] = { sum: 0, count: 0 };
            reviewStats[key].sum += review.rating;
            reviewStats[key].count += 1;
        }

        const productsWithReview = matchedProducts.map(product => {
            const stats = reviewStats[product._id.toString()] || { sum: 0, count: 0 };
            const average_rating = stats.count > 0 ? Number(stats.sum / stats.count).toFixed(1) : "0.0";
            return {
                ...product,
                review_count: stats.count,
                average_rating
            };
        });

        res.json(productsWithReview);
    } catch (error) {
        res.status(500).json({ message: "Lỗi máy chủ.", details: error.message });
    }
};


// Lấy sản phẩm theo thuộc tính
exports.getProductsByAttributes = async (req, res) => {
    try {
      const { gender, faceshape, material } = req.query;
  
      const allProducts = await productCollection().find().toArray();
      const norm = removeVietnameseTones;
  
      const filteredProducts = allProducts.filter((product) => {
        const matchGender = gender
          ? product.gender?.some((g) =>
              norm(g).toLowerCase() === norm(gender).toLowerCase()
            )
          : true;
  
        const matchFaceShape = faceshape
          ? product.face_shape?.some((f) =>
              norm(f).toLowerCase() === norm(faceshape).toLowerCase()
            )
          : true;
  
        const matchMaterial = material
          ? norm(product.material || "").toLowerCase() === norm(material).toLowerCase()
          : true;
  
        return matchGender && matchFaceShape && matchMaterial;
      });
  
      // Lấy ID các sản phẩm lọc được
      const productIds = filteredProducts.map(p => p._id);
      
      // Lấy toàn bộ review liên quan tới các sản phẩm đó
      const reviews = await reviewCollection()
        .find({ product_id: { $in: productIds.map(id => new ObjectId(id)) } })
        .toArray();
  
      // Gom review theo product_id
      const reviewStats = {};
      for (const review of reviews) {
        const key = review.product_id.toString();
        if (!reviewStats[key]) reviewStats[key] = { sum: 0, count: 0 };
        reviewStats[key].sum += review.rating;
        reviewStats[key].count += 1;
      }
  
      // Gắn review_count và average_rating vào từng product
      const productsWithReviews = filteredProducts.map(product => {
        const stats = reviewStats[product._id.toString()] || { sum: 0, count: 0 };
        const average_rating = stats.count > 0 ? (stats.sum / stats.count).toFixed(1) : "0.0";
        return {
          ...product,
          review_count: stats.count,
          average_rating,
        };
      });
  
      res.status(200).json(productsWithReviews);
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm:", error);
      res.status(500).json({ error: "Đã xảy ra lỗi khi lọc sản phẩm." });
    }
  };
  

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) return res.status(400).json({ error: "Invalid Product ID" });

        const product = await productCollection().findOne({ _id: new ObjectId(productId) });
        if (!product) return res.status(404).json({ error: "Product not found" });

        const reviews = await reviewCollection().find({ product_id: new ObjectId(productId) }).toArray();
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1) : "0.0";

        res.json({ ...product, review_count: reviewCount, average_rating: averageRating });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Lấy top 5 sản phẩm bán chạy nhất
exports.getTopSellingProducts = async (_req, res) => {
    try {
        const topProducts = await orderCollection().aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.product_id", total_sold: { $sum: "$items.quantity" } } },
            { $sort: { total_sold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "Product",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product_info"
                }
            },
            { $unwind: "$product_info" }
        ]).toArray();

        const productIds = topProducts.map(p => p._id);
        const reviews = await reviewCollection()
            .find({ product_id: { $in: productIds.map(id => new ObjectId(id)) } })
            .toArray();

        const reviewStats = {};
        for (const review of reviews) {
            const key = review.product_id.toString();
            if (!reviewStats[key]) reviewStats[key] = { sum: 0, count: 0 };
            reviewStats[key].sum += review.rating;
            reviewStats[key].count += 1;
        }

        const withReviews = topProducts.map(p => {
            const product = p.product_info;
            const stats = reviewStats[product._id.toString()] || { sum: 0, count: 0 };
            const average_rating = stats.count > 0 ? Number(stats.sum / stats.count).toFixed(1) : "0.0";
            return {
                ...product,
                total_sold: p.total_sold,
                review_count: stats.count,
                average_rating
            };
        });

        res.json(withReviews);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm bán chạy", error: error.message });
    }
};

// Lấy danh sách 5 sản phẩm mới nhất
exports.getLatestProducts = async (_req, res) => {
    try {
        const latestProducts = await productCollection()
            .find({})
            .sort({ created_at: -1 })
            .limit(5)
            .toArray();

        const productIds = latestProducts.map(p => p._id);
        const reviews = await reviewCollection()
            .find({ product_id: { $in: productIds.map(id => new ObjectId(id)) } })
            .toArray();

        const reviewStats = {};
        for (const review of reviews) {
            const key = review.product_id.toString();
            if (!reviewStats[key]) reviewStats[key] = { sum: 0, count: 0 };
            reviewStats[key].sum += review.rating;
            reviewStats[key].count += 1;
        }

        const withReviewInfo = latestProducts.map(product => {
            const stats = reviewStats[product._id.toString()] || { sum: 0, count: 0 };
            const average_rating = stats.count > 0 ? Number(stats.sum / stats.count).toFixed(1) : "0.0";
            return {
                ...product,
                review_count: stats.count,
                average_rating
            };
        });

        res.json(withReviewInfo);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm mới nhất", error: error.message });
    }
};

//  Thêm sản phẩm mới (có upload ảnh)
exports.createProduct = async (req, res) => {
    try {
        const { product_name, description, price, stock, material, gender, face_shape, glasses_shape, created_at, updated_at, category, total_sold, colour } = req.body;
        
        if (!product_name || price == null || stock == null) {
            return res.status(400).send({ error: "Thiếu thông tin sản phẩm bắt buộc!" });
        }

        const newProduct = {
            product_name,
            description: description || "",
            price: parseFloat(price),
            stock: parseInt(stock),
            material: material || "",
            gender: parseStringToArray(gender) || [],
            face_shape: parseStringToArray(face_shape) || [],            
            glasses_shape: glasses_shape || "",
            created_at: created_at ? new Date(created_at) : new Date(),
            updated_at: updated_at ? new Date(updated_at) : new Date(),
            category: category || "",
            total_sold: total_sold != null ? parseInt(total_sold) : 0,
            colour: colour || "",
            product_image: null
        };

        if (req.files?.product_image) {
            const image = req.files.product_image;
            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
            
            if (!allowedMimeTypes.includes(image.mimetype)) {
                return res.status(400).send({ error: "Chỉ hỗ trợ JPG, PNG, WEBP!" });
            }
            newProduct.product_image = `data:${image.mimetype};base64,${image.data.toString("base64")}`;
        }

        const result = await productCollection().insertOne(newProduct);
        if (!result.insertedId) return res.status(500).send({ error: "Không thể thêm sản phẩm" });
        
        newProduct._id = result.insertedId;
        res.status(201).send({ success: true, message: "Sản phẩm đã được tạo", product: newProduct });
    } catch (error) {
        res.status(500).send({ error: "Lỗi máy chủ nội bộ" });
    }
};

//  Cập nhật sản phẩm (có hỗ trợ ảnh)
exports.updateProduct = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Product ID" });
        }

        let updateData = {};

        // Lọc và cập nhật các trường hợp lệ
        Object.entries(req.body).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && key !== "_id") {
                updateData[key] = value;
            }
        });

        console.log("Update Data:", updateData); // Log dữ liệu cập nhật

        // Chuyển chuỗi => mảng nếu có gender hoặc face_shape
        if (updateData.gender) {
            updateData.gender = parseStringToArray(updateData.gender.toString());
        }
        if (updateData.face_shape) {
            updateData.face_shape = parseStringToArray(updateData.face_shape.toString());
        }

        // Xử lý hình ảnh nếu có file mới
        if (req.files?.product_image) {
            const image = req.files.product_image;
            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedMimeTypes.includes(image.mimetype)) {
                return res.status(400).send({ error: "Chỉ hỗ trợ JPG, PNG, WEBP!" });
            }
            updateData.product_image = `data:${image.mimetype};base64,${image.data.toString("base64")}`;
        } else if (req.body.existingImage) {
            updateData.product_image = req.body.existingImage;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({ error: "Không có dữ liệu cập nhật hợp lệ" });
        }

        await productCollection().updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
        const updatedProduct = await productCollection().findOne({ _id: new ObjectId(req.params.id) });
        res.send(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error); // Log lỗi chi tiết
        res.status(500).send({ error: "Internal Server Error" });
    }
};

//  Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Product ID" });
        }

        const product = await productCollection().findOne({ _id: new ObjectId(req.params.id) });
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Xóa sản phẩm
        const result = await productCollection().deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(500).send({ error: "Không thể xóa sản phẩm" });
        }

        res.send({ success: true, message: "Sản phẩm đã bị xóa" });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// Lấy danh sách danh mục
exports.getCategories = async (_req, res) => {
    try {
        const categories = await productCollection().distinct("category");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};