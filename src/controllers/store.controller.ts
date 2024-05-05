import { Request, Response } from "express";
import { Store } from "../models/store.model";
import { UserType } from "../types";
import User from "../models/user.model";

export const createStore = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { storeName, address, state, city, imageUrl, mobileNumber } =
      req.body;

    if (!userId) {
      return res.status(403).json({ message: "userId is not provided" });
    }

    if (!storeName || !address || !state || !city || !mobileNumber) {
      return res.status(401).json({ message: "All fields are required" });
    }

    // check for valid user;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(403).json({ message: "Invalid user" });
    }

    // allow one user to create only one store ; a single user can not able to create multiple stores;

    // TODO: [Future scope] : premium users can able to create multiple stores

    const userHasStore = await Store.findOne({ ownerId: user._id });

    if (userHasStore) {
      return res
        .status(403)
        .json({ msg: "You are not allowed to create multiple stores" });
    }

    // check for the storeName because storeName must be unique;

    const isStoreNameTaken = await Store.findOne({ storeName });
    if (isStoreNameTaken) {
      return res.status(401).json({ message: "Store name already taken" });
    }

    // creating store;
    const store = await Store.create({
      ownerId: user._id,
      ownerName: user.username,
      storeName,
      address,
      state,
      city,
      imageUrl,
      mobileNumber,
    });

    return res.status(201).json({ message: "Store created", store });
  } catch (error) {
    console.log(`ERROR_IN_CREATE_STORE_CONTROLLER, ${error}`);
    return res
      .status(500)
      .json({ message: "ERROR_IN_CREATE-STORE_CONTROLLER" });
  }
};

export const getMyStore = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const store = await Store.findOne({ ownerId: userId });
    if (!store) {
      return res.status(404).json({ message: "No store found" });
    }

    return res.status(200).json(store);
  } catch (error) {
    console.log(`ERROR_IN_GETMYSTORE_CONTROLLER,${error}`);
    return res.status(500).json({ message: "ERROR_IN_GETMYSTORE_CONTROLLER" });
  }
};
