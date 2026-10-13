import express from "express"

import { sendMessage, getMessage} from "../controllers/messageController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/:conversationId",authMiddleware,getMessage)

router.post("/",authMiddleware,sendMessage)


export default router;