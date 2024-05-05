import { Router } from "express";
import {
  createStore,
  getAllStores,
  getMyStore,
} from "../controllers/store.controller";

const router = Router();

router.post("/create/:userId", createStore);
router.get("/my/getstore/:userId", getMyStore); // get currentUser store;
router.get("/all", getAllStores);
export default router;
