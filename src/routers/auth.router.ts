import express from "express";
import {
  google,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller";
import {
  validateUserSignInRequest,
  validateUserSignUpRequest,
} from "../middleware/validations";
// import { signUp } from "../controllers/auth.controller";

const router = express.Router();
router.post("/signup", validateUserSignUpRequest, signUp);
router.post("/signin", validateUserSignInRequest, signIn);
router.get("/signout", signOut);
router.post("/google", google);
export default router;
