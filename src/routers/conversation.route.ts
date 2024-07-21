import { Router } from "express";
import {
  createStoreOwnerConversaiton,
  createUserMessage,
  getStoreConversations,
  getUserMessages,
} from "../controllers/conversation.controller";

const router = Router();

router.post("/create", createUserMessage);
router.get("/get", getUserMessages);
router.get("/store/get", getStoreConversations); //all conversations on stores;
router.post("/owner/create", createStoreOwnerConversaiton);

export default router;
