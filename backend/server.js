import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use("/api/user", userRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
