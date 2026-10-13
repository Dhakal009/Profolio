import express from "express"

import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js"

import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

// public route
router.post("/register",registerUser);
router.post("/login",loginUser)

// protected route
router.get("/me",authMiddleware,getCurrentUser)

export default router;