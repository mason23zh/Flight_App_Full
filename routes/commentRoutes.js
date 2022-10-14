const express = require("express");
const { getAllComments, createComment, setCommentUserId } = require("../controllers/Comments/commentControllers");
const { protect, restrictTo } = require("../controllers/authControllers");

const router = express.Router();

router.route("/").get(protect, restrictTo("admin"), getAllComments).post(protect, setCommentUserId, createComment);

module.exports = router;
