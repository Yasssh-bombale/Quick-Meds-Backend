import { Router } from "express";
import { createStore } from "../controllers/store.controller";

const router = Router();

router.post("/create/:userId", createStore);

export default router;
