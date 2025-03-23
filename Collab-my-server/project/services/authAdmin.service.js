const { getDB } = require("../../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const adminCollection = () => getDB().collection("Admin");
const secretKey = process.env.JWT_SECRET;
const saltRounds = 10;

// Đăng nhập admin
exports.loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await adminCollection().findOne({ email });
  
      if (!admin) return res.status(400).json({ error: "Admin not found" });
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid password" });
  
// Cập nhật last_login
await adminCollection().updateOne(
    { _id: admin._id },
    { $set: { last_login: new Date() } }
  );

      const token = jwt.sign({ adminId: admin._id, role: "admin" }, secretKey, { expiresIn: "24h" });
  
      // Trả về thông tin người dùng
      res.json({ 
        success: true, 
        token, 
        adminId: admin._id, 
        username: admin.username, // Giả sử username được lưu trong collection Admin
        role: "admin" 
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

// Cấu hình gửi email (dùng Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
    },
});

// Gửi email reset mật khẩu
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

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Kiểm tra email có tồn tại không
      const admin = await adminCollection().findOne({ email });
      if (!admin) {
        console.log("Email not found:", email);
        return res.status(400).json({ error: "Email not found" });
      }
  
      // Tạo token reset mật khẩu (có thời hạn 15 phút)
      const resetToken = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: "15m" });
      console.log("Reset token generated:", resetToken);
  
      // Giả định gửi email thành công và mã code mặc định là 1234567
      console.log("Reset password email sent to:", email);
      console.log("Default code sent: 1234567");
  
      res.json({ success: true, message: "Reset password email sent" });
  
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


// Xác nhận mã code để đặt lại mật khẩu
exports.confirmCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Kiểm tra email có tồn tại không
        const admin = await adminCollection().findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: "Email not found" });
        }

        // Mã code mặc định là 1234567
        const defaultCode = "1234567";

        // Kiểm tra mã code nhập vào có khớp với mã code mặc định không
        if (code !== defaultCode) {
            return res.status(400).json({ error: "Invalid code" });
        }

        // Tạo token reset mật khẩu (có thời hạn 15 phút)
        const resetToken = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: "15m" });

        // Trả về resetToken để client sử dụng
        res.json({ success: true, resetToken });

    } catch (error) {
        console.error("Error in confirmCode:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Đặt lại mật khẩu (khi người dùng click vào link email)
exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Xác minh token
        const decoded = jwt.verify(resetToken, secretKey);
        const adminId = decoded.adminId;

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Cập nhật mật khẩu trong database
        const updateResult = await adminCollection().updateOne(
            { _id: adminId },
            { $set: { password: hashedPassword } }
        );

        // Kiểm tra xem có bản ghi nào được cập nhật không
        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ error: "Failed to update password" });
        }

        res.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(400).json({ error: "Invalid or expired token" });
    }
};

// Logout Admin
exports.logoutAdmin = async (req, res) => {
    try {
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
