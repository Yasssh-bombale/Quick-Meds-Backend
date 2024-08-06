import express from "express";
import { getPendingApplications } from "../controllers/admin.controller";

const router = express.Router();

router.get("/applications", getPendingApplications);

export default router;
