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

//get orders for storeOwners;
export const getOrdersForStore = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    //check whether the user is owner of the store or not;
    const store = await Store.findOne({ ownerId: userId });
    if (!store) {
      return res
        .status(404)
        .json({ message: "You have no store kindly create new one" });
    }

    //if use is owner of any one of the stores then checking orders for the store;
    const orders = await Order.find({ storeId: store._id });

    //count total number of orders on store;

    const totalOrders = await Order.countDocuments({ storeId: store._id });

    //if store has any orders then return orders for the store;

    const response = {
      totalOrders,
      storeDetails: {
        storeName: store.storeName,
        storeImage: store.imageUrl,
      },
      orders,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(`ERROR:IN GET-ORDERS-FOR-STORES ,${error}`);
    return res.status(500).json("ERROR:IN GET-ORDERS-FOR-STORES");
  }
};

export const placeOrder = async (req: Request, res: Response) => {
  const { userId, orderId } = req.query;
  if (!userId || !orderId) {
    return res.status(400).json("Both userId and storeId is required");
  }
  try {
    const store = await Store.findOne({ ownerId: userId }); //check if user is owner or not;
    if (!store) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // if user is owner of the store then he has power to place order or reject order;

    // when user click on place order then update order to be placed;
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isOrderPlaced: true,
      },
      {
        new: true,
      }
    );

    //then return order placed message wih updated order;
    return res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    console.log(`ERROR:IN PLACE-ORDER-CONTROLLER ,${error}`);
    return res.status(500).json("ERROR:IN PLACE-ORDER-CONTROLLER");
  }
};

export const outOfStockHandler = async (req: Request, res: Response) => {
  const { userId, orderId } = req.query;
  if (!userId || !orderId) {
    return res.status(400).json("Both userId and storeId is required");
  }
  try {
    const store = await Store.findOne({ ownerId: userId }); //check if user is owner or not;
    if (!store) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // if user is owner of the store then he has power to make order out-of-stock or reject order;

    // when user click on out-of-stock order then update order to be order-out-of-stock;
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isOrderOutOffStock: true,
      },
      {
        new: true,
      }
    );

    //then return order placed message wih updated order;
    return res.status(201).json({ message: "make order outofstock!", order });
  } catch (error) {
    console.log(`ERROR:IN ORDER-OUTOFSTOCK-CONTROLLER ,${error}`);
    return res.status(500).json("ERROR:ORDER-OUTOFSTOCK-CONTROLLER");
  }
};
