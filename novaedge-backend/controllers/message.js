const Message = require("../models/Message");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

// 1. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message, image } = req.body;
        const senderId = req.user.id;

        // Verify they are friends
        const sender = await User.findById(senderId);
        if (!sender.friends.includes(receiverId)) {
            return res.status(403).json({ success: false, message: "You can only message friends" });
        }

        if (!message && !image && !(req.files && req.files.image)) {
            return res.status(400).json({ success: false, message: "Message or image is required" });
        }

        let uploadedImage = null;

        if (req.files && req.files.image) {
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                folder: "lms_chat_images",
                quality: "auto:good",
                fetch_format: "auto",
                width: 1080,
                crop: "limit",
            });
            uploadedImage = {
                public_id: result.public_id,
                url: result.secure_url || result.url,
            };
        } else if (image && typeof image === "string" && image.startsWith("data:")) {
            const result = await cloudinary.uploader.upload(image, {
                folder: "lms_chat_images",
                quality: "auto:good",
                fetch_format: "auto",
                width: 1080,
                crop: "limit",
            });
            uploadedImage = {
                public_id: result.public_id,
                url: result.secure_url || result.url,
            };
        } else if (image && typeof image === "string" && image.startsWith("http")) {
            uploadedImage = {
                public_id: "external_url",
                url: image,
            };
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: message || "",
            image: uploadedImage || undefined,
        });

        res.status(200).json({ success: true, message: newMessage });

        // Check for AI mention if message text exists
        if (message) {
            const aiRegex = /@NovaEdge\s+Academy\s+(.*)/i;
            const match = message.match(aiRegex);

            if (match) {
                const prompt = match[1].replace(/^"|"$/g, '').trim();

                if (prompt) {
                    const { generateChatResponse } = require("../utils/llmService");

                    (async () => {
                        try {
                            const aiResponse = await generateChatResponse(prompt, [{ title: "General Knowledge", text: "You are a helpful AI assistant in a chat." }]);

                            await Message.create({
                                sender: senderId,
                                receiver: receiverId,
                                message: `**NovaEdge AI:** ${aiResponse.text}`,
                                isAi: true
                            });
                        } catch (err) {
                            console.error("AI Generation failed", err);
                        }
                    })();
                }
            }
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Messages (Chat History)
exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Mark as Read
exports.markAsRead = async (req, res) => {
    res.status(200).json({ success: true });
};
