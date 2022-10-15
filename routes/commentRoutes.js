const express = require("express");
const {
    getAllComments,
    createComment,
    setCommentUserId,
    deleteComment,
    updateComment,
} = require("../controllers/Comments/commentControllers");
const { protect, restrictTo } = require("../controllers/authControllers");

const router = express.Router();

router.route("/").get(protect, restrictTo("admin"), getAllComments).post(protect, setCommentUserId, createComment);

router.route("/:id").delete(protect, deleteComment).patch(protect, updateComment);

module.exports = router;
