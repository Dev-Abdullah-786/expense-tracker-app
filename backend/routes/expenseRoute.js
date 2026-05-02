import express from "express";
import {
  addExpense,
  deleteExpense,
  updateExpense,
  getAllExpense,
  getExpenseOverview,
  downloadExpenseExcel,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/auth.js";

const expenseRouter = express.Router();

expenseRouter
  .post("/add", authMiddleware, addExpense)
  .get("/get", authMiddleware, getAllExpense)
  .put("/update/:id", authMiddleware, updateExpense)
  .get("/overview", authMiddleware, getExpenseOverview)
  .get("/downloadexcel", authMiddleware, downloadExpenseExcel)
  .delete("/delete/:id", authMiddleware, deleteExpense);

export default expenseRouter;
