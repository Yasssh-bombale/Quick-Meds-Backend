import { Request, Response } from "express";
import { Store } from "../models/store.model";
import User from "../models/user.model";

export const getPendingApplications = async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user?.isAdmin) {
      return res.status(403).json("You are not allowed to access admin routes");
    }

    const stores = await Store.find({ status: "pending" });
    if (stores.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(stores);
  } catch (error) {
    console.log(`ERROR:IN PENDING-APPLICATIONS-CONTROLLER,${error}`);
    return res.status(500).json("ERROR:IN PENDING-APPLICATIONS-CONTROLLER");
  }
};
