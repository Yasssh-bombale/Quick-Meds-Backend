import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import authRouter from "./routers/auth.router";
import { MongoConnection } from "./database/mongoDB";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 8000;

config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.listen(process.env.PORT, () => {
  MongoConnection();
  console.log(`Backend running on PORT : http://localhost:${process.env.PORT}`);
});
