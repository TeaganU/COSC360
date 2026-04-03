import express from "express";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    incrementPostViews,
    addComment,
    incrementPostLikes,
} from "./posts.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/:id/view", incrementPostViews);
router.post("/:id/like", requireAuth, incrementPostLikes);

router.post("/", requireAuth, createPost);
router.patch("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);
router.post("/:id/comments", requireAuth, addComment);

export default router;
