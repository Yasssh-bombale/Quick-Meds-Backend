import { Request, Response } from "express";
import Conversation from "../models/conversation.model";
import { Store } from "../models/store.model";
import User from "../models/user.model";
import mongoose from "mongoose";

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

    const conversations = await Conversation.find({
      storeId: store._id,
      userId: clickedUserId,
    });

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

//allowing only storeOwners to create type=order of conversations;

export const createStoreOwnerConversaiton = async (
  req: Request,
  res: Response
) => {
  try {
    const { ownerId, clickedUserId } = req.query;
    const { prescriptionImage, prescription: message, amount } = req.body;

    if (!ownerId || !clickedUserId) {
      return res.status(403).json("All query params is required");
    }

    if (!prescriptionImage || !message || !amount) {
      return res.status(400).json("All fiedls are required");
    }

    //step1:find the store;
    //step2:then find all the conversaiton that clicked user made on the above store;
    //step3:then create owner response as message to thise above finded conversations array;

    //step1:
    const store = await Store.findOne({ ownerId });
    if (!store) {
      return res.status(404).json("No store found");
    }

    //step2:
    let conversations = await Conversation.find({ userId: clickedUserId });

    if (conversations.length === 0) {
      return res.status(404).json("No conversations found");
    }

    //finding userName and userProfile to display it on conversation page because it is collapsing when we are not passing name and profile we need to give clickedUserProfile and name;

    const user = await User.findById(clickedUserId);
    if (!user) {
      return res.status(403).json("Invalid clicked user");
    }

    const ownerResponse = new Conversation({
      _id: new mongoose.Types.ObjectId(),
      storeId: store._id,
      userId: clickedUserId, //as we fetch conversation based on clickeduser;if we pass here ownerId then it will not be in the same conversation;
      prescriptionImage,
      senderName: user.username,
      senderProfile: user.profilePicture,
      type: "order",
      amount,
      role: "owner",
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });
    await ownerResponse.save();
    return res.status(201).json(ownerResponse);
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

export const getSpecificConversation = async (req: Request, res: Response) => {
  const { conversationId, userId } = req.query;
  if (!conversationId || !userId) {
    return res.status(400).json("Both conversationId and userId is required");
  }
  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: userId,
    });
    if (!conversation) {
      return res.status(404).json("No conversation found");
    }

    //we need to pass store details to;
    const store = await Store.findById(conversation.storeId);
    if (!store) {
      return res.status(404).json("Invalid store");
    }

    const response = {
      conversation,
      store,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.log(`ERROR:IN GETTING SPECIFIC CONVERSATION CONTROLLER:${error}`);
    return res
      .status(500)
      .json("ERROR:IN GETTING SPECIFIC CONVERSATION CONTROLLER");
  }
};
