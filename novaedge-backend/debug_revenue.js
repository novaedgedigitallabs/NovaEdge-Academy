const mongoose = require("mongoose");
const Payment = require("./models/Payment");
const Enrollment = require("./models/Enrollment");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const paymentCount = await Payment.countDocuments({ status: "completed" });
        const enrollmentCount = await Enrollment.countDocuments();

        const payments = await Payment.find({ status: "completed" });
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        console.log(`Total Payments (Completed): ${paymentCount}`);
        console.log(`Total Enrollments: ${enrollmentCount}`);
        console.log(`Total Revenue (Sum of amounts): ${totalRevenue}`);

        console.log("--- Payment Details ---");
        payments.forEach(p => {
            console.log(`ID: ${p._id}, Amount: ${p.amount}, User: ${p.user}, Course: ${p.course}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
