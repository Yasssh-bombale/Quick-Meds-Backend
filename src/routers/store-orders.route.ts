import { Router } from "express";
import {
  createOrder,
  getOrdersForStore,
  getUserOrders,
} from "../controllers/order.controller";

const router = Router();

router.post("/create", createOrder);
router.get("/my/get", getUserOrders); //getting orders for current user and based on stores; example if user is on Roy medicals then getting orders for roy medicals because there is an possibillities that user can order from multiple stores ;

router.get("/store-owner/:userId", getOrdersForStore); //getting order for the storeOwner;

export default router;
