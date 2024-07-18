import { Router } from "express";
import {
  createUserMessage,
  getUserMessages,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/create", createUserMessage);
router.get("/get", getUserMessages);

export default router;
