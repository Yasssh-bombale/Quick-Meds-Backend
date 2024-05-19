import { Router } from "express";
import {
  createOrder,
  getOrdersForStore,
  getUserOrderFromAllStores,
  getUserOrders,
  outOfStockHandler,
  placeOrder,
} from "../controllers/order.controller";

const router = Router();

router.post("/create", createOrder);
router.get("/my/get", getUserOrders); //getting orders for current user and based on stores; example if user is on Roy medicals then getting orders for roy medicals because there is an possibillities that user can order from multiple stores ;

router.get("/store-owner/:userId", getOrdersForStore); //getting order for the storeOwner;
router.get("/my/all/:userId", getUserOrderFromAllStores); //getting order for user from all stores
router.post("/place", placeOrder); //place order only for owner of the store;
router.post("/outofstock", outOfStockHandler); //out-of-stock order only for owner of the store;

export default router;
