const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// Middleware kiểm tra token (Bắt buộc)
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token provided");
        return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("Invalid Token:", err.message);
            return res.status(403).json({ error: "Forbidden - Invalid token" });
        }

        console.log("Decoded User:", user);

        // ✅ Nếu là admin, chỉ cần `adminId`
        if (user.adminId) {
            req.user = { ...user, adminId: user.adminId.toString() };
            return next();
        }

        // ✅ Nếu là khách hàng, bắt buộc có `customerId`
        if (user.customerId) {
            req.user = { ...user, customerId: user.customerId.toString() };
            return next();
        }

        console.log("Missing adminId or customerId in token payload");
        return res.status(403).json({ error: "Forbidden - Invalid token payload" });
    });
};

// Middleware kiểm tra quyền (Role)
exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        console.log("User Role:", req.user?.role);
        console.log("Required Roles:", roles);
        
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden - Access denied" });
        }
        next();
    };
};

// Middleware kiểm tra token (Tùy chọn, không bắt buộc)
exports.authenticateOptionalJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        req.user = null; // Không có token → user chưa đăng nhập
        return next();
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("Optional JWT Invalid:", err.message);
            req.user = null;
        } else {
            if (user.adminId) {
                req.user = { ...user, adminId: user.adminId.toString() };
            } else if (user.customerId) {
                req.user = { ...user, customerId: user.customerId.toString() };
            } else {
                console.log("Missing adminId or customerId in optional token payload");
                req.user = null;
            }
        }
        next();
    });
};
