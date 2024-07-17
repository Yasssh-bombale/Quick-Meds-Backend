import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/create", createMessage);
router.get("/get", getMessages);

export default router;
