import express from "express";

import { getUsers } from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


//get all users
router.get("/",authMiddleware,getUsers);


export default router;