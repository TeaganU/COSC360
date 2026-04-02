import express from "express";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} from "./posts.controller.js";

const router = express.Router();

// READ + SEARCH (query params)
router.get("/", getPosts);
router.get("/:id", getPost);

// CREATE
router.post("/", createPost);

// UPDATE
router.put("/:id", updatePost);

// DELETE
router.delete("/:id", deletePost);

export default router;
