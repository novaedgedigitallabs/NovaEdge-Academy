const mongoose = require("mongoose");
const Payment = require("./models/Payment");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const cleanDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const payments = await Payment.find({ status: "completed" });

        // Group by User and Course
        const uniquePayments = {};
        const duplicates = [];

        payments.forEach(p => {
            const key = `${p.user}-${p.course}`;
            if (uniquePayments[key]) {
                duplicates.push(p._id);
            } else {
                uniquePayments[key] = p._id;
            }
        });

        console.log(`Found ${duplicates.length} duplicate payments.`);

        if (duplicates.length > 0) {
            await Payment.deleteMany({ _id: { $in: duplicates } });
            console.log("Deleted duplicates.");
        }

        const newTotal = await Payment.countDocuments({ status: "completed" });
        console.log(`New Payment Count: ${newTotal}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

cleanDB();
