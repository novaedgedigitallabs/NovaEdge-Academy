const Message = require("../models/Message");
const User = require("../models/User");

// 1. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        // Verify they are friends
        const sender = await User.findById(senderId);
        if (!sender.friends.includes(receiverId)) {
            return res.status(403).json({ success: false, message: "You can only message friends" });
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message,
        });

        res.status(200).json({ success: true, message: newMessage });

        // Check for AI mention
        // Matches: @NovaEdge Academy "prompt" OR @NovaEdge Academy prompt
        // Case insensitive for name, but prompt extraction needs care.
        const aiRegex = /@NovaEdge\s+Academy\s+(.*)/i;
        const match = message.match(aiRegex);

        if (match) {
            const prompt = match[1].replace(/^"|"$/g, '').trim(); // Remove surrounding quotes if present

            if (prompt) {
                // Generate AI Response
                // We'll reuse the llmService. Since it expects 'context', we'll pass empty or minimal context.
                // Or we can create a specific function for general chat.
                // For now, let's use generateChatResponse with empty context but a modified prompt inside the service?
                // Actually, generateChatResponse is designed for RAG. Let's import the raw gemini model or adapt.
                // Let's adapt by passing a dummy context that says "General Knowledge".

                const { generateChatResponse } = require("../utils/llmService");

                // We run this asynchronously without waiting for it to respond to the user immediately
                // But since we already sent the response, this is fine.

                (async () => {
                    try {
                        const aiResponse = await generateChatResponse(prompt, [{ title: "General Knowledge", text: "You are a helpful AI assistant in a chat." }]);

                        // Save AI response as a message from the SENDER to the RECEIVER (so it appears in the chat flow)
                        // But marked as isAi: true
                        await Message.create({
                            sender: senderId, // It appears as if the user said it (or we could flip it, but schema requires User ID)
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

// 3. Mark as Read (Optional for now, but good structure)
exports.markAsRead = async (req, res) => {
    // Implementation for marking messages as read
    res.status(200).json({ success: true });
};
