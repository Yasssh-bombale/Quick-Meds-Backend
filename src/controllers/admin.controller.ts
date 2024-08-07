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
export const rejectApplications = async (req: Request, res: Response) => {
  const { userId, storeId } = req.query;

  if (!userId || !storeId) {
    return res.status(400).json("All query params are required");
  }

  const { selectedReasons } = req.body;

  try {
    //check if user is admin or not;
    const user = await User.findById(userId);
    if (!user?.isAdmin) {
      return res.status(403).json("unauthorized request");
    }

    const store = await Store.findByIdAndUpdate(
      storeId,
      {
        $set: {
          isApproved: false,
          status: "rejected",
          rejectionReasons: req.body,
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(store);
  } catch (error) {
    console.log(`ERROR:IN rejectApplications-APPLICATIONS-CONTROLLER,${error}`);
    return res
      .status(500)
      .json("ERROR:IN rejectApplications-APPLICATIONS-CONTROLLER");
  }
};
export const approveApplication = async (req: Request, res: Response) => {
  const { userId, storeId } = req.query;

  if (!userId || !storeId) {
    return res.status(400).json("All query params are required");
  }

  try {
    //check if user is admin or not;
    const user = await User.findById(userId);
    if (!user?.isAdmin) {
      return res.status(403).json("unauthorized request");
    }

    const store = await Store.findByIdAndUpdate(
      storeId,
      {
        $set: {
          isApproved: true,
          status: "approved",
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(store);
  } catch (error) {
    console.log(`ERROR:IN rejectApplications-APPLICATIONS-CONTROLLER,${error}`);
    return res
      .status(500)
      .json("ERROR:IN rejectApplications-APPLICATIONS-CONTROLLER");
  }
};
