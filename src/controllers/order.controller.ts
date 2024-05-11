import { Request, Response } from "express";
import { Store } from "../models/store.model";
import User from "../models/user.model";
import Order from "../models/store-orders.model";

export const createOrder = async (req: Request, res: Response) => {
  const { imageUrl, prescription } = req.body;
  const { storeId, userId } = req.query;

  if (!storeId || !userId) {
    return res
      .status(400)
      .json({ message: "Both storeId and userId is required" });
  }

  if (!imageUrl || !prescription) {
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

    //checking if user has city,state,address,mobileNumber or not;
    if (!user.city || !user.state || !user.address || !user.mobileNumber) {
      return res.status(403).json({
        message: "Shipping address is missing kindly update your profile",
      });
    }

    //if both storeId and userId is valid;
    // create Order;
    const order = await Order.create({
      storeId,
      userId,
      orderedBy: user.username,
      customerMobileNumber: user.mobileNumber,
      userProfile: user.profilePicture,
      prescriptionImage: imageUrl,
      prescription,
      deliveryCity: user.city,
      deliveryState: user.state,
      deliveryAddress: user.address,
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

// get orders for current signed in user;
export const getUserOrders = async (req: Request, res: Response) => {
  const { userId, storeId } = req.query;
  if (!userId || !storeId) {
    return res.status(403).json("Both userId and storeId is required");
  }
  const query = {
    userId,
    storeId,
  };
  try {
    const orders = await Order.find(query);
    if (orders.length === 0) {
      return res.status(404).json([]); //No orders found;
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.log(`ERROR:IN GET-USER-ORDERS,${error}`);
    return res.status(500).json("ERROR:IN GET-USER-ORDERS");
  }
};
