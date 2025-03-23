const { getDB } = require("../../database");
const { ObjectId } = require("mongodb");

const customerCollection = () => getDB().collection("Customer");

// ✅ API: Get All Customers (Admin Only)
exports.getCustomers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden. Only admins can access this." });
        }

        const customers = await customerCollection().find({}).toArray();
        res.json({ success: true, customers });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ API: Get Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid Customer ID" });

        const customerId = new ObjectId(id);
        const requestUserId = new ObjectId(req.user.customerId);

        if (req.user.role === "customer" && !customerId.equals(requestUserId)) {
            return res.status(403).json({ error: "Forbidden. You can only access your own data." });
        }

        const customer = await customerCollection().findOne({ _id: customerId });
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        res.json({ success: true, customer });
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ API: Update Customer (Includes Address Handling)
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid Customer ID" });

        const customerId = new ObjectId(id);
        const requestUserId = new ObjectId(req.user.customerId);
        const { first_name, last_name, email, phone_number, buying_points, address_update } = req.body;

        let updateData = {};

        // 🛠 Permission Handling
        if (req.user.role === "customer") {
            if (!customerId.equals(requestUserId)) {
                return res.status(403).json({ error: "Forbidden. You can only update your own data." });
            }
            updateData = { ...(first_name && { first_name }), ...(last_name && { last_name }), ...(email && { email }) };
        } else if (req.user.role === "admin") {
            updateData = { ...(first_name && { first_name }), ...(last_name && { last_name }), ...(email && { email }), ...(phone_number && { phone_number }), ...(buying_points !== undefined ? { buying_points } : {}) };
        }

        // 🛠 Address Updates
        if (address_update) {
            const customer = await customerCollection().findOne({ _id: customerId });
            if (!customer) return res.status(404).json({ error: "Customer not found" });

            let updatedAddresses = customer.address_array || [];

            switch (address_update.action) {
                case "add":
                    if (!address_update.new_address) {
                        return res.status(400).json({ error: "New address data required." });
                    }
                    updatedAddresses.push(address_update.new_address);
                    break;

                case "update":
                    if (address_update.index === undefined || address_update.index < 0 || address_update.index >= updatedAddresses.length) {
                        return res.status(400).json({ error: "Invalid address index." });
                    }
                    updatedAddresses[address_update.index] = { ...updatedAddresses[address_update.index], ...address_update.new_address };
                    break;

                case "delete":
                    if (address_update.index === undefined || address_update.index < 0 || address_update.index >= updatedAddresses.length) {
                        return res.status(400).json({ error: "Invalid address index." });
                    }
                    updatedAddresses.splice(address_update.index, 1);
                    break;

                default:
                    return res.status(400).json({ error: "Invalid address update action." });
            }

            updateData.address_array = updatedAddresses;
        }

        // Apply Update
        if (Object.keys(updateData).length > 0) {
            await customerCollection().updateOne({ _id: customerId }, { $set: updateData });
        }

        const updatedCustomer = await customerCollection().findOne({ _id: customerId });
        res.json({ success: true, message: "Customer updated successfully", customer: updatedCustomer });

    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
