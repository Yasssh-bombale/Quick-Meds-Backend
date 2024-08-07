import express from "express";
import {
  approveApplication,
  getPendingApplications,
  rejectApplications,
} from "../controllers/admin.controller";

const router = express.Router();

router.get("/applications", getPendingApplications);
router.post("/applications/reject", rejectApplications);
router.post("/applications/approve", approveApplication);

export default router;
