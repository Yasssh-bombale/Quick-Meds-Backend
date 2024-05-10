import express from "express";
import {
  getAllUsers,
  getUpdatedMyUser,
  updateMyUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.get("/getall", isAuthenticated, getAllUsers);
router.post("/my/update/:userId", updateMyUser); //updateMyUserProfile
router.get("/my/updated/:userId", getUpdatedMyUser); //getupdatedUser;

export default router;
