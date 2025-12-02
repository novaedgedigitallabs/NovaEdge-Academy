const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriends,
    getFriendStatus,
    removeFriend,
} = require("../controllers/friend");

router.use(isAuthenticatedUser);

router.route("/request/send").post(sendFriendRequest);
router.route("/request/accept").post(acceptFriendRequest);
router.route("/request/reject").post(rejectFriendRequest);
router.route("/requests").get(getFriendRequests);
router.route("/list").get(getFriends);
router.route("/status/:otherUserId").get(getFriendStatus);
router.route("/remove").post(removeFriend);

module.exports = router;
