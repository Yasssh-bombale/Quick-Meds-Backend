import { Router } from "express";
import {
  createStore,
  getAllStores,
  getMyStore,
  getStoreDetials,
} from "../controllers/store.controller";

const router = Router();

router.post("/create/:userId", createStore);
router.get("/my/getstore/:userId", getMyStore); // get currentUser store;
router.get("/details/:id", getStoreDetials);
router.get("/all", getAllStores);
export default router;
