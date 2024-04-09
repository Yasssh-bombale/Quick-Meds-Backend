import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";

const app = express();
const PORT = 8000;

config();

app.use(cors({}));

app.get("/", (req: Request, res: Response) => {
  return res.send("HomePage");
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on PORT : http://localhost:${process.env.PORT}`);
});
