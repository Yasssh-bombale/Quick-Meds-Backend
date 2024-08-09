import { Request, Response } from "express";
import { Store } from "../models/store.model";
import User from "../models/user.model";

export const createStore = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      storeName,
      address,
      state,
      city,
      storeImage: imageUrl,
      mobileNumber,
      license,
      ownerLivePicture,
    } = req.body;

    if (!userId) {
      return res.status(403).json({ message: "userId is not provided" });
    }

    if (
      !storeName ||
      !address ||
      !state ||
      !city ||
      !mobileNumber ||
      !ownerLivePicture ||
      !license
    ) {
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

    // creating store;
    const store = await Store.create({
      ownerId: user._id,
      ownerName: user.username,
      license,
      ownerLivePicture,
      storeName,
      address,
      state,
      city,
      imageUrl,
      mobileNumber,
    });

    return res
      .status(201)
      .json({ message: "Create store request sent", store });
  } catch (error) {
    console.log(`ERROR_IN_CREATE_STORE_CONTROLLER, ${error}`);
    return res
      .status(500)
      .json({ message: "ERROR_IN_CREATE-STORE_CONTROLLER" });
  }
};

// type UpdateStoreDataType = {
//   storeName?: string | undefined;
//   address?: string | undefined;
//   state?: string | undefined;
//   city?: string | undefined;
//   imageUrl?: string | undefined;
//   mobileNumber?: string | undefined;
// };
export const updateStore = async (req: Request, res: Response) => {
  const { userId } = req.query;
  const {
    storeName,
    address,
    state,
    city,
    storeImage: imageUrl,
    mobileNumber,
  } = req.body;
  if (!userId) {
    return res.status(400).json("userId is required");
  }
  try {
    // update store;
    // const fieldsToUpdate: UpdateStoreDataType = {
    //   storeName,
    //   address,
    //   state,
    //   city,
    //   imageUrl,
    //   mobileNumber,
    // };

    // const updateData: Partial<UpdateStoreDataType> = Object.keys(
    //   fieldsToUpdate
    // ).reduce((acc, key) => {
    //   if (fieldsToUpdate[key as keyof UpdateStoreDataType] !== undefined) {
    //     acc[key as keyof UpdateStoreDataType] =
    //       fieldsToUpdate[key as keyof UpdateStoreDataType];
    //   }
    //   return acc;
    // }, {} as Partial<UpdateStoreDataType>);

    const updatedStore = await Store.findOneAndUpdate(
      { ownerId: userId },
      {
        $set: {
          storeName,
          address,
          state,
          city,
          imageUrl,
          mobileNumber,
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).json(updatedStore);
  } catch (error) {
    console.log(`ERROR_IN_UPDATE_STORE_CONTROLLER, ${error}`);
    return res
      .status(500)
      .json({ message: "ERROR_IN_UPDATE-STORE_CONTROLLER" });
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

export const getAllStores = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const searchQuery = (req.query.searchQuery as string) || "";
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    let query: { status: string; [key: string]: any } = {
      status: "approved",
    };

    if (searchQuery) {
      query.$or = [
        { storeName: { $regex: searchQuery, $options: "i" } },
        { address: { $regex: searchQuery, $options: "i" } },
      ];
    }
    // $or: [
    //   { storeName: { $regex: searchQuery, $options: "i" } },
    //   { address: { $regex: searchQuery, $options: "i" } },
    // ],
    const stores = await Store.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize); //getting latest order

    if (stores.length === 0) {
      return res.status(404).json({ data: [] });
    }

    const total = await Store.countDocuments();

    const response = {
      data: stores,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(`ERROR_IN_GET-ALL-STORES, ${error}`);
  }
};

export const getStoreDetials = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Store Id is required" });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ message: "No store found" });
    }

    return res.status(200).json(store);
  } catch (error) {
    console.log(`ERROR:IN GetStoreDetails route, ${error}`);
  }
};

//check for user has any store or not;
export const isUserHasStore = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const store = await Store.findOne({ ownerId: userId });

    if (!store) {
      return res.status(404).json({ userHasStore: false });
    }
    return res.status(200).json({ userHasStore: true, store });
  } catch (error) {
    console.log(`ERROR:IN IS-USER-HAS-STORE-CONTROLLER,${error}`);
    return res.status(500).json("ERROR:IN IS-USER-HAS-STORE-CONTROLLER");
  }
};
