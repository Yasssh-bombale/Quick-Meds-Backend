import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller";

const router = Router();

router.post("/create", createOrder);
router.get("/my/get", getUserOrders); //getting orders for current user and based on stores; example if user is on Roy medicals then getting orders for roy medicals because there is an possibillities that user can order from multiple stores ;

export default router;
