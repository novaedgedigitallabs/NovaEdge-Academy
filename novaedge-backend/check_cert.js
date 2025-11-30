const mongoose = require("mongoose");
const Certificate = require("./models/Certificate");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const connectDB = require("./config/db");

const checkCert = async () => {
    try {
        await connectDB();
        const id = "CERT-26cb-3e22-6F0FE5";
        const cert = await Certificate.findOne({ certificateId: id });
        console.log("Certificate found:", cert);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCert();
