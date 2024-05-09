import { Request, Response } from "express";
import { Store } from "../models/store.model";
import User from "../models/user.model";
import Order from "../models/store-orders.model";

export const createOrder = async (req: Request, res: Response) => {
  const { imageUrl, prescription, city, state, address } = req.body;
  const { storeId, userId } = req.query;

  if (!storeId || !userId) {
    return res
      .status(400)
      .json({ message: "Both storeId and userId is required" });
  }

  if (!imageUrl || !prescription || !city || !state || !address) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    //check for storeId is valid or not;
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Invalid storeId" });
    }
    //if storeId is valid check userId is valid or not;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Invalid userId",
      });
    }

    //if both storeId and userId is valid;
    // create Order;
    const order = await Order.create({
      storeId,
      userId,
      orderedBy: user.username,
      userProfile: user.profilePicture,
      prescriptionImage: imageUrl,
      prescription,
      city,
      state,
      address,
    });

    return res.status(201).json({
      message: "Order created",
      order,
    });
  } catch (error) {
    console.log(`ERROR:IN CREATE-ORDER-CONTROLLER, ${error}`);
    return res.status(500).json({
      message: "ERROR:IN CREATE-STORE",
    });
  }
};
