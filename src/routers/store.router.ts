import { Router } from "express";
import {
  createStore,
  getAllStores,
  getMyStore,
  getStoreDetials,
  isUserHasStore,
} from "../controllers/store.controller";

const router = Router();

router.post("/create/:userId", createStore);
router.get("/my/getstore/:userId", getMyStore); // get currentUser store;
router.get("/details/:id", getStoreDetials);
router.get("/all", getAllStores);

// check for user has store;
router.get("/has-store/:userId", isUserHasStore);
export default router;
