import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import { Store } from "../models/store.model";
import User from "../models/user.model";

export const createUserMessage = async (req: Request, res: Response) => {
  const { userId, storeId } = req.query;
  const { prescriptionImage, prescription: message, type } = req.body;
  const role = "user";
  //IMPORTANT=> role: it can only be define at backend because user can able to update it as owner on frontend;
  if (!userId || !storeId) {
    return res.status(400).json("All query params is required");
  }

  if (!message) {
    return res.status(400).json("Both message and role is required");
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json("No user found");
    }

    const conversation = await Conversation.create({
      userId,
      storeId,
      senderName: user.username,
      senderProfile: user.profilePicture,
      type,
      role,
      prescriptionImage,
      message,
    });

    return res.status(201).json(conversation);
  } catch (error) {
    console.log(
      `ERROR:IN CONTROLLER:[CONVERSATION,Fun(createMessage)] ,${error}`
    );
    res.send(`ERROR: IN CONTROLLER:[CONVERSATION,Fun(createMessage)],${error}`);
  }
};

//finding conversation for the specified store and based on currentLogin user;
export const getUserMessages = async (req: Request, res: Response) => {
  const { userId, storeId } = req.query;

  if (!userId || !storeId) {
    return res.status(403).json("Both userId and storeId is required");
  }

  try {
    const query = {
      userId,
      storeId,
    };
    const conversations = await Conversation.find(query);

    if (conversations.length == 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(conversations);
  } catch (error) {
    console.log(
      `ERROR:IN CONTROLLER:[CONVERSATION,Fun(getMessages)] ,${error}`
    );
    res
      .status(500)
      .json(
        `ERROR: IN CONTROLLER:[CONVERSATION,Fun(getUserMessages)],${error}`
      );
  }
};

//finding conversation for storeOwners and get users all conversations on the specific store;;

export const getStoreConversations = async (req: Request, res: Response) => {
  const { userId, clickedUserId } = req.query; //this userId is storeOwners userId;
  if (!userId) {
    return res.status(403).json("userId is required");
  }
  try {
    // finding whether the currentUserHas store or not;
    const store = await Store.findOne({ ownerId: userId });
    if (!store) {
      return res.status(404).json("No store found");
    }

    //step1: i want to send below response only when storeOwner does not clicked any userMessage
    if (!clickedUserId) {
      // if user is owner of one of the stores;then finding all conversations on the store;
      const conversations = await Conversation.find({
        storeId: store._id,
      }).sort({
        createdAt: -1,
      });

      if (conversations.length === 0) {
        return res.status(200).json([]); //sending empty array to handle it on frontend;
      }
      // Remove duplicate conversations based on userId

      const uniqueArray: string[] = [];
      let demo: any = [];
      conversations.map((convo) => {
        if (!uniqueArray.includes(JSON.stringify(convo.userId))) {
          uniqueArray.push(JSON.stringify(convo.userId));
          demo = [...demo, convo];
        }
      });

      return res.status(200).json(demo);
    }

    //step2: if storeOwner clicks anyOneOfthe userMessages/clickedUserIds then send below response;

    const conversations = await Conversation.find({ userId: clickedUserId });

    return res.status(200).json(conversations);
  } catch (error) {
    console.log(
      `ERROR:IN CONTROLLER:[CONVERSATION,Fun(getStoreConversations)] ,${error}`
    );
    res
      .status(500)
      .json(
        `ERROR: IN CONTROLLER:[CONVERSATION,Fun(getStoreConversations)],${error}`
      );
  }
};
