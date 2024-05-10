import { Request, Response } from "express";
import User from "../models/user.model";
import { customRequest } from "../middleware/auth";

export const getAllUsers = async (req: customRequest, res: Response) => {
  try {
    const user = await User.find({});
    console.log(req.user);

    return res.status(200).json({ user });
  } catch (error) {
    console.log(`ERROR ${error}`);
  }
};

export const updateMyUser = async (req: Request, res: Response) => {
  const { city, state, address, mobileNumber } = req.body;
  const { userId } = req.params;
  if (!city || !state || !address || !mobileNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!userId) {
    return res.status(403).json({ message: "userId is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    user.city = city;
    user.state = state;
    user.address = address;
    user.mobileNumber = mobileNumber;
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    console.log(`ERROR:UPDATE-MYUSER-CONTROLLER,${error}`);
    return res.status(500).json("ERROR:UPDATE-MYUSER-CONTROLLER");
  }
};

// get updated user; updated infors are city,state,address,mobileNumber;

export const getUpdatedMyUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    //check whether the currentSignedIn user is updated their info or not??
    if (
      !user ||
      !user.city ||
      !user.state ||
      !user.address ||
      !user.mobileNumber
    ) {
      return res.status(403).json("Kindly update your profile");
    }

    // if they updated their info;
    return res.status(200).json(user);
  } catch (error) {
    console.log(`ERROR:IN GET-MYUPDATEDUSER-CONTROLLER,${error}`);
    return res.status(500).json("ERROR:IN GET-MYUPDATEDUSER-CONTROLLER");
  }
};
