const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const blogCollection = () => getDB().collection("Blog");

// ✅ Lấy danh sách blog
exports.getBlogs = async (req, res) => {
    try {
        const result = await blogCollection().find({}).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Lấy blog theo ID
exports.getBlogById = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Blog ID" });
        }
        const result = await blogCollection().findOne({ _id: new ObjectId(req.params.id) });
        if (!result) return res.status(404).send({ error: "Blog not found" });
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Thêm blog mới (có hỗ trợ upload ảnh)
exports.createBlog = async (req, res) => {
    try {
        const { title, content, published_at, category, author } = req.body;
        let thumbnail = null;

        if (req.files && req.files.thumbnail) {
            const image = req.files.thumbnail;
            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedMimeTypes.includes(image.mimetype)) {
                return res.status(400).send({ error: "Chỉ hỗ trợ JPG, PNG, WEBP!" });
            }
            thumbnail = `data:${image.mimetype};base64,${image.data.toString("base64")}`;
        }

        const newBlog = { title, content, published_at: new Date(published_at), category, thumbnail, author };
        const result = await blogCollection().insertOne(newBlog);
        res.send({ _id: result.insertedId, ...newBlog });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Cập nhật blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, published_at, category, existingThumbnail, author } = req.body;

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Blog ID" });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (category) updateData.category = category;
        if (published_at) updateData.published_at = new Date(published_at);
        if (author) updateData.author = author;

        // ✅ Xử lý upload ảnh
        if (req.files && req.files.thumbnail) {
            const image = req.files.thumbnail;
            const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedMimeTypes.includes(image.mimetype)) {
                return res.status(400).send({ error: "Chỉ hỗ trợ JPG, PNG, WEBP!" });
            }
            updateData.thumbnail = `data:${image.mimetype};base64,${image.data.toString("base64")}`;
        } else if (existingThumbnail) {
            updateData.thumbnail = existingThumbnail; // Giữ ảnh cũ
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({ error: "Không có dữ liệu để cập nhật!" });
        }

        const updateResult = await blogCollection().updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send({ error: "Blog not found" });
        }

        const updatedItem = await blogCollection().findOne({ _id: new ObjectId(req.params.id) });
        res.send(updatedItem);

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Xóa blog
exports.deleteBlog = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Blog ID" });
        }

        const result = await blogCollection().findOne({ _id: new ObjectId(req.params.id) });
        if (!result) {
            return res.status(404).send({ error: "Blog not found" });
        }

        await blogCollection().deleteOne({ _id: new ObjectId(req.params.id) });
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};