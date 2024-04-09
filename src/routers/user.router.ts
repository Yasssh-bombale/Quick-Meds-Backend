import express from "express";
import { getAllUsers } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.get("/getall", isAuthenticated, getAllUsers);

export default router;
