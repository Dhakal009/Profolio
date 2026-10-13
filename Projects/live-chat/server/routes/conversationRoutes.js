import express from "express";

import { createOrGetConversation } from "../controllers/conversationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()


router.post("/",authMiddleware,createOrGetConversation)


export default router;
