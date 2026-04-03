import express from "express";
import { register, login } from "./auth.controller.js";
import uploadProfileImage from "../../config/multer.js";

const router = express.Router();

router.post("/signup", uploadProfileImage.single("profileImage"), register);
router.post("/login", login);

export default router;