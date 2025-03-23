const { getDB } = require("../../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const customerCollection = () => getDB().collection("Customer");
const secretKey = process.env.JWT_SECRET;
const saltRounds = 10;
const { ObjectId } = require("mongodb"); 

//  Cấu hình gửi email (dùng Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        customer: "your-email@gmail.com",
        pass: "your-email-password",
    },
});

//  Gửi email reset mật khẩu
const sendResetEmail = async (email, resetToken) => {
    const resetLink = `http://localhost:4200/reset-password/${resetToken}`;

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Reset Your Password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

//  Đăng ký tài khoản khách hàng
exports.registerCustomer = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, address, password } = req.body;

        if (!first_name || !last_name || !email || !phone_number || !password) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingCustomer = await customerCollection().findOne({ email });
        if (existingCustomer) {
            return res.status(400).send({ error: "Email already in use" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tạo tài khoản khách hàng
        const newCustomer = {
            first_name,
            last_name,
            email,
            phone_number,
            address,
            password: hashedPassword,
            buying_points: 0,
            created_at: new Date(),
        };

        await customerCollection().insertOne(newCustomer);

        res.send({ success: true, message: "Registration successful" });

    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

//  Đăng nhập khách hàng
exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await customerCollection().findOne({ email });

        if (!customer) return res.status(400).json({ error: "Customer not found" });

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ customerId: customer._id, role: "customer" }, secretKey, { expiresIn: "12h" });

        res.json({ success: true, token, customerId: customer._id });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  Gửi email đặt lại mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Kiểm tra email có tồn tại không
        const customer = await customerCollection().findOne({ email });
        if (!customer) return res.status(400).json({ error: "Email not found" });

        // Tạo token reset mật khẩu (có thời hạn 15 phút)
        const resetToken = jwt.sign({ customerId: customer._id }, secretKey, { expiresIn: "15m" });

        // Gửi email chứa link reset mật khẩu
        await sendResetEmail(email, resetToken);

        res.json({ success: true, message: "Reset password email sent" });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  Đặt lại mật khẩu (khi người dùng click vào link email)
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Xác minh token
        const decoded = jwt.verify(resetToken, secretKey);
        const customerId = decoded.customerId;

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Cập nhật mật khẩu trong database
        await customerCollection().updateOne(
            { _id: new ObjectId(customerId) },
            { $set: { password: hashedPassword } }
        );

        res.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
};
// Đổi mật khẩu (khi khách hàng đã đăng nhập)
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const customerId = req.user.customerId; // 🔥 Đã sửa từ req.customer thành req.user

        if (!customerId) {
            return res.status(401).json({ error: "Unauthorized - No customer ID in token" });
        }

        // Tìm khách hàng theo ID
        const customer = await customerCollection().findOne({ _id: new ObjectId(customerId) });

        if (!customer) return res.status(400).json({ error: "Customer not found" });

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, customer.password);
        if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Cập nhật mật khẩu
        await customerCollection().updateOne(
            { _id: new ObjectId(customerId) },
            { $set: { password: hashedPassword } }
        );

        res.json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Đăng xuất khách hàng
exports.logoutCustomer = async (req, res) => {
    try {
        // Trên thực tế, logout ở client chỉ cần xoá token khỏi localStorage/cookie
        res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
