import { Router } from "express";
import { createStore, getMyStore } from "../controllers/store.controller";

const router = Router();

router.post("/create/:userId", createStore);
router.get("/my/getstore/:userId", getMyStore); // get currentUser store;
export default router;
