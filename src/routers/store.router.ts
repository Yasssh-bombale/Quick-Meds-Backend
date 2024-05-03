import { Router } from "express";
import { test } from "../controllers/store.controller";

const router = Router();

router.get("/", test);

export default router;
