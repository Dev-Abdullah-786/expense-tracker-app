import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";
import expenseModel from "../model/expenseModel.js";

export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;
  if (!description || !amount || !category || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newExpense = new expenseModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllExpense(req, res) {
  const userId = req.user._id;
  try {
    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;
  try {
    const updateexpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount },
      { new: true },
    );
    if (!updateexpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updateexpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const expense = await expenseModel.findOneAndDelete({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function downloadExpenseExcel(req, res) {
  const userId = req.user._id;
  try {
    const expense = await expenseModel.find({ userId }).sort({ date: -1 });
    const plainData = expense.map((inc) => ({
      Description: inc.description,
      Amount: inc.amount,
      Category: inc.category,
      Date: new Date(inc.date).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
    XLSX.writeFile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx");

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getExpenseOverview(req, res) {
  const userId = req.user._id;
  const { range = "monthly" } = req.query;
  const { start, end } = getDateRange(range);
  try {
    const expenses = await expenseModel
      .find({ userId, date: { $gte: start, $lte: end } })
      .sort({ date: -1 });

    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
    const numberOfTransactions = expenses.length;

    const recentTransactions = expenses.slice(0, 9);

    res.status(200).json({
      success: true,
      message: "Expense Overview fetched successfully",
      data:{
        totalExpense,
        averageExpense,
        numberOfTransactions, 
        recentTransactions,
        range
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
