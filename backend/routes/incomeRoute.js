import express from "express";
import {
  addIncome,
  deleteIncome,
  updateIncome,
  getAllIncome,
  getIncomeOverview,
  downloadIncomeExcel,
} from "../controllers/incomeController.js";
import authMiddleware from "../middleware/auth.js";

const incomeRouter = express.Router();

incomeRouter
  .post("/add", authMiddleware, addIncome)
  .get("/get", authMiddleware, getAllIncome)
  .put("/update/:id", authMiddleware, updateIncome)
  .get("/overview", authMiddleware, getIncomeOverview)
  .get("/downloadexcel", authMiddleware, downloadIncomeExcel)
  .delete("/delete/:id", authMiddleware, deleteIncome);

export default incomeRouter;
