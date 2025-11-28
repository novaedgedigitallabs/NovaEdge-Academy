const User = require("../models/User");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { encrypt, decrypt } = require("../utils/encryption");
const sendToken = require("../utils/jwtToken");

// 1. Start Enrollment (Generate Secret)
exports.enroll2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("+twoFactor.tempSecret");

        // Generate new secret
        const secret = authenticator.generateSecret();

        // Encrypt and store temporarily
        user.twoFactor.tempSecret = encrypt(secret);
        user.twoFactor.tempSecretExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Generate QR Code
        const otpauth = authenticator.keyuri(user.email, "NovaEdge Academy", secret);
        const imageUrl = await qrcode.toDataURL(otpauth);

        res.status(200).json({
            success: true,
            qrCode: imageUrl,
            secret: secret, // Send plaintext secret once for manual entry
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Verify Enrollment & Enable
exports.verify2FA = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user.id).select("+twoFactor.tempSecret");

        if (!user.twoFactor.tempSecret || user.twoFactor.tempSecretExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Enrollment session expired. Start over." });
        }

        const secret = decrypt(user.twoFactor.tempSecret);
        const isValid = authenticator.check(code, secret);

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid code" });
        }

        // Enable 2FA
        user.twoFactor.enabled = true;
        user.twoFactor.secret = user.twoFactor.tempSecret; // Move temp to permanent
        user.twoFactor.tempSecret = undefined;
        user.twoFactor.tempSecretExpires = undefined;

        // Generate Backup Codes
        const backupCodes = Array(8).fill(0).map(() => crypto.randomBytes(4).toString("hex"));
        const hashedBackupCodes = await Promise.all(backupCodes.map(async (code) => {
            const salt = await bcrypt.genSalt(10);
            return { code: await bcrypt.hash(code, salt), used: false };
        }));

        user.twoFactor.backupCodes = hashedBackupCodes;
        await user.save();

        res.status(200).json({
            success: true,
            message: "2FA Enabled successfully",
            backupCodes: backupCodes, // Send plaintext once
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Login with 2FA
exports.login2FA = async (req, res) => {
    try {
        const { tempToken, code, isBackupCode } = req.body;

        if (!tempToken) {
            return res.status(400).json({ success: false, message: "Missing temporary token" });
        }

        // Verify temp token (assuming it contains userId)
        // In a real app, we'd sign a specific "2fa-pending" token. 
        // For simplicity, we'll assume the client sends the userId or a short-lived JWT.
        // Let's decode the temp token.
        const decoded = require("jsonwebtoken").verify(tempToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("+twoFactor.secret +twoFactor.backupCodes");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        if (!user.twoFactor.enabled) {
            return res.status(400).json({ success: false, message: "2FA is not enabled for this user" });
        }

        let isValid = false;

        if (isBackupCode) {
            // Check backup codes
            const backupCodeObj = user.twoFactor.backupCodes.find(bc => !bc.used); // Naive check, need to compare all
            // Actually we need to loop and compare bcrypt
            for (let bc of user.twoFactor.backupCodes) {
                if (!bc.used && await bcrypt.compare(code, bc.code)) {
                    isValid = true;
                    bc.used = true;
                    await user.save();
                    break;
                }
            }
        } else {
            // Check TOTP
            const secret = decrypt(user.twoFactor.secret);
            isValid = authenticator.check(code, secret);
        }

        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid 2FA code" });
        }

        // Success - Issue full token
        await sendToken(user, 200, res, req);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Disable 2FA
exports.disable2FA = async (req, res) => {
    try {
        const { password, code } = req.body;
        const user = await User.findById(req.user.id).select("+password +twoFactor.secret");

        // Verify password first
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        // Verify TOTP code (Double security)
        const secret = decrypt(user.twoFactor.secret);
        const isValid = authenticator.check(code, secret);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid 2FA code" });
        }

        user.twoFactor.enabled = false;
        user.twoFactor.secret = undefined;
        user.twoFactor.backupCodes = [];
        await user.save();

        res.status(200).json({ success: true, message: "2FA Disabled" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get 2FA Status
exports.get2FAStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            enabled: user.twoFactor.enabled,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
