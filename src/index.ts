import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import storeRouter from "./routers/store.router";
import orderRouter from "./routers/store-orders.route";
import { MongoConnection } from "./database/mongoDB";
import cookieParser from "cookie-parser";

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

app.get("/health", (req: Request, res: Response) => {
  return res.json({ message: "Health OK!" });
});

app.listen(process.env.PORT, () => {
  MongoConnection();
  console.log(`Backend running on PORT : http://localhost:${process.env.PORT}`);
});
