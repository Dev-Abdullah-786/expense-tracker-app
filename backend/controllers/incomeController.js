import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import incomeModel from "../model/incomeModel.js";
import getDateRange from "../utils/dateFilter.js";

export async function addIncome(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;
  if (!description || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newIncome = new incomeModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllIncome(req, res) {
  const userId = req.user._id;
  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      income,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;
  try {
    const updateIncome = await incomeModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );
    if (!updateIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: updateIncome,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const income = await incomeModel.findOneAndDelete({ _id: id, userId });
    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function downloadIncomeExcel(req, res) {
  const userId = req.user._id;
  try {
    const income = await incomeModel.find({ userId }).sort({ date: -1 });

    const plainData = income.map((inc) => ({
      Description: inc.description,
      Amount: inc.amount,
      Category: inc.category,
      Date: new Date(inc.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income Records");

    const fileName = `income_${Date.now()}.xlsx`;
    const filePath = path.join(process.cwd(), fileName);

    XLSX.writeFile(workbook, filePath);

    res.download(filePath, `income_details_${Date.now()}.xlsx`, (err) => {
      if (err) {
        console.error("Download error:", err);
      }
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getIncomeOverview(req, res) {
  const userId = req.user._id;
  const { range = "monthly" } = req.query;
  const { start, end } = getDateRange(range);
  try {
    const incomes = await incomeModel
      .find({ userId, date: { $gte: start, $lte: end } })
      .sort({ date: -1 });

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;

    const recentTransactions = incomes.slice(0, 9);

    res.status(200).json({
      success: true,
      message: "Income Overview fetched successfully",
      data: {
        totalIncome,
        averageIncome,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
