const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const adminCollection = () => getDB().collection("Admin");
const saltRounds = 10;

// ✅ Lấy danh sách admin
exports.getAdmins = async (req, res) => {
    try {
        const result = await adminCollection().find({}).toArray();
        res.send(result); 
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};


// ✅ Lấy thông tin admin theo ID
exports.getAdminById = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Admin ID" });
        }

        const admin = await adminCollection().findOne({ _id: new ObjectId(req.params.id) });

        if (!admin) {
            return res.status(404).send({ error: "Admin not found" });
        }

        res.send(admin);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Thêm admin mới
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password ,} = req.body;

        if (!username || !email || !password ) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = {
            username,
            email,
            password: hashedPassword, // Lưu mật khẩu đã mã hóa
            created_at: new Date(),
            last_login: null
        };

        await adminCollection().insertOne(newAdmin);
        res.send({ success: true, message: "Admin added", admin: newAdmin });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Cập nhật admin
exports.updateAdmin = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Admin ID" });
        }

        const { username, email, password, last_login } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (last_login) updateData.last_login = new Date(last_login);

        // Nếu có password mới, mã hóa trước khi cập nhật
        if (password) {
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updateResult = await adminCollection().updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send({ error: "Admin not found" });
        }

        const updatedAdmin = await adminCollection().findOne({ _id: new ObjectId(req.params.id) });
        res.send({ success: true, message: "Admin updated", admin: updatedAdmin });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

// ✅ Xóa admin
exports.deleteAdmin = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send({ error: "Invalid Admin ID" });
        }

        const admin = await adminCollection().findOne({ _id: new ObjectId(req.params.id) });

        if (!admin) {
            return res.status(404).send({ error: "Admin not found" });
        }

        await adminCollection().deleteOne({ _id: new ObjectId(req.params.id) });
        res.send({ success: true, message: "Admin deleted", admin });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};
