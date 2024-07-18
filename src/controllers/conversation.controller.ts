import { Request, Response } from "express";
import Conversation from "../models/conversation.model";

export const createMessage = async (req: Request, res: Response) => {
  const { userId, storeId } = req.query;
  const { prescriptionImage, message, role, type } = req.body;
  if (!userId || !storeId) {
    return res.status(400).json("All query params is required");
  }

  if (!message || !role) {
    return res.status(400).json("Both message and role is required");
  }

  try {
    const conversation = await Conversation.create({
      userId,
      storeId,
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
export const getMessages = async (req: Request, res: Response) => {
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
      .json(`ERROR: IN CONTROLLER:[CONVERSATION,Fun(getMessages)],${error}`);
  }
};
