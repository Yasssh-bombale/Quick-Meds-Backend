import { Request, Response } from "express";
import { Store } from "../models/store.model";
import { UserType } from "../types";
import User from "../models/user.model";

export const test = (req: Request, res: Response) => {
  res.send("ok");
};
export const createStore = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { storeName, address, state, city, imageUrl, mobileNumber } =
      req.body;

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (
      !storeName ||
      !address ||
      !state ||
      !city ||
      !imageUrl ||
      !mobileNumber
    ) {
      return res.status(401).json({ message: "All fields are required" });
    }

    // check for valid user;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(403).json({ message: "Invalid user" });
    }

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
  }
};
