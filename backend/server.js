import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/connectDB.js";
import userRouter from "./routes/userRoute.js";
import incomeRouter from "./routes/incomeRoute.js";
import expenseRouter from "./routes/expenseRoute.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use("/api/user", userRouter)
app.use("/api/income", incomeRouter)
app.use("/api/expense", expenseRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
