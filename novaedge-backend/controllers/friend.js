const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");

// 1. Send Friend Request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id;

        if (senderId === receiverId) {
            return res.status(400).json({ success: false, message: "You cannot send a friend request to yourself" });
        }

        // Check if users are already friends
        const sender = await User.findById(senderId);
        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({ success: false, message: "You are already friends" });
        }

        // Check if request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: "Friend request already pending" });
        }

        await FriendRequest.create({
            sender: senderId,
            receiver: receiverId,
        });

        res.status(200).json({ success: true, message: "Friend request sent" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user.id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: "Friend request not found" });
        }

        if (request.receiver.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to accept this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ success: false, message: "Request already processed" });
        }

        request.status = "accepted";
        await request.save();

        // Add to friends list for both users
        const sender = await User.findById(request.sender);
        const receiver = await User.findById(request.receiver);

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        res.status(200).json({ success: true, message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Reject Friend Request
exports.rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user.id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: "Friend request not found" });
        }

        if (request.receiver.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not authorized to reject this request" });
        }

        request.status = "rejected";
        await request.save();

        res.status(200).json({ success: true, message: "Friend request rejected" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get Friend Requests (Received)
exports.getFriendRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            receiver: req.user.id,
            status: "pending",
        }).populate("sender", "name avatar username");

        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Get Friends List
exports.getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("friends", "name avatar username email");
        res.status(200).json({ success: true, friends: user.friends });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Check Friend Status
exports.getFriendStatus = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (user.friends.includes(otherUserId)) {
            return res.status(200).json({ success: true, status: "friends" });
        }

        const pendingRequest = await FriendRequest.findOne({
            $or: [
                { sender: userId, receiver: otherUserId, status: "pending" },
                { sender: otherUserId, receiver: userId, status: "pending" },
            ],
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === userId) {
                return res.status(200).json({ success: true, status: "sent", requestId: pendingRequest._id });
            } else {
                return res.status(200).json({ success: true, status: "received", requestId: pendingRequest._id });
            }
        }

        res.status(200).json({ success: true, status: "none" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Remove Friend
exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        // Also delete any friend requests between them
        await FriendRequest.deleteMany({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        });

        res.status(200).json({ success: true, message: "Friend removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
