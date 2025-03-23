const { MongoClient } = require("mongodb");
require("dotenv").config(); // Load biến môi trường từ .env

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "AppData";

const client = new MongoClient(MONGO_URI);
let database; // Lưu kết nối database

async function connectDB() {
    try {
        await client.connect();
        database = client.db(DB_NAME);
        console.log(`Kết nối MongoDB thành công: ${DB_NAME}`);
        return database;
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);
        process.exit(1);
    }
}

// ✅ Hàm lấy database sau khi kết nối thành công
function getDB() {
    if (!database) {
        throw new Error("Database chưa được kết nối! Hãy gọi connectDB() trước.");
    }
    return database;
}

async function disconnectDB() {
    try {
        await client.close();
        console.log("Đã đóng kết nối MongoDB");
    } catch (error) {
        console.error("Lỗi khi đóng MongoDB:", error);
    }
}

module.exports = { connectDB, getDB, disconnectDB };
