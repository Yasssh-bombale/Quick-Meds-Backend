import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import storeRouter from "./routers/store.router";
import orderRouter from "./routers/store-orders.route";
import conversationRouter from "./routers/conversation.route";
import adminRouter from "./routers/admin.route";
import { MongoConnection } from "./database/mongoDB";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import Conversation from "./models/conversation.model";
import { Store } from "./models/store.model";
import Order from "./models/store-orders.model";
import User from "./models/user.model";
const app = express();
const PORT = 8000;

config();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/store", storeRouter);
app.use("/api/order", orderRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (req: Request, res: Response) => {
  return res.json({ message: "Health OK!" });
});
//testing orders;
app.post("/orders", async (req: Request, res: Response) => {
  const { amount } = req.body;
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID as string,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET,
  });
  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "reciept#1",
      payment_capture: true,
    });

    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.log("ERROR:WHILE TESTING RAZORPAY ORDER", error);
  }
});

interface PaymentQueryParams {
  paymentId: string;
  conversationId: string;
  userId: string;
}

//fetch payment;
app.post("/payment", async (req: Request, res: Response) => {
  const { paymentId, conversationId, userId } =
    req.query as unknown as PaymentQueryParams;

  if (!paymentId || !conversationId || !userId) {
    return res.json("All query params is required");
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_ID as string,
    key_secret: process.env.RAZORPAY_API_KEY_SECRET,
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment) {
      return res.status(404).json("ERROR WHILE FETCHING RAZORPAY PAYMENTS");
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json("No conversation found to create order");
    }
    const store = await Store.findById(conversation.storeId);
    if (!store) {
      return res.status(404).json("No store found to create order");
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("No user found");
    }
    // create order when all edge cases passes;
    const order = await Order.create({
      razorpay_paymentId: paymentId,
      conversationId,
      storeId: store._id,
      userId,
      paymentMode: "online",
      prescriptionImage: conversation.prescriptionImage,
      prescription: conversation.message,
      storeName: store.storeName,
      orderedBy: user.username,
      userProfile: user.profilePicture,
      customerMobileNumber: user.mobileNumber,
      deliveryCity: user.city,
      deliveryState: user.state,
      deliveryAddress: user.address,
    });

    if (!order) {
      return res.status(400).json("Unable to create order");
    }

    //set conversation to be ordered after the payment success and order stored in server;
    conversation.isOrdered = true;
    await conversation.save();
    let response = {
      paymentInfo: {
        paymentId,
        paymentStatus: payment.status,
        amountPaid: payment.amount,
        method: payment.method,
        currency: payment.currency,
      },
      orderInfo: {
        prescription: order.prescription,
        prescriptionImage: order.prescriptionImage,
      },
      deliveryInfo: {
        ordered_to: order.storeName,
        customerName: order.orderedBy,
        customer_profile: order.userProfile,
        mobileNumber: order.customerMobileNumber,
        state: order.deliveryState,
        city: order.deliveryCity,
        address: order.deliveryAddress,
      },
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log("ERROR:WHILE FETCHING PAYMENT", error);
  }
});
app.listen(process.env.PORT, () => {
  MongoConnection();
  console.log(`Backend running on PORT : http://localhost:${process.env.PORT}`);
});
